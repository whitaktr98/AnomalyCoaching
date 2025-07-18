import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Make sure 'db' is exported from your firebase.js

export default function ClientsPage() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Clients</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Goals</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.firstName + " " + client.lastName || "N/A"}</td>
              <td>{client.email || "N/A"}</td>
              <td>{client.phone || "N/A"}</td>
              <td>{client.goals || "N/A"}</td>
              <td>{client.startDate && client.startDate.toDate? client.startDate.toDate().toLocaleDateString(): "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
