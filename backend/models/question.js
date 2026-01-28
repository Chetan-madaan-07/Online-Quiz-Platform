const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 2;
        },
        message: "At least two options are required",
      },
      required: true,
    },
    correctIndex: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return this.options && v >= 0 && v < this.options.length;
        },
        message: "correctIndex must point to a valid option",
      },
    },
    category: { type: String, default: "general" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);


