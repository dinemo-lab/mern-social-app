// In server.js or a separate socket.js file
import {Server} from "socket.io";
import mongoose from "mongoose";
import Message from "../models/message.model.js"
import User from "../models/user.models.js"; // Assuming you have a User model
import Expense from "../models/expense.model.js"; // Assuming you have an Expense model

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Store active users and their socket IDs
  const users = new Map();
  const userSockets = new Map();

  io.on("connection", (socket) => {
 
    // Handle user joining a chat room
    socket.on("joinChat", async (chatId) => {
      try {
        if (!chatId) {
          console.error("Invalid chatId:", chatId);
          return;
        }
        
         socket.join(chatId);
      } catch (error) {
        console.error("Error joining chat:", error);
      }
    });

    // Handle user leaving a chat room
    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
     });


     socket.on('addExpense', async (expenseData, callback) => {
      try {
        // Validate required fields
        if (!expenseData.chatId || !expenseData.description || 
            !expenseData.amount || !expenseData.paidBy || 
            !expenseData.splitBetween) {
          return callback({ success: false, error: 'Missing required fields' });
        }
    
        // Create and save the expense
        const expense = new Expense({
          chatId: expenseData.chatId,
          description: expenseData.description,
          amount: expenseData.amount,
          paidBy: expenseData.paidBy,
          splitBetween: expenseData.splitBetween,
          timestamp: expenseData.timestamp || new Date()
        });
    
        await expense.save();
    
        // Populate user data before sending
        const populatedExpense = await Expense.populate(expense, [
          { path: 'paidBy', select: 'username' },
          { path: 'splitBetween', select: 'username' }
        ]);
    
        // Emit to all users in the chat room
        io.to(expenseData.chatId).emit('newExpense', populatedExpense);
    
        callback({ success: true, expense: populatedExpense });
      } catch (error) {
        console.error('Error adding expense:', error);
        callback({ success: false, error: error.message });
      }
    });

    // Add this to your server code for better error handling
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Add ping/pong to monitor connection
socket.on('ping', (cb) => {
  if (typeof cb === 'function') {
    cb();
  }
});


socket.on("getChatMembers", async (chatId, callback) => {
  try {
    // Assuming you have a Chat model that tracks members
    // Or you might need to query messages/expenses to find participants
    const chatMembers = await User.find({
      // Your logic to find users in this chat
      // This depends on your schema - you might need to:
      // 1. Query messages to find senders
      // 2. Query expenses to find participants
      // 3. Or have a separate Chat model with members
    }).select('_id username name');

    if (!chatMembers || chatMembers.length === 0) {
      return callback({ success: false, error: 'No members found' });
    }

    callback({ success: true, members: chatMembers });
  } catch (error) {
    callback({ success: false, error: error.message });
  }
});

// Add these event handlers to your existing socket.io setup

// Get expense summary
socket.on('getExpenseSummary', async (chatId, callback) => {
  try {
    const expenses = await Expense.find({ chatId })
      .populate('paidBy', 'username name')
      .populate('splitBetween.user', 'username name');

    // Calculate balances (same logic as in controller)
    const balances = {};
    expenses.forEach(expense => {
      const paidById = expense.paidBy._id.toString();
      
      if (!balances[paidById]) {
        balances[paidById] = {
          user: expense.paidBy,
          totalPaid: 0,
          totalOwed: 0,
          netBalance: 0
        };
      }
      
      balances[paidById].totalPaid += expense.amount;

      expense.splitBetween.forEach(participant => {
        const participantId = participant.user._id.toString();
        
        if (participantId === paidById) return;
        
        if (!balances[participantId]) {
          balances[participantId] = {
            user: participant.user,
            totalPaid: 0,
            totalOwed: 0,
            netBalance: 0
          };
        }
        
        balances[participantId].totalOwed += participant.amountOwed;
      });
    });

    // Calculate net balances
    Object.keys(balances).forEach(userId => {
      balances[userId].netBalance = balances[userId].totalPaid - balances[userId].totalOwed;
    });

    // Calculate settlements
    const creditors = [];
    const debtors = [];
    
    Object.values(balances).forEach(balance => {
      if (balance.netBalance > 0) {
        creditors.push(balance);
      } else if (balance.netBalance < 0) {
        debtors.push({
          ...balance,
          netBalance: Math.abs(balance.netBalance)
        });
      }
    });

    // Sort by amount (descending)
    creditors.sort((a, b) => b.netBalance - a.netBalance);
    debtors.sort((a, b) => b.netBalance - a.netBalance);

    // Calculate settlements
    const settlements = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];
      
      const amount = Math.min(creditor.netBalance, debtor.netBalance);
      
      if (amount > 0.01) {
        settlements.push({
          from: debtor.user,
          to: creditor.user,
          amount: parseFloat(amount.toFixed(2))
        });
        
        creditor.netBalance -= amount;
        debtor.netBalance -= amount;
      }
      
      if (creditor.netBalance < 0.01) creditorIndex++;
      if (debtor.netBalance < 0.01) debtorIndex++;
    }

    callback({
      success: true,
      summary: {
        balances: Object.values(balances),
        settlements,
        totalExpenses: expenses.length,
        totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0)
      }
    });
  } catch (error) {
    callback({ success: false, error: error.message });
  }
});

// Mark expense as settled
socket.on('markExpenseSettled', async ({ chatId, expenseId, userId }, callback) => {
  try {
    const expense = await Expense.findById(expenseId)
      .populate('splitBetween.user', '_id');

    if (!expense) {
      return callback({ success: false, error: "Expense not found" });
    }

    // Check if user is part of the expense
    const isParticipant = expense.splitBetween.some(
      participant => participant.user._id.toString() === userId
    );

    if (!isParticipant) {
      return callback({ success: false, error: "Not authorized" });
    }

    expense.isSettled = true;
    await expense.save();

    // Emit to all users in the chat room
    io.to(chatId).emit('expenseUpdated', expense);

    callback({ success: true });
  } catch (error) {
    callback({ success: false, error: error.message });
  }
});


    socket.on('deleteExpense', async ({ chatId, expenseId }, callback) => {
      try {
        const expense = await Expense.findByIdAndDelete(expenseId);
  
        if (!expense) {
          return callback({ success: false, error: 'Expense not found' });
        }
  
        // Emit to all users in the chat room
        io.to(chatId).emit('expenseDeleted', expenseId);
  
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    socket.on('getExpenses', async (chatId, callback) => {
      try {
        const expenses = await Expense.find({ chatId })
          .sort({ timestamp: -1 })
          .populate('paidBy', 'username')
          .populate('splitBetween', 'username');
  
        callback({ success: true, expenses });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });



    // Handle sending a message
    socket.on("sendMessage", async (messageData) => {
      try {
        const { chatId, content, sender, timestamp } = messageData;
        
        if (!chatId || !content || !sender) {
          console.error("Invalid message data:", messageData);
          return;
        }

        // Get user information for displaying sender name
        const user = await User.findById(sender).select("name");
        
        // Create and save the message to the database
        const newMessage = new Message({
          chatId,
          sender,
          content,
          timestamp: timestamp || new Date()
        });
        
        await newMessage.save();
        
        // Broadcast the message to all users in the chat room
        const messageToSend = {
          ...newMessage._doc,
          senderName: user ? user.name : "Unknown User"
        };
        
        io.to(chatId).emit("receiveMessage", messageToSend);
       } catch (error) {
        console.error("Error sending message:", error);
      }
    });
    // On your server:
   socket.on("typing", ({ chatId, userId, username }) => {
    socket.to(chatId).emit("userTyping", { userId, username });
    });

   socket.on("stoppedTyping", ({ chatId, userId }) => {
   socket.to(chatId).emit("userStoppedTyping", { userId 
   });
   });

    // Fetch previous messages for a chat
    socket.on("getMessages", async (chatId, callback) => {
      try {
        if (!chatId) {
          callback({ success: false, error: "Invalid chat ID" });
          return;
        }
        
        const messages = await Message.find({ chatId })
          .sort({ timestamp: 1 })
          .limit(100)
          .populate("sender", "name")
          .lean();
        
        // Format messages with sender name for display
        const formattedMessages = messages.map(msg => ({
          ...msg,
          senderName: msg.sender ? msg.sender.name : "Unknown User"
        }));
        
        callback({ success: true, messages: formattedMessages });
      } catch (error) {
        console.error("Error fetching messages:", error);
        callback({ success: false, error: "Could not fetch messages" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      
      
      // Remove user from active users list
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          users.delete(userId);
          break;
        }
      }
    });
  });

  return io;
}

export default setupSocketIO;