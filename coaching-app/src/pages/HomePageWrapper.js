// src/pages/HomePageWrapper.js
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { CircularProgress } from "@mui/material";
import PublicLandingPage from "./PublicLandingPage";
import DashboardLayout from "../layout/DashboardLayout";
import CoachLandingPage from "./CoachLandingPage";

export default function HomePageWrapper() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;

  if (!user) {
    // Not logged in: show the public landing page
    return <PublicLandingPage />;
  }

  // Logged in: show dashboard + home
  return (
    <DashboardLayout>
      <CoachLandingPage />
    </DashboardLayout>
  );
}
