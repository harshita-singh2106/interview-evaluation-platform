import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [resumes, setResumes] = useState([]);

  // ✅ Fetch resumes
  const fetchResumes = () => {
    fetch("http://localhost:5000/resumes")
      .then((res) => res.json())
      .then((data) => setResumes(data))
      .catch((err) => console.error(err));
  };

  // ✅ Auto refresh only when NOT searching
  useEffect(() => {
    if (search !== "") return;

    fetchResumes();

    const interval = setInterval(fetchResumes, 3000);

    return () => clearInterval(interval);
  }, [search]);

  // ✅ Delete Resume
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/resumes/${id}`, {
        method: "DELETE",
      });

      setResumes((prev) =>
        prev.filter((resume) => resume._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Search Resume
  const handleSearch = async () => {
    if (!search.trim()) return;

    const res = await fetch(
      `http://localhost:5000/search?skill=${search}`
    );

    const data = await res.json();
    setResumes(data);
  };

  // ✅ Reset Dashboard
  const handleReset = () => {
    setSearch("");
    fetchResumes();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Uploaded Resumes</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by skill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button onClick={handleSearch}>Search</button>

      <button
        onClick={handleReset}
        style={{ marginLeft: "10px" }}
      >
        Reset
      </button>

      {/* Resume List */}
      {resumes.length === 0 ? (
        <p>No resumes found.</p>
      ) : (
        resumes.map((resume) => (
          <div
            key={resume._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginTop: "15px",
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
              Uploaded on:{" "}
              {new Date(resume.createdAt).toLocaleString()}
            </small>

            <br />

            <button
              style={{
                marginTop: "10px",
                background: "red",
                color: "white",
                border: "none",
                padding: "6px 12px",
                cursor: "pointer",
              }}
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