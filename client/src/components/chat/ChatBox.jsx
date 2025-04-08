import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  Send,
  User,
  MessageSquare,
  DollarSign,
  Users,
  Plus,
  Minus,
} from "lucide-react";

const ChatBox = ({ chatId, userId, userName }) => {
  // State for chat functionality
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [userScrolled, setUserScrolled] = useState(false);

  // State for expense functionality
  const [expenses, setExpenses] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expensePaidBy, setExpensePaidBy] = useState(userId);
  const [expenseSplitBetween, setExpenseSplitBetween] = useState([]);
  const [showExpenseSummary, setShowExpenseSummary] = useState(false);
  const [balances, setBalances] = useState({});
  const [activeTab, setActiveTab] = useState("chat");

  // Sample users data - in a real app, this would come from props or API
  const [users] = useState([
    { id: userId, name: userName || "You" },
    { id: "user2", name: "User 2" },
    { id: "user3", name: "User 3" },
  ]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_LOCAL_URL}`, {
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  // Join chat room and handle messages when socket or chatId changes
  useEffect(() => {
    if (!socket || !chatId) return;

    // Join the chat room
    socket.emit("joinChat", chatId);

    // Load previous messages
    socket.emit("getMessages", chatId, (response) => {
      if (response.success) {
        setMessages(response.messages);
      }
    });

    // Load expenses
    socket.emit("getExpenses", chatId, (response) => {
      if (response.success) {
        setExpenses(response.expenses);
        calculateBalances(response.expenses);
      }
    });

    // Listen for new messages
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      setTypingUsers((prev) => {
        const newTypingUsers = { ...prev };
        delete newTypingUsers[message.sender];
        return newTypingUsers;
      });

      if (!userScrolled) {
        setShouldAutoScroll(true);
      }
    };

    // Listen for new expenses
 
    // Listen for typing indicators
    const handleUserTyping = ({ userId, username }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: {
          id: userId,
          name: username || "User",
          timestamp: Date.now(),
        },
      }));
    };

    // Listen for stopped typing
    const handleUserStoppedTyping = ({ userId }) => {
      setTypingUsers((prev) => {
        const newTypingUsers = { ...prev };
        delete newTypingUsers[userId];
        return newTypingUsers;
      });
    };

    socket.on("receiveMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("receiveMessage", handleNewMessage)
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
      socket.emit("leaveChat", chatId);
    };
  }, [socket, chatId, userScrolled, expenses]);

  useEffect(() => {
    if (!socket) return;

    const handleNewExpense = (expense) => {
      setExpenses((prev) => {
        const updatedExpenses = [...prev, expense];
       
        return updatedExpenses;
      });
    };

    const handleExpenseDeleted = (expenseId) => {
      setExpenses((prev) => prev.filter((expense) => expense._id !== expenseId));
    };
    

    socket.on("newExpense", handleNewExpense);
    socket.on("expenseDeleted", handleExpenseDeleted);
    

    return () => {
      socket.off("newExpense", handleNewExpense);
      socket.off("expenseDeleted", handleExpenseDeleted);
    };
  }, [socket]); // Only socket as dependency


  useEffect(() => {
    calculateBalances(expenses);
  }, [expenses]);

  //)
 

  // Handle sending a new expense
  const handleAddExpense = () => {
    if (
      !expenseDescription ||
      !expenseAmount ||
      expenseSplitBetween.length === 0
    ) {
      console.log("Validation failed - missing required fields");
      return;
    }

    const formattedSplitBetween = expenseSplitBetween.map((id) =>
      id.toString()
    );

    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      console.log("Invalid amount entered");
      return;
    }

    const expense = {
      chatId,
      description: expenseDescription,
      amount: amount,
      paidBy: expensePaidBy,
      splitBetween: formattedSplitBetween,
      timestamp: new Date().toISOString(),
    };

    if (!socket || !socket.connected) {
      console.error("Socket not connected");
      return;
    }

    socket.emit("addExpense", expense, (response) => {
      if (response?.success) {
        setExpenseDescription("");
        setExpenseAmount("");
        setExpenseSplitBetween([]);
        setShowExpenseForm(false);

        // No need to manually update state here as the newExpense event will handle it
      } else {
        console.error("Failed to add expense:", response?.error);
      }
    });
  };

  // Handle deleting an expense
  const handleDeleteExpense = (expenseId) => {
    socket.emit("deleteExpense", { chatId, expenseId });
  };

  // Toggle user in expense split
  const toggleUserInSplit = (userId) => {
    setExpenseSplitBetween((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Render the balances summary
// Updated renderBalances function with better object handling
const renderBalances = () => {
  const balancesList = [];
  const tempBalances = { ...balances };

  // Create simplified balances (who owes whom how much)
  const creditors = [];
  const debtors = [];

  // Helper function to safely get a user ID as string
  const safeUserId = (userIdentifier) => {
    if (userIdentifier === null || userIdentifier === undefined) {
      return "unknown";
    }
    
    // If it's an object with _id or id property
    if (typeof userIdentifier === 'object') {
      return String(userIdentifier._id || userIdentifier.id || JSON.stringify(userIdentifier));
    }
    
    // Otherwise, convert to string
    return String(userIdentifier);
  };

  // Separate into creditors and debtors
  Object.entries(tempBalances).forEach(([userIdentifier, balance]) => {
    const userId = safeUserId(userIdentifier);
    
    if (balance > 0.01) {
      // Creditor
      creditors.push({ userId, amount: balance });
    } else if (balance < -0.01) {
      // Debtor
      debtors.push({ userId, amount: -balance }); // Store as positive
    }
  });

  // Sort largest to smallest
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // Distribute debts to creditors
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amount = Math.min(creditor.amount, debtor.amount);

    if (amount > 0.01) {
      // Ignore tiny amounts
      balancesList.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: amount.toFixed(2),
      });

      creditor.amount -= amount;
      debtor.amount -= amount;
    }

    if (creditor.amount < 0.01) creditorIndex++;
    if (debtor.amount < 0.01) debtorIndex++;
  }

  // Advanced user name lookup function
  const getUserDisplayName = (userIdentifier) => {
    // Handle null/undefined
    if (userIdentifier === null || userIdentifier === undefined) {
      return "Unknown User";
    }
    
    // Safe string representation of the ID
    const idStr = safeUserId(userIdentifier);
    
    // First check: Is this the current user?
    if (idStr === String(userId)) {
      return "You";
    }
    
    // Try to find in users array
    for (const user of users) {
      const userId = safeUserId(user.id || user._id);
      if (userId === idStr) {
        return user.name;
      }
    }
    
    // If the identifier itself is an object with a name property, use that
    if (typeof userIdentifier === 'object' && userIdentifier.name) {
      return userIdentifier.name;
    }
    
    // Fallback: return abbreviated ID
    return idStr.length > 8 
      ? `User ${idStr.substring(0, 6)}...` 
      : `User ${idStr}`;
  };

  return (
    <div className="mt-4">
      <h3 className="font-medium text-gray-700 mb-2">Balances</h3>
      {balancesList.length > 0 ? (
        <ul className="space-y-2">
          {balancesList.map((balance, index) => {
            const fromUserName = getUserDisplayName(balance.from);
            const toUserName = getUserDisplayName(balance.to);

            return (
              <li key={index} className="text-sm bg-gray-50 p-2 rounded">
                <span className="font-medium">{fromUserName}</span> owes{" "}
                <span className="font-medium">{toUserName}</span>: $
                {balance.amount}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No balances to settle</p>
      )}
    </div>
  );
};

// And let's also update the calculateBalances function to ensure consistent ID handling
const calculateBalances = (expenses) => {
  const balances = {};

  // Helper function to safely get a user ID as string
  const safeUserId = (userIdentifier) => {
    if (userIdentifier === null || userIdentifier === undefined) {
      return "unknown";
    }
    
    // If it's an object with _id or id property
    if (typeof userIdentifier === 'object') {
      return String(userIdentifier._id || userIdentifier.id || JSON.stringify(userIdentifier));
    }
    
    // Otherwise, convert to string
    return String(userIdentifier);
  };

  expenses.forEach((expense) => {
    const paidById = safeUserId(expense.paidBy);
    const amountPerPerson = expense.amount / expense.splitBetween.length;

    // Add to the payer's balance
    if (!balances[paidById]) balances[paidById] = 0;
    balances[paidById] += expense.amount;

    // Subtract from each person who owes
    expense.splitBetween.forEach((splitUser) => {
      const splitUserId = safeUserId(splitUser);
      if (!balances[splitUserId]) balances[splitUserId] = 0;
      balances[splitUserId] -= amountPerPerson;
    });
  });

  setBalances(balances);
};

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollRef.current;
      if (!container) return;

      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50;

      if (!isAtBottom) {
        setUserScrolled(true);
      } else {
        setUserScrolled(false);
      }

      setShouldAutoScroll(isAtBottom);
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Auto-scroll behavior
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      const container = scrollRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages, shouldAutoScroll]);

  // Handle typing indicator
  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!socket) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { chatId, userId, username: userName });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stoppedTyping", { chatId, userId });
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!socket || newMessage.trim() === "") return;

    const message = {
      chatId,
      content: newMessage,
      sender: userId,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", message);
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit("stoppedTyping", { chatId, userId });

    setNewMessage("");

    if (scrollRef.current) {
      setUserScrolled(false);
      setShouldAutoScroll(true);
      setTimeout(() => {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by sender and consecutive sequence
  const getMessageGroups = () => {
    const groups = [];
    let currentGroup = [];

    messages.forEach((message, index) => {
      if (index === 0 || messages[index - 1].sender !== message.sender) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const messageGroups = getMessageGroups();
  const activeTypingUsers = Object.values(typingUsers).filter(
    (user) => user.id !== userId
  );


  console.log(expenses);
  return (
    <div className="flex flex-col h-[500px] rounded-xl overflow-hidden border border-purple-100 bg-white">
      {/* Tabs */}
      <div className="flex border-b border-purple-100">
        <button
          className={`flex-1 py-3 text-sm cursor-pointer font-medium ${
            activeTab === "chat"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          <div className="flex items-center justify-center space-x-2">
            <MessageSquare size={16} />
            <span>Chat</span>
          </div>
        </button>
        <button
          className={`flex-1 py-3 text-sm cursor-pointer font-medium ${
            activeTab === "expenses"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("expenses")}
        >
          <div className="flex items-center justify-center space-x-2">
            <DollarSign size={16} />
            <span>Expenses</span>
          </div>
        </button>
      </div>

      {activeTab === "chat" ? (
        <>
          {/* Messages Section */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-br from-white to-purple-50"
          >
            {messages.length > 0 ? (
              messageGroups.map((group, groupIndex) => {
                const isCurrentUser = group[0].sender === userId;

                return (
                  <div
                    key={groupIndex}
                    className={`flex flex-col ${
                      isCurrentUser ? "items-end" : "items-start"
                    } space-y-2`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          isCurrentUser ? "bg-purple-600" : "bg-gray-200"
                        }`}
                      >
                        <User
                          size={16}
                          className={
                            isCurrentUser ? "text-white" : "text-gray-600"
                          }
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isCurrentUser ? "text-purple-700" : "text-gray-700"
                        }`}
                      >
                        {isCurrentUser ? "You" : group[0].senderName || "User"}
                      </span>
                    </div>

                    {group.map((message, msgIndex) => (
                      <div
                        key={msgIndex}
                        className={`max-w-xs ${
                          isCurrentUser ? "ml-8" : "mr-8"
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            isCurrentUser
                              ? "bg-purple-600 text-white rounded-tr-none"
                              : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                        {msgIndex === group.length - 1 && (
                          <div
                            className={`mt-1 text-xs ${
                              isCurrentUser
                                ? "text-right text-purple-400"
                                : "text-left text-gray-400"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-purple-500" />
                </div>
                <h3 className="text-purple-800 font-medium text-lg">
                  No messages yet
                </h3>
                <p className="text-purple-500 text-sm mt-1">
                  Start the conversation!
                </p>
              </div>
            )}

            {/* Typing indicator */}
            {activeTypingUsers.length > 0 && (
              <div className="flex items-start space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm max-w-xs">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">
                      {activeTypingUsers.length === 1
                        ? `${activeTypingUsers[0].name} is typing`
                        : `${activeTypingUsers.length} people are typing`}
                    </span>
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-4 bg-white border-t border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-purple-50 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-purple-300 transition-all border border-purple-100">
                <textarea
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full bg-transparent border-none focus:outline-none text-gray-800 text-sm placeholder-purple-300 resize-none min-h-[40px] max-h-24"
                  rows="1"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-lg ${
                  newMessage.trim()
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-200 text-purple-400 cursor-not-allowed"
                } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-br from-white to-purple-50">
          {/* Expenses Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-purple-800">Expenses</h2>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                {showExpenseForm ? <Minus size={16} /> : <Plus size={16} />}
                <span>{showExpenseForm ? "Cancel" : "Add Expense"}</span>
              </button>
            </div>

            {showExpenseForm && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 mb-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={expenseDescription}
                      onChange={(e) => setExpenseDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                      placeholder="What was this for?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paid by
                    </label>
                    <select
                      value={expensePaidBy}
                      onChange={(e) => setExpensePaidBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Split between
                    </label>
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`split-${user.id}`}
                            checked={expenseSplitBetween.includes(user.id)}
                            onChange={() => toggleUserInSplit(user.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`split-${user.id}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {user.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleAddExpense}
                    disabled={
                      !expenseDescription ||
                      !expenseAmount ||
                      expenseSplitBetween.length === 0
                    }
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                      expenseDescription &&
                      expenseAmount &&
                      expenseSplitBetween.length > 0
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-purple-300 cursor-not-allowed"
                    } transition-colors`}
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <button
                onClick={() => setShowExpenseSummary(!showExpenseSummary)}
                className="flex items-center space-x-1 text-purple-600 text-sm font-medium"
              >
                <Users size={16} />
                <span>
                  {showExpenseSummary ? "Hide Balances" : "Show Balances"}
                </span>
              </button>
              {showExpenseSummary && renderBalances()}
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">
                Recent Expenses
              </h3>

            
              {expenses.length > 0 ? (
                <ul className="space-y-3">
                 {expenses.map((expense) => {
  // Fix the paidBy user lookup
  const paidByUser = users.find(u => 
    u.id === expense.paidBy || 
    u._id === expense.paidBy || 
    (typeof expense.paidBy === 'object' && u._id === expense.paidBy._id)
  ) || { 
    name: typeof expense.paidBy === 'object' ? 
      expense.paidBy.name : 
      users.find(u => u.id === expense.paidBy)?.name || `User ${expense.paidBy}`
  };

  const uniqueKey = expense._id 
    ? `expense-${expense._id}` 
    : `temp-${expense.timestamp}-${expense.description.replace(/\s+/g, '-').substring(0, 10)}`;

  return (
    <li key={uniqueKey} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{expense.description}</p>
          <p className="text-sm text-gray-500">${expense.amount.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">
            Paid by {
              (expense.paidBy === userId || 
              (typeof expense.paidBy === 'object' && expense.paidBy._id === userId)) 
                ? 'you' 
                : paidByUser.name
            } • {new Date(expense.timestamp).toLocaleDateString()}
          </p>
        </div>
        {expense.paidBy === userId && (
          <button 
            onClick={() => handleDeleteExpense(expense._id)} 
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
})}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <DollarSign size={24} className="text-purple-500" />
                  </div>
                  <h3 className="text-purple-800 font-medium text-lg">
                    No expenses yet
                  </h3>
                  <p className="text-purple-500 text-sm mt-1">
                    Add your first expense!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;