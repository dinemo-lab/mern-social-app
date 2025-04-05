import express from "express";
import { createChat, getChatByVisitId, requestToJoinChat, approveParticipant } from "../controllers/chatController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new chat for a visit
router.post("/", protect, createChat);

// Route to get a chat by visit ID
router.get("/:visitId", protect, getChatByVisitId);

// Route to request to join a chat
router.post("/:visitId/request", protect, requestToJoinChat);

// Route to approve a participant for a chat
router.post("/approve", protect, approveParticipant);

export default router;