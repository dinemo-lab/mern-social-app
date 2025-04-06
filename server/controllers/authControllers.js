import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import express from "express";
import { OAuth2Client } from "google-auth-library";
 

// 📌 Generate JWT Token

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 📌 Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, coordinates } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists", 
        field: "email", 
        value: email 
      });
    }
    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
      location: { coordinates: coordinates || [0, 0] },
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT with a consistent payload structure
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email }, // Use `userId` instead of `id`
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // If using JWT in HTTP-Only cookies, clear the cookie
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });

    // If using refresh tokens, remove from the database
    const { token } = req.body;
    if (token) {
      await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: "" } });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};
  

// 📌 Get user profile (protected route)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, googleId, password: null });
      await user.save();
    }

    // Generate a JWT with a consistent payload structure
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email }, // Use `userId` instead of `id`
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};
