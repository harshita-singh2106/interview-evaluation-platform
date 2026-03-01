import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box
} from "@mui/material";

export default function CandidateProfile() {

  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);

  // Fetch Candidate
  useEffect(() => {
    fetch(`http://localhost:5000/resumes/${id}`)
      .then(res => res.json())
      .then(data => setCandidate(data));
  }, [id]);

  if (!candidate) {
    return <Typography sx={{ p:3 }}>Loading profile...</Typography>;
  }

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

          {/* Date */}
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

          {/* Resume Viewer */}
          <Typography variant="h6" mt={3}>
            Resume PDF
          </Typography>

          <iframe
            src={`http://localhost:5000/uploads/${candidate.file}#toolbar=1`}
            width="100%"
            height="650px"
            title="Resume Viewer"
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px"
            }}
          />

          {/* Resume Text */}
          <Typography mt={3}>
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