const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // 👈 YAHAN import

dotenv.config();

const app = express();

// DB connect
connectDB();

// middleware (JSON body read karne ke liye)
app.use(express.json());

// 👇👇 YAHI PE LAGANI HAI YE LINE 👇👇
app.use("/api/auth", authRoutes);
const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.user,
  });
});


// test route (optional)
app.get("/", (req, res) => {
  res.send("Quiz Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

