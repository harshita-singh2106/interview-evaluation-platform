import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
  TextField,
  Button
} from "@mui/material";

export default function CandidateProfile() {

  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [notes, setNotes] = useState("");

  /* =========================
     SAVE RECRUITER NOTES
  ========================= */

  const saveNotes = async () => {
    await fetch(`http://localhost:5000/resumes/${id}/notes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notes }),
    });

    alert("Notes saved successfully");
  };

  /* =========================
     FETCH CANDIDATE DATA
  ========================= */

  useEffect(() => {
    fetch(`http://localhost:5000/resumes/${id}`)
      .then(res => res.json())
      .then(data => {
        setCandidate(data);
        setNotes(data.notes || "");
      });
  }, [id]);

  if (!candidate) {
    return <Typography sx={{ p:3 }}>Loading profile...</Typography>;
  }

  /* =========================
     DOWNLOAD FUNCTION
  ========================= */

  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/uploads/${candidate.file}`;
    link.setAttribute("download", candidate.file);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Box sx={{ padding: "30px", background:"#f4f6f8", minHeight:"100vh" }}>

      <Card>
        <CardContent>

          {/* Title */}
          <Typography variant="h4" mb={2}>
            Candidate Profile
          </Typography>

          {/* Status */}
          <Chip
            label={candidate.status || "Pending"}
            color={
              candidate.status === "Shortlisted"
                ? "success"
                : candidate.status === "Rejected"
                ? "error"
                : "warning"
            }
            sx={{ mb:2 }}
          />

          {/* Score */}
          <Typography variant="h6">
            Resume Score: {candidate.score}%
          </Typography>

          {/* Upload Date */}
          <Typography color="text.secondary" mb={3}>
            Uploaded: {new Date(candidate.createdAt).toLocaleString()}
          </Typography>

          {/* Skills */}
          <Typography variant="h6" mb={1}>
            Skills
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
            {candidate.skills.map((skill, i) => (
              <Chip key={i} label={skill} />
            ))}
          </Stack>

          {/* Recruiter Notes */}
          <Typography variant="h6" mt={3} mb={1}>
            Recruiter Notes
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write recruiter notes here..."
          />

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={saveNotes}
          >
            Save Notes
          </Button>

          {/* Resume Section */}
          <Typography variant="h6" mt={4}>
            Resume
          </Typography>

          <Card
            sx={{
              p:2,
              mt:2,
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              border:"1px solid #ddd"
            }}
          >

            {/* File Info */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h4">📄</Typography>

              <Typography>
                {candidate.file}
              </Typography>
            </Stack>

            {/* Buttons */}
            <Stack direction="row" spacing={2}>

              {/* OPEN */}
            
<Button
variant="contained"
color="primary"
component="a"
href={`http://localhost:5000/uploads/${candidate.file}`}
target="_blank"
rel="noopener noreferrer"
>
Open
</Button>

<Button
variant="outlined"
color="success"
onClick={() => {
  const link = document.createElement("a");
  link.href = `http://localhost:5000/uploads/${candidate.file}`;
  link.download = candidate.file;
  link.click();
}}
>
Download
</Button>

            </Stack>

          </Card>

          {/* Resume Text Preview */}
          <Typography mt={4}>
            <b>Resume Text Preview:</b>
          </Typography>

          <Typography>
            {candidate.text.substring(0, 800)}...
          </Typography>

        </CardContent>
      </Card>

    </Box>
  );
}