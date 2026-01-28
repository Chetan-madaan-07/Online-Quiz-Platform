const Question = require("../models/question");

// Seed some example questions (for development)
const seedQuestions = async (req, res) => {
  try {
    const existing = await Question.countDocuments();
    if (existing >= 15) {
      return res.json({ success: true, message: "Questions already seeded" });
    }

    const sampleQuestions = [
      {
        text: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctIndex: 2,
        category: "geography",
        difficulty: "easy",
      },
      {
        text: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correctIndex: 1,
        category: "science",
        difficulty: "easy",
      },
      {
        text: "Who wrote 'Hamlet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"],
        correctIndex: 1,
        category: "literature",
        difficulty: "easy",
      },
      {
        text: "What is 9 x 7?",
        options: ["56", "63", "72", "49"],
        correctIndex: 1,
        category: "math",
        difficulty: "easy",
      },
      {
        text: "Which gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctIndex: 2,
        category: "science",
        difficulty: "easy",
      },
      {
        text: "Which ocean is the largest?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctIndex: 3,
        category: "geography",
        difficulty: "medium",
      },
      {
        text: "Who painted the Mona Lisa?",
        options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Claude Monet"],
        correctIndex: 0,
        category: "art",
        difficulty: "medium",
      },
      {
        text: "In which year did World War II end?",
        options: ["1942", "1945", "1939", "1950"],
        correctIndex: 1,
        category: "history",
        difficulty: "medium",
      },
      {
        text: "What is the chemical symbol for Gold?",
        options: ["Ag", "Au", "Gd", "Go"],
        correctIndex: 1,
        category: "science",
        difficulty: "medium",
      },
      {
        text: "Which country hosted the 2016 Summer Olympics?",
        options: ["China", "Brazil", "UK", "Russia"],
        correctIndex: 1,
        category: "sports",
        difficulty: "medium",
      },
      {
        text: "What is the square root of 144?",
        options: ["10", "11", "12", "14"],
        correctIndex: 2,
        category: "math",
        difficulty: "hard",
      },
      {
        text: "Who developed the theory of relativity?",
        options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Galileo Galilei"],
        correctIndex: 1,
        category: "science",
        difficulty: "hard",
      },
      {
        text: "Which element has the atomic number 1?",
        options: ["Helium", "Hydrogen", "Oxygen", "Carbon"],
        correctIndex: 1,
        category: "science",
        difficulty: "hard",
      },
      {
        text: "Which continent is the Sahara Desert located on?",
        options: ["Asia", "Africa", "Australia", "South America"],
        correctIndex: 1,
        category: "geography",
        difficulty: "hard",
      },
      {
        text: "What is the longest river in the world (by most measurements)?",
        options: ["Nile", "Amazon", "Yangtze", "Mississippi"],
        correctIndex: 0,
        category: "geography",
        difficulty: "hard",
      },
    ];

    await Question.insertMany(sampleQuestions);

    res.json({ success: true, message: "Sample questions seeded" });
  } catch (error) {
    console.error("Seed questions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { seedQuestions };


