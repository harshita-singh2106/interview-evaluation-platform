import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/resumes")
      .then((res) => res.json())
      .then((data) => setResumes(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
  await fetch(`http://localhost:5000/resumes/${id}`, {
    method: "DELETE",
  });

  setResumes(resumes.filter((resume) => resume._id !== id));
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Uploaded Resumes</h2>

      {resumes.length === 0 ? (
        <p>No resumes found.</p>
      ) : (
        resumes.map((resume) => (
          <div
            key={resume._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <p><b>Score:</b> {resume.score}%</p>

            <p><b>Skills:</b></p>
            <ul>
              {resume.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>

            <small>
              Uploaded on: {new Date(resume.createdAt).toLocaleString()}
            </small>

          <button
  style={{ marginTop: "10px", background: "red", color: "white" }}
  onClick={() => handleDelete(resume._id)}
>
  Delete
</button>  
          </div>
        ))
      )}
    </div>
  );
}