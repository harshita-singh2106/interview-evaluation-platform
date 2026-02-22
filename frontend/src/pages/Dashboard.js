import React, { useEffect, useState } from "react";

export default function Dashboard() {

  const [search, setSearch] = useState("");
  const [resumes, setResumes] = useState([]);
  const [topCandidates, setTopCandidates] = useState([]);

  const [analytics, setAnalytics] = useState({
    total: 0,
    average: 0,
    best: 0,
  });

  // ✅ Fetch Resumes + Analytics
  const fetchResumes = () => {
    fetch("http://localhost:5000/resumes")
      .then((res) => res.json())
      .then((data) => {

        setResumes(data);

        const total = data.length;

        const average =
          total === 0
            ? 0
            : Math.round(
                data.reduce((sum, r) => sum + r.score, 0) / total
              );

        const best =
          total === 0
            ? 0
            : Math.max(...data.map((r) => r.score));

        setAnalytics({ total, average, best });
      })
      .catch((err) => console.error(err));
  };

  // ✅ Fetch Top Candidates
  const fetchTopCandidates = () => {
    fetch("http://localhost:5000/top-candidates")
      .then((res) => res.json())
      .then((data) => setTopCandidates(data));
  };

  // ✅ Auto Refresh Dashboard
  useEffect(() => {

    if (search !== "") return;

    fetchResumes();
    fetchTopCandidates();

    const interval = setInterval(() => {
      fetchResumes();
      fetchTopCandidates();
    }, 3000);

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
    fetchTopCandidates();
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* Analytics */}
      <h2>📊 Dashboard Analytics</h2>

<div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
  <div>👥 Total Candidates: {analytics.total}</div>
  <div>⭐ Average Score: {analytics.average}%</div>
  <div>🏆 Best Score: {analytics.best}%</div>
</div>

      {/* Top Candidates */}
      <h2>⭐ Top Candidates</h2>

      {topCandidates.map((candidate) => (
        <div key={candidate._id}
          style={{
            border: "2px solid green",
            padding: "10px",
            marginBottom: "10px"
          }}>
          <p><b>Score:</b> {candidate.score}%</p>
          <p><b>Skills:</b> {candidate.skills.join(", ")}</p>
        </div>
      ))}

      <h2>All Uploaded Resumes</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by skill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button onClick={handleSearch}>Search</button>

      <button onClick={handleReset} style={{ marginLeft: "10px" }}>
        Reset
      </button>

      {/* Resume List */}
      {resumes.length === 0 ? (
        <p>No resumes found.</p>
      ) : (
        resumes.map((resume) => (
          <div key={resume._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginTop: "15px",
            }}>
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