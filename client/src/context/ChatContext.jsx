import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [currentChat, setCurrentChat] = useState(null);

  return (
    <ChatContext.Provider value={{ currentChat, setCurrentChat }}>
      {children}
    </ChatContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => useContext(ChatContext);