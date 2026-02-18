const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer config (resume upload)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Resume upload route
app.post("/upload", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: `Resume "${req.file.originalname}" uploaded successfully`,
    fileName: req.file.filename,
  });
});

// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});