const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, getRankings } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes - require authentication
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Public routes
router.get("/rankings", getRankings);

module.exports = router;

