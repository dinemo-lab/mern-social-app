// In server.js or a separate socket.js file
import {Server} from "socket.io";
import mongoose from "mongoose";
import Message from "../models/message.model.js"
import User from "../models/user.models.js"; // Assuming you have a User model

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
      console.log("User disconnected:", socket.id);
      
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