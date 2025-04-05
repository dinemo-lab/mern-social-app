import express from "express";
import {
  createVisitRequest,
  getNearbyRequests,
  joinVisit,
  acceptParticipant,
  getAllVisitRequests,
  getVisitById,
  changeStatus,
  getMyVisits,
  updateVisitStatus,
} from "../controllers/visitControllers.js";

import protect from "../middleware/authMiddleware.js";
 

const router = express.Router();

// Static routes
router.get("/my-visits", protect, getMyVisits); // Get all visit requests for the user
router.get("/all", protect, getAllVisitRequests); // Get all visit requests
router.get("/nearby", protect, getNearbyRequests); // Get nearby visit requests

// Dynamic routes
router.get("/:id", protect, getVisitById); // Get visit details by ID
router.post("/:id/join", protect, joinVisit); // Join a visit request
router.post("/:id/accept", protect, acceptParticipant);
router.put("/:visitId/join-request/:requestId", protect, changeStatus); // Accept participant
router.put("/:visitId/status", protect, updateVisitStatus); // Change status of a visit request

// Create a visit request
router.post("/", protect, createVisitRequest);

export default router;
