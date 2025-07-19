// src/pages/PublicLandingPage.js
import React from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PublicLandingPage() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 3,
        textAlign: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
      }}
    >
      <Box sx={{ maxWidth: 800, mb: 5 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: "bold", mb: 3, fontFamily: "'Poppins', sans-serif" }}
        >
          Welcome to Anomaly Powerbuilding Coaching
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 4, lineHeight: 1.6, fontWeight: 400, fontFamily: "'Roboto', sans-serif" }}
        >
          Your journey to strength, fitness, and personal growth starts here.  
          Get personalized coaching and training programs tailored just for you.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          {/*
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/client-login")}
            sx={{ px: 4, fontWeight: "bold" }}
          >
            Client Login
          </Button>
*/}
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => navigate("/coach-login")}
            sx={{ px: 4, fontWeight: "bold", borderColor: "#fff", color: "#fff" }}
          >
            Coach Login
          </Button>

           <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => navigate("/packages")}
            sx={{ px: 4, fontWeight: "bold", borderColor: "#fff", color: "#fff" }}
          >
            Packages
          </Button>
        </Stack>
      </Box>

      

      <Typography variant="caption" sx={{ mt: "auto", fontWeight: 300, opacity: 0.8 }}>
        &copy; {new Date().getFullYear()} Anomaly Powerbuilding Coaching. All rights reserved.
      </Typography>
    </Container>
  );
}
