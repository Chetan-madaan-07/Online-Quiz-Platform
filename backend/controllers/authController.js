const User = require("../models/User");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2. check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("✅ USER SAVED IN DB");
    console.log({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    // 5. response
    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
    // 6. after sign-up, auto login karwane ke liye token bhi bhejte hain
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const jwt = require("jsonwebtoken");



// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2. user check
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("✅ USER FOUND IN DB");
    console.log({
      id: user._id,
      name: user.name,
      email: user.email,
    });


    // 3. password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login };

