import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sendEmail } from "../utils/emailService.js";

// 📌 Generate JWT Token
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Fix: Make this function non-default export and ensure it returns an object with success property
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // HTML content for the email
    const htmlContent = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #4f46e5; text-align: center;">Email Verification</h2>
        <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also click on the link below or copy and paste it into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This verification link will expire in 24 hours.</p>
      </div>
    `;

    // Plain text version as fallback
    const textContent = `
      Email Verification
      
      Thank you for registering! Please verify your email address by clicking on the link below:
      
      ${verificationUrl}
      
      This verification link will expire in 24 hours.
    `;

    // Use the central email service
    const emailResult = await sendEmail(
      email,
      "Verify Your Email Address",
      textContent,
      htmlContent
    );
    
    // Make sure we're returning an object with the required structure
    return { success: emailResult?.success || true, data: emailResult };
  } catch (error) {
    console.error("Email verification error:", error);
    return { success: false, error };
  }
};

// 📌 Register a new user with verification
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

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
      location: { coordinates: coordinates || [0, 0] },
      verificationToken,
      verificationExpires,
      isVerified: false
    });

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken);
    
    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Consider handling this case - maybe delete the user or mark for retry
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: false,
      token: jwtToken,
      message: "Registration successful! Please check your email to verify your account."
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Login user with verification check
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

    // Check if user is verified
    // if (!user.isVerified) {
    //   return res.status(403).json({ 
    //     message: "Please verify your email before logging in",
    //     isVerified: false,
    //     email: user.email
    //   });
    // }

    // Generate a JWT with a consistent payload structure
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
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
    const user = await User.findById(req.user._id).select("-password -verificationToken -verificationExpires"); // Exclude sensitive fields
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 Google login (auto-verified)
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
      // Create new user with verified status since Google already verified their email
      user = new User({ 
        name, 
        email, 
        googleId, 
        password: null,
        isVerified: true // Auto-verify Google users
      });
      await user.save();
    } else if (!user.isVerified) {
      // If the user exists but isn't verified, verify them now
      user.isVerified = true;
      await user.save();
    }

    // Generate a JWT with a consistent payload structure
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

// 📌 Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user verification tokens
    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationToken);
    console.log("Email result:", emailResult);
    
    // Fix: Check if emailResult exists before accessing its properties
    if (!emailResult || !emailResult.success) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};