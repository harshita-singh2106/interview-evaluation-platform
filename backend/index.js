const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});