const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCampaign,
  getLevelQuestions,
  submitLevelResult,
} = require("../controllers/campaignController");

// All campaign routes are protected
router.get("/", authMiddleware, getCampaign);
router.get("/level/:levelNumber", authMiddleware, getLevelQuestions);
router.post("/level/:levelNumber/submit", authMiddleware, submitLevelResult);

module.exports = router;


