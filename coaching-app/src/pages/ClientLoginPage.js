// src/pages/ClientLoginPage.js
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  console.log("Logging in with", email);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("Login success, navigating...");
    navigate("/client-dashboard");
  } catch (err) {
    console.error("Login failed:", err);
    setError("Invalid email or password");
  }
};

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto", marginTop: 60 }}>
      <h2>Client Login</h2>
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />
      <button type="submit" style={{ padding: "10px 20px" }}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
