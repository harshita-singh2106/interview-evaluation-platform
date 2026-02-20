const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/resumeDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

mongoose.connect("mongodb://127.0.0.1:27017/resumeDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// 👇 ADD HERE
const resumeSchema = new mongoose.Schema({
  text: String,
  skills: [String],
  score: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resume = mongoose.model("Resume", resumeSchema);

// File upload config
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);

    const resumeText = data.text.toLowerCase();

    const skillsList = [
      "python",
      "java",
      "react",
      "node",
      "mongodb",
      "sql",
      "machine learning",
      "html",
      "css",
      "javascript"
    ];

    const detectedSkills = skillsList.filter(skill =>
      resumeText.includes(skill)
    );

    const score = Math.round(
      (detectedSkills.length / skillsList.length) * 100
    );

    const missingSkills = skillsList.filter(
      skill => !detectedSkills.includes(skill)
   );

   await Resume.create({
      text: resumeText,
      skills: detectedSkills,
      score: score
    });

    res.json({
      message: "Resume uploaded successfully",
      extractedText: resumeText.substring(0, 1000),
      skills: detectedSkills,
      score: score,
      missingSkills: missingSkills
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error parsing resume" });
  }
});

app.get("/resumes", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes" });
  }
});

app.delete("/resumes/:id", async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resume" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});