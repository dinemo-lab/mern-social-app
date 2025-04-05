import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

// Create a new chat for a visit
export const createChat = async (req, res) => {
  const { visitId, participants } = req.body;

  try {
    const chat = new Chat({ visitId, participants });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to create chat", error: error.message });
  }
};

// Get chat by visit ID
export const getChatByVisitId = async (req, res) => {
  const { visitId } = req.params;

  try {
    const chat = await Chat.findOne({ visitId }).populate("participants", "name email");
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chat", error: error.message });
  }
};

export const requestToJoinChat = async (req, res) => {
  const { visitId } = req.params;
  const userId = req.user._id; // Assuming `req.user` is set by authentication middleware

  try {
    const chat = await Chat.findOne({ visitId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the user is already a participant or pending
    if (chat.participants.includes(userId) || chat.pendingParticipants.includes(userId)) {
      return res.status(400).json({ message: "You have already requested to join or are a participant." });
    }

    // Add user to pendingParticipants
    chat.pendingParticipants.push(userId);
    await chat.save();

    res.status(200).json({ message: "Request to join sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to request to join chat", error: error.message });
  }
};

export const approveParticipant = async (req, res) => {
  const { visitId, userId } = req.body;

  try {
    const chat = await Chat.findOne({ visitId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the user is in the pending list
    if (!chat.pendingParticipants.includes(userId)) {
      return res.status(400).json({ message: "User is not in the pending list." });
    }

    // Move user from pendingParticipants to participants
    chat.pendingParticipants = chat.pendingParticipants.filter((id) => id.toString() !== userId);
    chat.participants.push(userId);
    await chat.save();

    res.status(200).json({ message: "User approved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve participant", error: error.message });
  }
};