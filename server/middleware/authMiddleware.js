import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      

      // Use `userId` to find the user
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
