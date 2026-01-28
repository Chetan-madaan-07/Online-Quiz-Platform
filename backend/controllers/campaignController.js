const Question = require("../models/question");
const User = require("../models/user");

// static 10-level config
const LEVELS = Array.from({ length: 10 }).map((_, i) => ({
  level: i + 1,
  name: `Level ${i + 1}`,
  requiredStars: i * 3, // simple unlock progression
}));

// Get campaign overview with levels and user stars
const getCampaign = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const levels = LEVELS.map((lvl) => ({
      ...lvl,
      unlocked: user.stars >= lvl.requiredStars,
    }));

    res.json({
      success: true,
      stars: user.stars,
      levels,
    });
  } catch (error) {
    console.error("Get campaign error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get 5 random questions for a level
const getLevelQuestions = async (req, res) => {
  try {
    const levelNumber = parseInt(req.params.levelNumber, 10);
    const level = LEVELS.find((l) => l.level === levelNumber);

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.stars < level.requiredStars) {
      return res.status(403).json({ message: "Level is locked" });
    }

    // For simplicity, use difficulty bands by level
    let difficulty = "easy";
    if (levelNumber >= 4 && levelNumber <= 7) difficulty = "medium";
    if (levelNumber >= 8) difficulty = "hard";

    const questions = await Question.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 5 } },
      {
        $project: {
          text: 1,
          options: 1,
        },
      },
    ]);

    if (questions.length === 0) {
      return res
        .status(400)
        .json({ message: `No questions available for ${difficulty} difficulty` });
    }

    res.json({
      success: true,
      level,
      questions,
    });
  } catch (error) {
    console.error("Get level questions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit level results and award stars
const submitLevelResult = async (req, res) => {
  try {
    const levelNumber = parseInt(req.params.levelNumber, 10);
    const { correctCount } = req.body;

    if (typeof correctCount !== "number" || correctCount < 0 || correctCount > 5) {
      return res.status(400).json({ message: "correctCount must be between 0 and 5" });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Simple star logic: 0-1 =>0, 2-3=>1, 4=>2, 5=>3
    let starsEarned = 0;
    if (correctCount >= 2 && correctCount <= 3) starsEarned = 1;
    else if (correctCount === 4) starsEarned = 2;
    else if (correctCount === 5) starsEarned = 3;

    user.stars += starsEarned;
    await user.save();

    res.json({
      success: true,
      starsEarned,
      totalStars: user.stars,
    });
  } catch (error) {
    console.error("Submit level result error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCampaign, getLevelQuestions, submitLevelResult };


