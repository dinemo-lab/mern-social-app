import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Index for efficient queries
MessageSchema.index({ chatId: 1, timestamp: 1 });

export default mongoose.model("Message", MessageSchema);