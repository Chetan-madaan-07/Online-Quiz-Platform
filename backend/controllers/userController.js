const User = require("../models/user");

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        gender: user.gender,
        age: user.age,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, profilePhoto, gender, age, bio } = req.body;

    // Validate name if provided
    if (name !== undefined && (!name || name.trim() === "")) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    // Validate email format if provided
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || email.trim() === "") {
        return res.status(400).json({ message: "Email cannot be empty" });
      }
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Check if email is being changed and if it's already taken
      const existingUser = await User.findOne({ email, _id: { $ne: req.user } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Validate age if provided
    if (age !== undefined && age !== null && age !== "") {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        return res.status(400).json({ message: "Age must be a number between 1 and 120" });
      }
    }

    // Validate gender if provided
    if (gender !== undefined && gender !== "" && !["male", "female", "other"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender value" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim();
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
    if (gender !== undefined) updateData.gender = gender;
    if (age !== undefined) {
      updateData.age = age === "" || age === null ? null : parseInt(age);
    }
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        gender: user.gender,
        age: user.age,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    
    // Handle duplicate key error (for email)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = { getProfile, updateProfile };

