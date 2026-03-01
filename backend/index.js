const path = require("path");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Resume = require("./models/Resume");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* Show PDF inside browser (not download) */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
      }
    },
  })
);

/* =========================
   DATABASE CONNECTION
========================= */

mongoose
  .connect("mongodb://127.0.0.1:27017/resumeDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* =========================
   FILE UPLOAD CONFIG
========================= */

const upload = multer({ dest: "uploads/" });

/* =========================
   UPLOAD RESUME + AI ANALYSIS
========================= */

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
      "javascript",
    ];

    /* Detect Skills */
    const detectedSkills = skillsList.filter((skill) =>
      resumeText.includes(skill)
    );

    /* Score Calculation */
    const score = Math.round(
      (detectedSkills.length / skillsList.length) * 100
    );

    /* Missing Skills */
    const missingSkills = skillsList.filter(
      (skill) => !detectedSkills.includes(skill)
    );

    /* Save Resume */
    await Resume.create({
      text: resumeText,
      skills: detectedSkills,
      score: score,
      file: req.file.filename,
      status: "Pending",
      notes: "",
    });

    res.json({
      message: "Resume uploaded successfully",
      extractedText: resumeText.substring(0, 1000),
      skills: detectedSkills,
      score: score,
      missingSkills: missingSkills,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error parsing resume" });
  }
});

/* =========================
   GET ALL RESUMES
========================= */

app.get("/resumes", async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes" });
  }
});

/* =========================
   GET SINGLE CANDIDATE
========================= */

app.get("/resumes/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    res.json(resume);
  } catch {
    res.status(500).json({ message: "Candidate fetch error" });
  }
});

/* =========================
   DELETE RESUME
========================= */

app.delete("/resumes/:id", async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: "Resume deleted successfully" });
  } catch {
    res.status(500).json({ message: "Error deleting resume" });
  }
});

/* =========================
   SEARCH BY SKILL
========================= */

app.get("/search", async (req, res) => {
  try {
    const skill = req.query.skill;

    const resumes = await Resume.find({
      skills: { $regex: skill, $options: "i" },
    });

    res.json(resumes);
  } catch {
    res.status(500).json({ message: "Search error" });
  }
});

/* =========================
   TOP CANDIDATES
========================= */

app.get("/top-candidates", async (req, res) => {
  try {
    const resumes = await Resume.find()
      .sort({ score: -1 })
      .limit(5);

    res.json(resumes);
  } catch {
    res.status(500).json({ message: "Error fetching candidates" });
  }
});

/* =========================
   UPDATE STATUS
========================= */

app.put("/resumes/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Resume.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Status update failed" });
  }
});

/* =========================
   SERVER START
========================= */

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});