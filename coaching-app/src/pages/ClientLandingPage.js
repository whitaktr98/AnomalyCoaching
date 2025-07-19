import React, { useEffect, useState, useMemo } from "react";
import { auth, db, storage } from "../firebase";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {
  Typography,
  Box,
  CircularProgress,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";

import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, getDownloadURL } from "firebase/storage";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function ClientLandingPage() {
  const [clientData, setClientData] = useState(null);
  const [loadingClient, setLoadingClient] = useState(true);

  const [progressEntries, setProgressEntries] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [newNote, setNewNote] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [pdfUrls, setPdfUrls] = useState({});
  const [openPdfPlanId, setOpenPdfPlanId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchClient() {
      if (!auth.currentUser) {
        setLoadingClient(false);
        return;
      }
      const docRef = doc(db, "clients", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setClientData(docSnap.data());
      }
      setLoadingClient(false);
    }
    fetchClient();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const progressRef = collection(db, "clients", auth.currentUser.uid, "progress");
    const q = query(progressRef, orderBy("date", "asc")); // ascending for chart timeline

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const entries = [];
        querySnapshot.forEach((doc) => {
          entries.push({ id: doc.id, ...doc.data() });
        });
        setProgressEntries(entries);
        setLoadingProgress(false);
      },
      (error) => {
        console.error("Error fetching progress:", error);
        setLoadingProgress(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPdfUrls = async () => {
      const urls = {};

      for (const plan of workoutPlans) {
        if (plan.workoutPlanUrl) {
          try {
            const fileRef = ref(storage, plan.workoutPlanUrl);
            const downloadUrl = await getDownloadURL(fileRef);
            urls[plan.id] = downloadUrl;
          } catch (error) {
            console.error(`Failed to fetch PDF URL for plan ${plan.id}:`, error);
          }
        }
      }

      setPdfUrls(urls);
    };

    if (workoutPlans.length > 0) {
      fetchPdfUrls();
    }
  }, [workoutPlans]);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      if (!auth.currentUser) return;

      try {
        const plansRef = collection(db, "clients", auth.currentUser.uid, "workoutPlans");
        const snapshot = await getDocs(plansRef);
        const plans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setWorkoutPlans(plans);
      } catch (error) {
        console.error("Error fetching workout plans:", error);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchWorkoutPlans();
  }, []);

  const handleAddProgress = async () => {
    if (!newNote.trim()) return;

    setLoadingProgress(true);
    try {
      const progressRef = collection(db, "clients", auth.currentUser.uid, "progress");
      await addDoc(progressRef, {
        date: Timestamp.fromDate(new Date()),
        note: newNote.trim(),
        weight: newWeight ? parseFloat(newWeight) : null,
      });
      setNewNote("");
      setNewWeight("");
    } catch (error) {
      console.error("Error adding progress:", error);
    }
    setLoadingProgress(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to homepage
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const togglePdfViewer = (planId) => {
    setOpenPdfPlanId((prev) => (prev === planId ? null : planId));
  };

  // Prepare weight progress data for chart
  const weightData = useMemo(() => {
    if (!clientData) return [];

    const data = [];

    // Add starting weight with a date 1 day before first progress entry or today
    const firstProgressDate =
      progressEntries.length > 0
        ? new Date(progressEntries[0].date.seconds * 1000)
        : new Date();

    const startingWeightDate = new Date(firstProgressDate);
    startingWeightDate.setDate(startingWeightDate.getDate() - 1);

    if (clientData.startingWeight) {
      data.push({
        date: startingWeightDate.toISOString().split("T")[0],
        weight: clientData.startingWeight,
        label: "Starting Weight",
      });
    }

    // Add progress entries sorted by ascending date
    const sortedProgress = [...progressEntries].sort(
      (a, b) => a.date.seconds - b.date.seconds
    );

    sortedProgress.forEach((entry) => {
      if (entry.weight !== null && entry.weight !== undefined) {
        data.push({
          date: new Date(entry.date.seconds * 1000).toISOString().split("T")[0],
          weight: entry.weight,
          label: entry.note || "",
        });
      }
    });

    // Add current weight as last point if different from last progress entry
    const lastEntryWeight =
      sortedProgress.length > 0
        ? sortedProgress[sortedProgress.length - 1].weight
        : null;

    if (
      clientData.currentWeight &&
      clientData.currentWeight !== lastEntryWeight &&
      clientData.currentWeight !== clientData.startingWeight
    ) {
      data.push({
        date: new Date().toISOString().split("T")[0],
        weight: clientData.currentWeight,
        label: "Current Weight",
      });
    }

    return data;
  }, [clientData, progressEntries]);

  if (loadingClient) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!clientData) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Typography variant="h5" color="error" align="center">
          Client data not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome, {clientData.firstName || auth.currentUser.email}!
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
        Track your progress below and add new updates anytime.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1">
          <strong>Starting Weight:</strong> {clientData.startingWeight ?? "N/A"} lbs
        </Typography>
        <Typography variant="body1">
          <strong>Current Weight:</strong> {clientData.currentWeight ?? "N/A"} lbs
        </Typography>
        <Typography variant="body1">
          <strong>Target Weight:</strong> {clientData.targetWeight ?? "N/A"} lbs
        </Typography>
      </Box>

      {/* Weight Progress Chart */}
      {weightData.length > 1 && (
        <Box sx={{ height: 300, mb: 12 }}>
          <Typography variant="h6" gutterBottom>
            Weight Progress Over Time
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weightData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Weight (lbs)"
              />
              {clientData.targetWeight && (
                <ReferenceLine
                  y={clientData.targetWeight}
                  label={`Target Weight (${clientData.targetWeight} lbs)`}
                  stroke="green"
                  strokeDasharray="3 3"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
<></>
      {/* Progress Entry Form */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Progress Update
        </Typography>
        <TextField
          label="Note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />
        <TextField
          label="Weight (optional)"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          type="number"
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProgress}
          disabled={!newNote.trim()}
          sx={{ mt: 1 }}
        >
          Add Update
        </Button>
      </Box>

      {/* Progress List */}
      <Typography variant="h6" gutterBottom>
        Your Progress
      </Typography>
      {loadingProgress ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : progressEntries.length === 0 ? (
        <Typography>No progress updates yet.</Typography>
      ) : (
        <List>
          {progressEntries.map(({ id, date, note, weight }) => (
            <React.Fragment key={id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={new Date(date.seconds * 1000).toLocaleDateString()}
                  secondary={
                    <>
                      {note}
                      {weight !== null && weight !== undefined && (
                        <>
                          <br />
                          <strong>Weight:</strong> {weight} lbs
                        </>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Workout Plans PDF Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Your Workout Plans
      </Typography>

      {loadingPlans ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : workoutPlans.length === 0 ? (
        <Typography>No workout plans assigned yet.</Typography>
      ) : (
        workoutPlans.map((plan) => (
          <Paper key={plan.id} sx={{ p: 2, mb: 3, backgroundColor: "#fafafa" }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {plan.planName || "Workout Plan"}
            </Typography>

            {pdfUrls[plan.id] ? (
              <>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => togglePdfViewer(plan.id)}
                  sx={{ mt: 1, mb: 1 }}
                >
                  {openPdfPlanId === plan.id ? "Hide PDF" : "View PDF"}
                </Button>
                {openPdfPlanId === plan.id && (
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      height: 500,
                      overflow: "auto",
                    }}
                  >
                    <iframe
                      src={pdfUrls[plan.id]}
                      width="100%"
                      height="100%"
                      title={`Workout Plan PDF - ${plan.planName}`}
                      style={{ border: "none" }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                No PDF uploaded for this plan.
              </Typography>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
}
