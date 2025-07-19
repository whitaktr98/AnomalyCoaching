import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const CreateWorkoutPlanPage = () => {
  const [planName, setPlanName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState([]);
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", notes: "" },
  ]);
  const [loadingClients, setLoadingClients] = useState(true);

useEffect(() => {
  const fetchClients = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No user logged in");
      setLoadingClients(false);
      return;
    }

    try {
      // Directly query clients by coachId = user's UID
      const q = query(
        collection(db, "clients"),
        where("coachId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const clientData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setClients(clientData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    }
    setLoadingClients(false);
  };

  fetchClients();
}, []);

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "", notes: "" }]);
  };

  const removeExercise = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be signed in to create a plan.");
        return;
      }

      if (!clientId) {
        alert("Please select a client.");
        return;
      }

      if (!planName.trim()) {
        alert("Please enter a plan name.");
        return;
      }

      const plan = {
        coachId: user.uid,
        clientId,
        planName,
        exercises,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "workoutPlans"), plan);
      alert("Workout plan saved!");
      setPlanName("");
      setClientId("");
      setExercises([{ name: "", sets: "", reps: "", notes: "" }]);
    } catch (err) {
      console.error(err);
      alert("Failed to save workout plan.");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Create Workout Plan
      </Typography>

      <TextField
        label="Plan Name"
        fullWidth
        margin="normal"
        value={planName}
        onChange={(e) => setPlanName(e.target.value)}
      />

      <FormControl fullWidth margin="normal" disabled={loadingClients}>
        <InputLabel>Select Client</InputLabel>
        <Select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          label="Select Client"
        >
          {clients.length === 0 && !loadingClients ? (
            <MenuItem value="" disabled>
              No clients found
            </MenuItem>
          ) : (
            clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {exercises.map((exercise, index) => (
        <Grid container spacing={2} key={index} alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs={3}>
            <TextField
              label="Exercise Name"
              fullWidth
              value={exercise.name}
              onChange={(e) =>
                handleExerciseChange(index, "name", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Sets"
              type="number"
              fullWidth
              value={exercise.sets}
              onChange={(e) =>
                handleExerciseChange(index, "sets", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Reps"
              type="number"
              fullWidth
              value={exercise.reps}
              onChange={(e) =>
                handleExerciseChange(index, "reps", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Notes"
              fullWidth
              value={exercise.notes}
              onChange={(e) =>
                handleExerciseChange(index, "notes", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => removeExercise(index)} aria-label="Remove exercise">
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button onClick={addExercise} startIcon={<Add />} sx={{ mt: 2 }}>
        Add Exercise
      </Button>

      <Box mt={4}>
        <Button variant="contained" onClick={handleSubmit}>
          Save Workout Plan
        </Button>
      </Box>
    </Box>
  );
};

export default CreateWorkoutPlanPage;
