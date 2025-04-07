import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Only require password if googleId is not present
      },
    },
    profilePicture: {
      type: String,
      default: "", // Default profile picture URL
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationExpires: {
      type: Date,
    },
    // Add social media links
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },
    // Add skills
    skills: [{ type: String }], // Example: ["JavaScript", "React", "Node.js"]
    // Add interests
    interests: [{ type: String }], // Example: ["Photography", "Traveling", "Coding"]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next(); // ✅ Skip if password is null
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
