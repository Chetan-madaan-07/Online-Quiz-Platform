const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, default: "" },
    gender: { 
      type: String, 
      enum: {
        values: ["male", "female", "other", ""],
        message: "Gender must be male, female, other, or empty"
      },
      default: "" 
    },
    age: { 
      type: Number, 
      default: null,
      min: [1, "Age must be at least 1"],
      max: [120, "Age must be at most 120"]
    },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
