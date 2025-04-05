import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

// Send a message in a chat
export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  try {
    // Check if the user is a participant in the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "You are not a participant in this chat" });
    }

    // Create and save the message
    const message = new Message({
      chatId,
      sender: req.user._id, // Assuming `req.user` is set by the authentication middleware
      content,
    });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};

// Get messages for a specific chat
export const getMessagesByChatId = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Check if the chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the user is a participant in the chat
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: "You are not a participant in this chat" });
    }

    // Fetch messages for the chat
    const messages = await Message.find({ chatId }).populate("sender", "name email");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};