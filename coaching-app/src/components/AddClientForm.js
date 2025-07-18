// src/components/AddClientForm.js
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function AddClientForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    goals: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // 2. Save client profile in Firestore
      await setDoc(doc(db, "clients", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        goals: formData.goals,
        startDate: new Date(),
      });

      setStatus({ type: "success", message: "Client registered successfully!" });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        goals: "",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }

    setLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center">
        Add New Client
      </Typography>

      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />

      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        inputProps={{ minLength: 6 }}
        fullWidth
        margin="normal"
        helperText="Minimum 6 characters"
      />

      <TextField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Goals"
        name="goals"
        multiline
        rows={3}
        value={formData.goals}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Box textAlign="center" mt={3}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Registering..." : "Register Client"}
        </Button>
      </Box>

      {status.message && (
        <Alert
          severity={status.type}
          sx={{ mt: 2, maxWidth: 400, mx: "auto" }}
          onClose={() => setStatus({ type: "", message: "" })}
        >
          {status.message}
        </Alert>
      )}
    </Box>
  );
}
