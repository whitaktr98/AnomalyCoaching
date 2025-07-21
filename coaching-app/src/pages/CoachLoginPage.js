import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Make sure 'db' is your Firestore export
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check Firestore for "coach" record with matching UID
      const coachRef = doc(db, "coach", user.uid);
      const coachSnap = await getDoc(coachRef);

      if (!coachSnap.exists()) {
        // Not a coach — sign out and block access
        await signOut(auth);
        alert("Access denied. This login is for coaches only.");
        return;
      }

      // ✅ Coach verified — allow access
      navigate("/coach-dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials or access denied.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Coach Login
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
