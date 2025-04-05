import User from "../models/user.models.js";

// GET ALL USERS
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
    res.json(req.user);
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Get the authenticated user's ID from the request

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields based on the request body
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.location = req.body.location || user.location;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.socialLinks = {
      linkedin: req.body.socialLinks?.linkedin || user.socialLinks.linkedin,
      twitter: req.body.socialLinks?.twitter || user.socialLinks.twitter,
      instagram: req.body.socialLinks?.instagram || user.socialLinks.instagram,
    };
    user.skills = req.body.skills || user.skills;
    user.interests = req.body.interests || user.interests;

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user (excluding the password)
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      location: updatedUser.location,
      profilePicture: updatedUser.profilePicture,
      socialLinks: updatedUser.socialLinks,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
