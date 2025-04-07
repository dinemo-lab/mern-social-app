import VisitRequest from "../models/visitRequest.model.js";
import User from "../models/user.models.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/emailService.js";

// 📌 Create a new visit request
export const createVisitRequest = async (req, res) => {
    try {
      const { location, coordinates, date, description, maxParticipants,meetingPoint } = req.body;
  
      if (!location || !coordinates || !date) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const visitRequest = new VisitRequest({
        user: req.user._id, // From auth middleware
        location,
        coordinates,
        meetingPoint,
        date,
        description,
        maxParticipants,
      });
  
      await visitRequest.save();
      
       
 
      res.status(201).json(visitRequest);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  

// 📌 Get nearby visit requests (within 3 km)
export const getNearbyRequests = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: "Coordinates required" });
    }

    const nearbyVisits = await VisitRequest.find({
      coordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: 3000, // 3 km radius
        },
      },
      status: "open",
    }).populate("user", "name");

    if (nearbyVisits.length === 0) {
      return res.status(404).json({ message: "No nearby visit requests found" });
    }

    res.json(nearbyVisits);
  } catch (error) {
    console.error("Error in getNearbyRequests:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 Join a visit request
export const joinVisit = async (req, res) => {
  try {
    const visit = await VisitRequest.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({ message: "Visit request not found" });
    }

    // ✅ Add a check to avoid crashes
    if (!visit.coordinates || !Array.isArray(visit.coordinates.coordinates)) {
      return res.status(400).json({ message: "Invalid or missing coordinates for this visit" });
    }

    // Check if user already requested
    const alreadyJoined = visit.joinRequests.find(
      (request) => request.user.toString() === req.user._id.toString()
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "Already requested to join" });
    }

    visit.joinRequests.push({ user: req.user._id, status: "pending" });
    await visit.save();

    res.json({ message: "Request sent to the host" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// 📌 Accept a participant
export const acceptParticipant = async (req, res) => {
  try {
    const { participantId } = req.body;
    const visit = await VisitRequest.findById(req.params.id);

    if (!visit) return res.status(404).json({ message: "Visit request not found" });
    if (visit.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    const participant = visit.joinRequests.find((req) => req.user.toString() === participantId);
    if (!participant) return res.status(404).json({ message: "Participant not found" });

    participant.status = "accepted";
    await visit.save();

    res.json({ message: "Participant accepted", visit });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



export const changeStatus = async (req, res) => {
  const { visitId, requestId } = req.params;
  const { status } = req.body;

  try {
    const visit = await VisitRequest.findById(visitId).populate("joinRequests.user", "email name");

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    const request = visit.joinRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ message: "Join request not found" });
    }

    // Update the status of the join request
    request.status = status;
    await visit.save();

    // Send email notification to the user
    const userEmail = request.user.email;
    const userName = request.user.name;
    const visitLocation = visit.location;

    let emailSubject = "Your Join Request Status Has Been Updated";
    let emailBody = `Hello ${userName},\n\nYour join request for the visit at "${visitLocation}" has been ${status}.\n\nThank you for using our platform!\n\nBest regards,\nVisitTogether Team`;

    await sendEmail(userEmail, emailSubject, emailBody);

    res.status(200).json({ message: "Join request updated successfully and email sent" });
  } catch (error) {
    console.error("Error in changeStatus:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

 
// 📌 Get details of a specific visit request
export const getVisitDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the visit request by ID
      console.log("Visit ID:", id); // Log the visit ID for debugging
     if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid visit request ID" });
    }

    const visit = await VisitRequest.findById(id)
      .populate("user", "name email") // Populate the user who created the visit
      .populate("joinRequests.user", "name email _id"); // Populate the users who requested to join

    if (!visit) {
      return res.status(404).json({ message: "Visit request not found" });
    }


    console.log("Visit details:", visit); 
    res.status(200).json(visit);
    // Log the visit details for debugging
  } catch (error) {
    console.error("Error in getVisitDetails:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getVisitById = async (req, res) => {
  try {
    // First, fetch the visit with populated fields
    const visit = await VisitRequest.findById(req.params.id)
      .populate("user")
      .populate({
        path: "joinRequests.user",
        select: "name email profilePicture isVerified" // Select only needed fields
      });
      
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }
    
    // Ensure the joinRequests.user is properly processed
    const processedVisit = visit.toObject();
    
    // Make sure each joinRequest has a properly formatted user object
    if (processedVisit.joinRequests && processedVisit.joinRequests.length > 0) {
      processedVisit.joinRequests = processedVisit.joinRequests.map(req => {
        // If user is not populated or missing, provide a placeholder
        if (!req.user) {
          req.user = { name: "Unknown User" };
        }
        return req;
      });
    }
   
    res.json(processedVisit);
  } catch (error) {
    console.error("Error fetching visit:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// 📌 Get all visit requests
export const getAllVisitRequests = async (req, res) => {
  try {
    const visitRequests = await VisitRequest.find()
      .populate("user", "name email") // Populate the user who created the visit
      .populate("joinRequests.user", "name email") // Populate the users who requested to join
      .sort({ date: -1 }); // Sort by date (newest first)

    if (visitRequests.length === 0) {
      return res.status(404).json({ message: "No visit requests found" });
    }

    res.status(200).json(visitRequests);
  } catch (error) {
    console.error("Error in getAllVisitRequests:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// 📌 Get visits created by the authenticated user
export const getMyVisits = async (req, res) => {
  try {
    // Get the authenticated user's ID from the request (set by auth middleware)
    const userId = req.user._id;
    
    // Find all visit requests created by this user
    const myVisits = await VisitRequest.find({ user: userId })
      .populate("joinRequests.user", "name email") // Populate join requests with user details
      .sort({ date: -1 }); // Sort by date (newest first)
    
    // Check if any visits were found
    if (myVisits.length === 0) {
      return res.status(200).json({ message: "You haven't created any visits yet", visits: [] });
    }
    
    // Return the visits
    res.status(200).json({
      count: myVisits.length,
      visits: myVisits
    });
    
  } catch (error) {
    console.error("Error in getMyVisits:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateVisitStatus = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { status } = req.body;

    // Update only the status field
    const updatedVisit = await VisitRequest.findByIdAndUpdate(
      visitId,
      { status },
      { new: true, runValidators: false } // Disable validation for other fields
    );

    if (!updatedVisit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json(updatedVisit);
  } catch (error) {
    console.error("Error updating visit status:", error);
    res.status(500).json({ message: "Failed to update visit status", error });
  }
};
