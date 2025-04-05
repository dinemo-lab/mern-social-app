import express from "express";
import http from "http"; // For creating an HTTP server
import { Server } from "socket.io"; // Import Socket.io
import cors from "cors";
import dotenv from "dotenv";
import setupSocketIO from "./utils/socket.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import visitRoutes from "./routes/vistRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // Import chat routes
import messageRoutes from "./routes/messageRoutes.js"; 
import contactRoutes from "./routes/contactRoutes.js"

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Create an HTTP server instance
const server = http.createServer(app);

setupSocketIO(server);
 
// Middleware to attach `io` to `req`
 
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visit", visitRoutes);
app.use("/api/chats", chatRoutes); // Chat routes
app.use("/api/messages", messageRoutes); 
app.use("/api/contact",contactRoutes)// Message routes

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
