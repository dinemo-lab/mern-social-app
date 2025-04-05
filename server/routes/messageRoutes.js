import express from "express";
import { sendMessage, getMessagesByChatId } from "../controllers/messageController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to send a message in a chat
router.post("/", protect, sendMessage);

// Route to get all messages for a specific chat
router.get("/:chatId", protect, getMessagesByChatId);

export default router;