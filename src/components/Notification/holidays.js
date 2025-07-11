import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";
import TopBar from "../Common_Bar/TopBar";
import dayjs from "dayjs";

const Holidays = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/holidays");
      if (response.ok) {
        const data = await response.json();
        setHolidays(data.holidays || []);
      } else {
        console.error("Failed to fetch holiday data");
      }
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleOpenPopup = () => setOpenPopup(true);

  const handleClosePopup = () => {
    setOpenPopup(false);
    setFormData({
      date: "",
      day: "",
      name: "",
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.date) {
      setError("Date is required");
      return false;
    }
    if (!formData.day) {
      setError("Day is required");
      return false;
    }
    if (!formData.name) {
      setError("Holiday Name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/holidays/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newHoliday = await response.json();
        setHolidays((prevData) => [...prevData, newHoliday]);
        setSuccess(true);
        handleClosePopup();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save holiday");
      }
    } catch (error) {
      console.error("Error saving holiday:", error);
      setError("An error occurred while saving the holiday");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError("");
  };

  const today = dayjs();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <Grid container sx={{ display: "flex" }}>
        <Grid item xs={12} sm={3} md={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} sm={9} md={10}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ padding:  8}}>
              <Box display="flex" gap={2} justifyContent="space-between">
                <Typography variant="h4" align="left">
                  Holidays
                </Typography>
                <Button
                  variant="contained"
                  align="right"
                  color="primary"
                  onClick={handleOpenPopup}
                  sx={{
                    backgroundColor: "#7152F3",
                    borderRadius: "10px",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AddCircleOutline sx={{ marginRight: "8px" }} />
                  Add New Holiday
                </Button>
              </Box>
              <Typography variant="body2" color="textSecondary" gutterBottom align="left">
                Dashboard / Holidays
              </Typography>

              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#A2A1A8" }}>Date</TableCell>
                      <TableCell sx={{ color: "#A2A1A8" }}>Day</TableCell>
                      <TableCell sx={{ color: "#A2A1A8" }}>Holiday Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {holidays.map((holiday, index) => {
                      const isPast = dayjs(holiday.date).isBefore(today, "day");
                      const barColor = isPast ? "#A2A1A833" : "#7152F3";

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: "5px",
                                  backgroundColor: barColor,
                                  borderRadius: "3px",
                                  marginRight: 1,
                                  height: "35px",
                                }}
                              />
                              <Typography variant="body2">{holiday.date}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{holiday.day}</TableCell>
                          <TableCell>{holiday.name}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
                <DialogTitle>Add New Holiday</DialogTitle>
                <DialogContent>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Day"
                    name="day"
                    value={formData.day}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Holiday Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClosePopup} color="secondary">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Add"}
                  </Button>
                </DialogActions>
              </Dialog>
              <Snackbar
                open={!!error || success}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={success ? "Holiday added successfully!" : error}
              />
            </Box>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Holidays;
