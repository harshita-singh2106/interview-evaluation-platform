import { useState } from "react";

function ResumeUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume first");
      return;
    }

    alert(`Resume "${file.name}" uploaded successfully!`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Resume</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        <br /><br />

        {file && <p>Selected file: <b>{file.name}</b></p>}

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default ResumeUpload;