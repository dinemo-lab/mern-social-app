import express from "express";
import {registerUser, getUserProfile, logoutUser, loginUser, googleLogin} from "../controllers/authControllers.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser); // User registration
router.post("/login", loginUser);
router.post("/logout", logoutUser); // User login
router.get("/profile", protect, getUserProfile);
router.post("/google-login",googleLogin) // Get user profile

export default router;
