// src/components/ClientProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ClientProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    async function checkClient() {
      const user = auth.currentUser;
      if (!user) {
        setIsClient(false);
        setLoading(false);
        return;
      }
      const clientDoc = await getDoc(doc(db, "clients", user.uid));
      setIsClient(clientDoc.exists());
      setLoading(false);
    }
    checkClient();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isClient ? children : <Navigate to="/client-login" replace />;
}
