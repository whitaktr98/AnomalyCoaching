// src/pages/PackagesPage.js
import React from "react";
import { Container, Typography, Box, Grid, Paper, Button } from "@mui/material";

const packages = [
  {
    id: 1,
    title: "Basic Coaching",
    price: "$99/month",
    description: "Personalized workout plans and weekly check-ins.",
    features: [
      "Customized training program",
      "Weekly progress tracking",
      "Email support",
    ],
  },
  {
    id: 2,
    title: "Premium Coaching",
    price: "$199/month",
    description: "All Basic features plus nutrition guidance and bi-weekly video calls.",
    features: [
      "Everything in Basic",
      "Nutrition coaching",
      "Bi-weekly 1-on-1 video calls",
      "Priority email support",
    ],
  },
  {
    id: 3,
    title: "Ultimate Coaching",
    price: "$299/month",
    description: "Full support with unlimited coaching and personalized adjustments.",
    features: [
      "Everything in Premium",
      "Unlimited coaching adjustments",
      "24/7 chat support",
      "Access to exclusive resources",
    ],
  },
];

export default function PackagesPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
        Our Coaching Packages
      </Typography>
      <Grid container spacing={4}>
        {packages.map(({ id, title, price, description, features }) => (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <Paper elevation={4} sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: "600" }}>
                {title}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                {price}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {description}
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => alert(`You clicked ${title} package!`)}
                sx={{ mt: "auto" }}
              >
                Choose Plan
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
