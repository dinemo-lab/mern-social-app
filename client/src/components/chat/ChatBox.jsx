import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Send, User, MessageSquare, MoreHorizontal } from "lucide-react";

const ChatBox = ({ chatId, userId, userName}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_LOCAL_URL}`, {
      withCredentials: true,
      transports: ['websocket']
    });
    setSocket(newSocket);

    // Clean up on unmount
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

    // Listen for new messages
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      // When a message is received, that user is no longer typing
      setTypingUsers(prev => {
        const newTypingUsers = { ...prev };
        delete newTypingUsers[message.sender];
        return newTypingUsers;
      });
    };
    
    // Listen for typing indicators
    const handleUserTyping = ({ userId, username }) => {
      setTypingUsers(prev => ({
        ...prev,
        [userId]: { id: userId, name: username || "User", timestamp: Date.now() }
      }));
    };

    // Listen for stopped typing
    const handleUserStoppedTyping = ({ userId }) => {
      setTypingUsers(prev => {
        const newTypingUsers = { ...prev };
        delete newTypingUsers[userId];
        return newTypingUsers;
      });
    };
    
    socket.on("receiveMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);
    
    // Clean up listeners when component unmounts or chatId changes
    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
      socket.emit("leaveChat", chatId);
    };
  }, [socket, chatId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Clean up typing users who haven't updated their status in 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => {
        const newTypingUsers = { ...prev };
        Object.keys(newTypingUsers).forEach(key => {
          if (now - newTypingUsers[key].timestamp > 3000) {
            delete newTypingUsers[key];
          }
        });
        return newTypingUsers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle typing indicator
  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);
  
    if (!socket) return;
  
    // If user wasn't typing before, emit typing event
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { chatId, userId, username: userName }); // Use the actual username
    }
  
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  
    // Set new timeout to stop typing indicator after 2 seconds of inactivity
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
      timestamp: new Date().toISOString()
    };

    // Send the message to the server
    socket.emit("sendMessage", message);
    
    // Clear typing indicator
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit("stoppedTyping", { chatId, userId });
    
    setNewMessage("");
  };

  // Handle Enter key press
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
  const activeTypingUsers = Object.values(typingUsers).filter(user => user.id !== userId);

  return (
    <div className="flex flex-col h-[500px] rounded-xl overflow-hidden border border-purple-100 bg-white">
      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-br from-white to-purple-50">
        {messages.length > 0 ? (
          messageGroups.map((group, groupIndex) => {
            const isCurrentUser = group[0].sender === userId;
            
            return (
              <div 
                key={groupIndex} 
                className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} space-y-2`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isCurrentUser ? 'bg-purple-600' : 'bg-gray-200'
                  }`}>
                    <User size={16} className={isCurrentUser ? 'text-white' : 'text-gray-600'} />
                    
                  </div>
                  <span className={`text-sm font-medium ${isCurrentUser ? 'text-purple-700' : 'text-gray-700'}`}>
                    {isCurrentUser ? 'You' : group[0].senderName || 'User'
                    
                    }
                  </span>
                </div>
                
                {group.map((message, msgIndex) => (
                  <div 
                    key={msgIndex} 
                    className={`max-w-xs ${isCurrentUser ? 'ml-8' : 'mr-8'}`}
                  >
                    <div 
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isCurrentUser 
                          ? 'bg-purple-600 text-white rounded-tr-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {msgIndex === group.length - 1 && (
                      <div className={`mt-1 text-xs ${isCurrentUser ? 'text-right text-purple-400' : 'text-left text-gray-400'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
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
            <h3 className="text-purple-800 font-medium text-lg">No messages yet</h3>
            <p className="text-purple-500 text-sm mt-1">Start the conversation!</p>
          </div>
        )}
        
        {/* Typing indicator */}
       
       
        
        {activeTypingUsers.length > 0 && (
          console.log("hii",activeTypingUsers),
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
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-purple-200 text-purple-400 cursor-not-allowed'
            } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;