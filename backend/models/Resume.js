const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  text: String,
  skills: [String],
  score: Number,

  // ✅ NEW FIELD (DAY-11)
  status: {
    type: String,
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);