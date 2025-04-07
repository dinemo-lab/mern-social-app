import express from "express";
import { getUsers, getUserProfile, updateUserProfile, getUserById } from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/profile", protect, getUserProfile);
router.put("/update-profile", protect, updateUserProfile);
router.get("/:id",protect,getUserById);


export default router;
