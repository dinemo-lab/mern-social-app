import mongoose from "mongoose";

const visitRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who created the post
      required: true,
    },
    location: {
      type: String, // Name of the place
      required: true,
    },
    meetingPoint: {
       name: {
        type: String, // Name of the meeting point
        required: true,
      },
      address: {
        type: String, // Address of the meeting point
        required: true,
      },
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
          // [longitude, latitude]
        required: true,
        index: "2dsphere", // Enables geolocation queries
         
      },
    },
    date: {
      type: Date, // When the visit will take place
      required: true,
    },
    description: {
      type: String, // Optional description about the visit
    },
    maxParticipants: {
      type: Number, // Limit the number of people
      default: 5,
    },
    joinRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
         
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
      },
    ],
    status: {
      type: String,
      enum: ["open", "locked", "completed"],
      default: "open",
    },
  },
  { timestamps: true }
);

visitRequestSchema.index({ coordinates: "2dsphere" }); // Enables geolocation queries

export default mongoose.model("VisitRequest", visitRequestSchema);
