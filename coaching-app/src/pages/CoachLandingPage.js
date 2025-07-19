// src/pages/CoachLandingPage.js
import React from "react";
import { Typography, Button, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CoachLandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Coaching Dashboard
      </Typography>

      <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
        

        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/clients")}
        >
          View Active Clients
        </Button>
      </Stack>
    </Box>
  );
}
