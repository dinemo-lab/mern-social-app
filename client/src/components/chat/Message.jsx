import React from "react";

const Message = ({ message, isCurrentUser }) => {
  return (
    <div
      className={`message mb-3 p-3 rounded-lg max-w-xs md:max-w-md ${
        isCurrentUser
          ? "bg-purple-500 text-white self-end"
          : "bg-gray-200 text-gray-800 self-start"
      }`}
    >
      <strong>{isCurrentUser ? "You" : message.sender}:</strong>{" "}
      <span>{message.content}</span>
    </div>
  );
};

export default Message;