const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const questionRoutes = require("./routes/questionRoutes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());

// DB connect
connectDB();

// middleware (JSON body read karne ke liye)
// Increase limit to handle base64 image uploads (50MB limit)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 👇👇 YAHI PE LAGANI HAI YE LINE 👇👇
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/questions", questionRoutes);
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

