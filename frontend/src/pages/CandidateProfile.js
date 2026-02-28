import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack
} from "@mui/material";

export default function CandidateProfile() {

  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/resumes/${id}`)
      .then(res => res.json())
      .then(data => setCandidate(data));
  }, [id]);

  if (!candidate) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <div style={{ padding: "30px" }}>

      <Card>
        <CardContent>

          <Typography variant="h4" mb={2}>
            Candidate Profile
          </Typography>

          <Chip
            label={candidate.status || "Pending"}
            color={
              candidate.status === "Shortlisted"
                ? "success"
                : candidate.status === "Rejected"
                ? "error"
                : "warning"
            }
            sx={{ mb: 2 }}
          />

          <Typography variant="h6">
            Resume Score: {candidate.score}%
          </Typography>

          <Typography color="text.secondary" mb={2}>
            Uploaded:
            {" "}
            {new Date(candidate.createdAt).toLocaleString()}
          </Typography>

          <Typography variant="h6" mb={1}>
            Skills
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {candidate.skills.map((skill, i) => (
              <Chip key={i} label={skill} />
            ))}
          </Stack>

          <Typography mt={3}>
            <b>Resume Text Preview:</b>
          </Typography>

          <Typography>
            {candidate.text.substring(0, 800)}...
          </Typography>

        </CardContent>
      </Card>

    </div>
  );
}