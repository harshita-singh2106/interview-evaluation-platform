import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  Stack,
  Chip
} from "@mui/material";

export default function Dashboard() {

  const [search, setSearch] = useState("");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topCandidates, setTopCandidates] = useState([]);

  const [analytics, setAnalytics] = useState({
    total: 0,
    average: 0,
    best: 0,
  });

  // ✅ Fetch resumes + analytics
  const fetchResumes = () => {

    setLoading(true);

    fetch("http://localhost:5000/resumes")
      .then(res => res.json())
      .then(data => {

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
            : Math.max(...data.map(r => r.score));

        setAnalytics({ total, average, best });

        setLoading(false);
      });
  };

  // ✅ Fetch Top Candidates
  const fetchTopCandidates = () => {
    fetch("http://localhost:5000/top-candidates")
      .then(res => res.json())
      .then(data => setTopCandidates(data));
  };

  // ✅ Auto refresh
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
    await fetch(`http://localhost:5000/resumes/${id}`, {
      method: "DELETE",
    });

    setResumes(prev =>
      prev.filter(resume => resume._id !== id)
    );
  };

  // ✅ Search
  const handleSearch = async () => {

    if (!search.trim()) return;

    const res = await fetch(
      `http://localhost:5000/search?skill=${search}`
    );

    const data = await res.json();
    setResumes(data);
  };

  // ✅ Reset
  const handleReset = () => {
    setSearch("");
    fetchResumes();
    fetchTopCandidates();
  };

  return (
    <div style={{ padding: "25px", background:"#f4f6f8", minHeight:"100vh" }}>

      {/* Analytics Cards */}
      <Grid container spacing={3} mb={3}>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Resumes</Typography>
              <Typography variant="h4">{analytics.total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Score</Typography>
              <Typography variant="h4">{analytics.average}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Best Candidate</Typography>
              <Typography variant="h4">{analytics.best}%</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Top Candidates */}
      <Typography variant="h5" mb={2}>
        ⭐ Top Candidates
      </Typography>

      {topCandidates.map(candidate => (
        <Card key={candidate._id} sx={{ mb:2 }}>
          <CardContent>
            <Typography>
              Score: {candidate.score}%
            </Typography>
            <Typography>
              Skills: {candidate.skills.join(", ")}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Search */}
      <Typography variant="h5" mt={4} mb={2}>
        All Uploaded Resumes
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Candidate Skill"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          onKeyDown={(e)=> e.key==="Enter" && handleSearch()}
          fullWidth
        />

        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>

        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Box>

      {/* Resume Cards */}
      {loading ? (
        <Typography variant="h6">
          Loading candidates...
        </Typography>
      ) : (
        resumes.map(resume => (
          <Card key={resume._id} sx={{ mb:3, borderRadius:3 }}>
            <CardContent>

              <Typography variant="h6" fontWeight="bold">
                Resume Score: {resume.score}%
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Uploaded on:
                {" "}
                {new Date(resume.createdAt).toLocaleString()}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {resume.skills.map((skill,index)=>(
                  <Chip
                    key={index}
                    label={skill}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>

              <Button
                color="error"
                variant="contained"
                sx={{ mt:2 }}
                onClick={()=>handleDelete(resume._id)}
              >
                Delete
              </Button>

            </CardContent>
          </Card>
        ))
      )}

    </div>
  );
}