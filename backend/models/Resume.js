const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  text: String,
  skills: [String],
  score: Number,
  file: String,

  // ✅ Candidate Status
  status: {
    type: String,
    default: "Pending",
  },

  // ✅ Recruiter Notes (Day-14 Feature)
  notes: {
    type: String,
    default: "",
  },

  // ✅ Upload Time
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);