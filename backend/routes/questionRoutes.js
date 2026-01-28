const express = require("express");
const router = express.Router();
const { seedQuestions } = require("../controllers/questionController");

// Simple dev-only route to seed DB with questions
router.post("/seed", seedQuestions);

module.exports = router;


