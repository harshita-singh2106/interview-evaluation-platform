import { useState } from "react";
import axios from "axios";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState([]);
  const [score, setScore] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResumeText("");
    setSkills([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      setResumeText(res.data.extractedText || "");
      setSkills(res.data.skills || []);
      setScore(res.data.score || null);
      setMissingSkills(res.data.missingSkills || []);

      alert(res.data.message);
      setFile(null);

    } catch (error) {
      console.error(error);
      alert("Upload failed. Backend not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Resume</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf,.doc,.doc,.docx"
          onChange={handleFileChange}
        />

        <br /><br />

        {file && (
          <p>
            Selected file: <b>{file.name}</b>
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>

      {/* Extracted Text */}
      {resumeText && (
        <div style={{ marginTop: "20px" }}>
          <h3>Extracted Resume Text:</h3>
          <p>{resumeText}</p>
        </div>
      )}

      {/* Detected Skills */}
      {skills.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Detected Skills:</h3>
          <ul>
            {skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Resume Score */}
{score !== null && (
  <div style={{ marginTop: "20px" }}>
    <h3>Resume Score: {score}%</h3>
  </div>
)}

{/* Missing Skills */}
{missingSkills.length > 0 && (
  <div style={{ marginTop: "20px" }}>
    <h3>Missing Skills:</h3>
    <ul>
      {missingSkills.map((skill, index) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>
  </div>
)}

    </div>
  );
}

export default ResumeUpload;