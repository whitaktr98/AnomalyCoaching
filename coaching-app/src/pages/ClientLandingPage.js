import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
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

export default function ClientLandingPage() {
  const [clientData, setClientData] = useState(null);
  const [loadingClient, setLoadingClient] = useState(true);

  const [progressEntries, setProgressEntries] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [newNote, setNewNote] = useState("");
  const [newWeight, setNewWeight] = useState("");

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
    const q = query(progressRef, orderBy("date", "desc"));

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

  // NEW: Fetch workout plans for this client
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      if (!auth.currentUser) {
        setLoadingPlans(false);
        return;
      }

      try {
        const q = query(
          collection(db, "workoutPlans"),
          where("clientId", "==", auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const plans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setWorkoutPlans(plans);
      } catch (error) {
        console.error("Error fetching workout plans:", error);
      }
      setLoadingPlans(false);
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

      {/* NEW: Workout Plans Section */}
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
              {plan.planName}
            </Typography>
            {plan.exercises && plan.exercises.length > 0 ? (
              <List dense>
                {plan.exercises.map((ex, idx) => (
                  <ListItem key={idx} divider>
                    <ListItemText
                      primary={`${ex.name} — Sets: ${ex.sets}, Reps: ${ex.reps}`}
                      secondary={ex.notes || ""}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No exercises found for this plan.</Typography>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
}
