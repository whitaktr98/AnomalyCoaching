// src/pages/ClientDashboard.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ClientDashboard() {
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    async function fetchClientData() {
      if (!auth.currentUser) return;
      const docRef = doc(db, "clients", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setClientData(docSnap.data());
      }
    }
    fetchClientData();
  }, []);

  if (!clientData) return <div>Loading client info...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Welcome, {clientData.firstName} {clientData.lastName}</h2>
      <p><strong>Email:</strong> {clientData.email}</p>
      <p><strong>Phone:</strong> {clientData.phone || "N/A"}</p>
      <p><strong>Goals:</strong> {clientData.goals || "N/A"}</p>
      <p><strong>Start Date:</strong> {clientData.startDate?.toDate ? clientData.startDate.toDate().toLocaleDateString() : "N/A"}</p>
    </div>
  );
}
