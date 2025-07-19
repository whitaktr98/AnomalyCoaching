import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function AddAdminForm() {
  const [formData, setFormData] = useState({
    coachId: "",
    coachName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const registerAdmin = async (email, password) => {
    // Create user in Firebase Auth and store role in Firestore
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "coach", user.uid), {
      email,
      password,
      coachName: formData.coachName,
      coachId: user.uid,
      role: "coach",
      createdAt: new Date(),
    });

    return user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (formData.password !== formData.confirmPassword) {
      setStatus("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerAdmin(formData.email, formData.password);
      setStatus("✅ Admin registered successfully!");
      setFormData({ email: "", password: "", confirmPassword: "" });
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h3>Add New Coach</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={6}
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Coach Name</label>
          <input
            type="text"
            name="coachName"
            required
            value={formData.coachName}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Registering..." : "Register Coach"}
        </button>
      </form>

      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </div>
  );
}
