import React from "react";
import ChatBox from "../components/chat/ChatBox";
import { useChat } from "../context/ChatContext";
import { Users, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const { currentChat } = useChat();
  const user = useSelector((state) => state.auth.user); // Access the current user from Redux

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-md border border-purple-100">
          <MessageSquare size={32} className="text-purple-500" />
        </div>
        <h2 className="text-purple-800 text-xl font-semibold mb-2">No Chat Selected</h2>
        <p className="text-purple-500 text-md">Please select a chat to start messaging</p>
      </div>
    );
  }

  console.log("Current Chat:", user); // Debugging line to check the current chat object

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white shadow-md rounded-t-2xl border border-purple-100 overflow-hidden mb-1">
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Group Chat</h1>
                <div className="flex items-center mt-1 text-purple-100">
                  <Users size={16} className="mr-2" />
                  <p className="text-sm">
                    {currentChat.members ? currentChat.members.length : "2"} members
                  </p>
                </div>
              </div>
              <div className="bg-black bg-opacity-20 px-4 py-2 rounded-full">
                <p className="text-sm font-medium">Active Now</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-purple-50 text-purple-700 text-sm font-medium border-b border-purple-100">
            <div className="flex items-center justify-between">
              <span>Chat Room ID: {currentChat._id}</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Chat Box Container */}
        <div className="bg-white shadow-md rounded-b-2xl border border-purple-100 p-6">
          <ChatBox chatId={currentChat._id} userId={user._id} userName={user.name} />
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-purple-400 text-sm">
          <p>Messages are end-to-end encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;