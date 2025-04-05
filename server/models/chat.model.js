import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit", // Reference to the Visit model
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Approved participants
      },
    ],
    pendingParticipants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users waiting for approval
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);