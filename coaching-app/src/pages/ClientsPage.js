import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  useMediaQuery,
  Link,
} from "@mui/material";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase"; // your firebase storage instance
import { useTheme } from "@mui/material/styles";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [savingIds, setSavingIds] = useState({});
  const [uploadingIds, setUploadingIds] = useState({});
  const [deletingIds, setDeletingIds] = useState({});
  const debounceTimers = useRef({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientsData = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (id, field, value) => {
    setClients((prev) =>
      prev.map((client) => (client.id === id ? { ...client, [field]: value } : client))
    );

    if (debounceTimers.current[id + field]) {
      clearTimeout(debounceTimers.current[id + field]);
    }

    debounceTimers.current[id + field] = setTimeout(() => {
      autoSaveClient(id, field, value);
    }, 1000);
  };

  const autoSaveClient = async (id, field, value) => {
    setSavingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const clientRef = doc(db, "clients", id);
      const updatedData = {};

      if (field === "startDate") {
        const date = new Date(value);
        if (!isNaN(date)) {
          updatedData[field] = date;
        } else {
          updatedData[field] = null;
        }
      } else if (
        field === "startingWeight" ||
        field === "currentWeight" ||
        field === "targetWeight"
      ) {
        updatedData[field] = value === "" ? null : parseFloat(value);
      } else {
        updatedData[field] = value || "";
      }

      await updateDoc(clientRef, updatedData);
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setSavingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return "";
    if (dateVal.toDate) {
      return dateVal.toDate().toISOString().split("T")[0];
    }
    if (dateVal.seconds) {
      return new Date(dateVal.seconds * 1000).toISOString().split("T")[0];
    }
    if (typeof dateVal === "string") {
      return dateVal;
    }
    return "";
  };

const handleFileUpload = async (clientId, file) => {
  if (!file) return;

  const isPdf = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  if (!isPdf && !isImage) {
    alert("Please upload a PDF or image file.");
    return;
  }

  setUploadingIds((prev) => ({ ...prev, [clientId]: true }));

  try {
    const fileExtension = file.name.split(".").pop();
    const fileName = isPdf ? "plan.pdf" : `plan.${fileExtension}`;
    const storageRef = ref(storage, `workoutPlans/${clientId}/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    const clientRef = doc(db, "clients", clientId);
    await updateDoc(clientRef, { workoutPlanUrl: downloadUrl });

    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId ? { ...client, workoutPlanUrl: downloadUrl } : client
      )
    );

    alert(`${isPdf ? "PDF" : "Image"} uploaded successfully!`);
  } catch (error) {
    console.error("Upload error:", error);
    alert(`Failed to upload file: ${error.message || error}`);
  } finally {
    setUploadingIds((prev) => ({ ...prev, [clientId]: false }));
  }
};

  const handleDeletePdf = async (clientId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this workout plan PDF?");
    if (!confirmDelete) return;

    setDeletingIds((prev) => ({ ...prev, [clientId]: true }));

    try {
      const storageRef = ref(storage, `workoutPlans/${clientId}/plan.pdf`);

      // Delete file from storage
      await deleteObject(storageRef);

      // Remove URL from Firestore
      const clientRef = doc(db, "clients", clientId);
      await updateDoc(clientRef, { workoutPlanUrl: null });

      // Update local state
      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId ? { ...client, workoutPlanUrl: null } : client
        )
      );

      alert("Workout plan PDF deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Failed to delete workout plan PDF: ${error.message || error}`);
    } finally {
      setDeletingIds((prev) => ({ ...prev, [clientId]: false }));
    }
  };

  const fields = [
    { key: "email", label: "Email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "coachName", label: "Coach", type: "text" },
    { key: "goals", label: "Goals", type: "text" },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "startingWeight", label: "Starting Weight", type: "number" },
    { key: "currentWeight", label: "Current Weight", type: "number" },
    { key: "targetWeight", label: "Target Weight", type: "number" },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Coaching Clients
      </Typography>

      {/* Desktop Table */}
      {!isSmallScreen && (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 3,
            overflowX: "auto",
            p: 2,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                {fields.map(({ label }) => (
                  <TableCell key={label} sx={{ fontWeight: 600 }}>
                    {label}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 600 }}>Workout Plan</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} hover>
                  <TableCell>{client.firstName + " " + client.lastName || "N/A"}</TableCell>

                  {fields.map(({ key, type }) => (
                    <TableCell key={key} sx={{ minWidth: 140 }}>
                      <TextField
                        variant="standard"
                        fullWidth
                        type={type}
                        value={key === "startDate" ? formatDate(client[key]) : client[key] || ""}
                        onChange={(e) => handleInputChange(client.id, key, e.target.value)}
                        inputProps={{
                          style: {
                            minWidth: type === "number" ? 120 : 160,
                            paddingLeft: 8,
                            paddingRight: 8,
                          },
                        }}
                      />
                    </TableCell>
                  ))}

                  <TableCell sx={{ minWidth: 180 }}>
                    {client.workoutPlanUrl ? (
                      <>
                        <Link
                          href={client.workoutPlanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          View Plan PDF
                        </Link>
                        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleDeletePdf(client.id)}
                            disabled={deletingIds[client.id]}
                          >
                            {deletingIds[client.id] ? "Deleting..." : "Delete PDF"}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            component="label"
                            disabled={uploadingIds[client.id]}
                          >
                            {uploadingIds[client.id] ? "Uploading..." : "Re-upload PDF"}
                            <input
                              type="file"
                              accept="application/pdf,image*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files[0];
                                handleFileUpload(client.id, file);
                                e.target.value = null;
                              }}
                            />
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Button
                        variant="outlined"
                        component="label"
                        disabled={uploadingIds[client.id]}
                      >
                        {uploadingIds[client.id] ? "Uploading..." : "Upload PDF"}
                        <input
                          type="file"
                          accept="application/pdf,image*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            handleFileUpload(client.id, file);
                            e.target.value = null;
                          }}
                        />
                      </Button>
                    )}
                  </TableCell>

                  <TableCell align="center" sx={{ minWidth: 70 }}>
                    {savingIds[client.id] ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Typography variant="caption" color="success.main">
                        Saved
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile Cards */}
      {isSmallScreen && (
        <Box>
          {clients.map((client) => (
            <Paper
              key={client.id}
              sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: 2 }}
              elevation={3}
            >
              <Typography variant="h6" gutterBottom>
                {client.firstName + " " + client.lastName}
              </Typography>
              {fields.map(({ key, label, type }) => (
                <Box key={key} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {label}
                  </Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    type={type}
                    fullWidth
                    value={key === "startDate" ? formatDate(client[key]) : client[key] || ""}
                    onChange={(e) => handleInputChange(client.id, key, e.target.value)}
                  />
                </Box>
              ))}
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Workout Plan
                </Typography>
                {client.workoutPlanUrl ? (
                  <>
                    <Link
                      href={client.workoutPlanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      View Plan PDF
                    </Link>
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDeletePdf(client.id)}
                        disabled={deletingIds[client.id]}
                        fullWidth
                      >
                        {deletingIds[client.id] ? "Deleting..." : "Delete PDF"}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        component="label"
                        disabled={uploadingIds[client.id]}
                        fullWidth
                      >
                        {uploadingIds[client.id] ? "Uploading..." : "Re-upload PDF"}
                        <input
                          type="file"
                          accept="application/pdf,image*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            handleFileUpload(client.id, file);
                            e.target.value = null;
                          }}
                        />
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={uploadingIds[client.id]}
                    fullWidth
                  >
                    {uploadingIds[client.id] ? "Uploading..." : "Upload PDF"}
                    <input
                      type="file"
                      accept="application/pdf,image*"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        handleFileUpload(client.id, file);
                        e.target.value = null;
                      }}
                    />
                  </Button>
                )}
              </Box>

              <Box sx={{ mt: 1, textAlign: "right" }}>
                {savingIds[client.id] ? (
                  <Typography variant="caption" color="primary">
                    Saving...
                  </Typography>
                ) : (
                  <Typography variant="caption" color="success.main">
                    Saved
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}
