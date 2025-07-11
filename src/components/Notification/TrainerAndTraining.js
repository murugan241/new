import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";
import TopBar from "../Common_Bar/TopBar";

const TrainerList = () => {
  const [view, setView] = useState("TrainingList");
  const [trainers, setTrainers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch data on component mount and when view changes
  useEffect(() => {
    if (view === "TrainerList") {
      fetchTrainers();
    } else if (view === "TrainingList") {
      fetchTrainings();
    }
  }, [view]);

  // Fetch trainers from backend
  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Fetching trainers from:', `${API_URL}/api/trainers`);
      
      const response = await fetch(`${API_URL}/api/trainers`);
      console.log('Trainers response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch trainers: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Trainers data received:', data);
      
      // Handle different response structures
      let trainerData = [];
      if (data.trainers) {
        trainerData = data.trainers;
      } else if (Array.isArray(data)) {
        trainerData = data;
      } else if (data.data) {
        trainerData = data.data;
      }
      
      console.log('Processed trainer data:', trainerData);
      setTrainers(trainerData);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      setError(`Failed to load trainers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trainings from backend
  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Fetching trainings from:', `${API_URL}/api/trainings`);
      
      const response = await fetch(`${API_URL}/api/trainings`);
      console.log('Trainings response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch trainings: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Trainings data received:', data);
      
      // Handle different response structures
      let trainingData = [];
      if (data.trainings) {
        trainingData = data.trainings;
      } else if (Array.isArray(data)) {
        trainingData = data;
      } else if (data.data) {
        trainingData = data.data;
      }
      
      console.log('Processed training data:', trainingData);
      setTrainings(trainingData);
      setFilteredTrainings(trainingData);
    } catch (error) {
      console.error("Error fetching trainings:", error);
      setError(`Failed to load trainings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const results = trainings.filter((training) =>
      training.trainingtype.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrainings(results);
  };

  const handleOpen = () => {
    setFormData({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedTrainers = [...trainers];
    updatedTrainers[index].status = newStatus;
    setTrainers(updatedTrainers);
  };

  const handleStatusChange1 = (index, newStatus) => {
    const updatedTrainings = [...trainings];
    updatedTrainings[index].status = newStatus;
    setTrainings(updatedTrainings);
    setFilteredTrainings(updatedTrainings);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      let endpoint = '';
      let payload = {};

      if (view === "TrainerList") {
        endpoint = `${API_URL}/api/trainers/add`;
        payload = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          role: formData.role,
          emailid: formData.emailid?.toLowerCase(),
          phoneno: formData.phoneno,
          status: formData.status || 'Active',
        };
      } else if (view === "TrainingList") {
        endpoint = `${API_URL}/api/trainings/add`;
        payload = {
          trainingtype: formData.trainingtype,
          trainer: formData.trainer,
          Training_cost: formData.Training_cost,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status || "Active",
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add data: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Data added successfully:', result);
      setSuccess(true);
      handleClose();
      
      // Refresh the data after successful addition
      if (view === "TrainerList") {
        fetchTrainers();
      } else if (view === "TrainingList") {
        fetchTrainings();
      }
    } catch (error) {
      console.error('Error adding data:', error);
      setError(error.message || "Failed to add data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setSearchTerm("");
    setFilteredTrainings([]);
  };

  const renderTable = () => {
    if (view === "TrainerList") {
      return (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trainer Name</TableCell>
                <TableCell>Contact No</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: "#E9E9EA" }}>
              {trainers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="h6" color="textSecondary">
                      {loading ? <CircularProgress size={20} /> : "No trainers found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                trainers.map((trainer, index) => (
                  <TableRow key={trainer._id || index}>
                    <TableCell>{trainer.firstname + " " + trainer.lastname}</TableCell>
                    <TableCell>{trainer.phoneno}</TableCell>
                    <TableCell>{trainer.emailid}</TableCell>
                    <TableCell>
                      <Select
                        value={trainer.status}
                        onChange={(e) => handleStatusChange(index, e.target.value)}
                        sx={{ borderRadius: "20px", width: "200px" }}
                      >
                        <MenuItem value="Active">
                          <RadioButtonCheckedIcon style={{ color: "green" }} />Active
                        </MenuItem>
                        <MenuItem value="Inactive">
                          <RadioButtonCheckedIcon style={{ color: "red" }} />Inactive
                        </MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else if (view === "TrainingList") {
      const trainingData = searchTerm ? filteredTrainings : trainings;
      return (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Training Type</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell>Time Duration</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: "#E9E9EA" }}>
              {trainingData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="h6" color="textSecondary">
                      {loading ? <CircularProgress size={20} /> : "No trainings found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                trainingData.map((training, index) => (
                  <TableRow key={training._id || index}>
                    <TableCell>{training.trainingtype}</TableCell>
                    <TableCell>{training.trainer}</TableCell>
                    <TableCell>
                      {training.startDate && training.endDate 
                        ? `${new Date(training.startDate).toLocaleDateString()} to ${new Date(training.endDate).toLocaleDateString()}`
                        : "N/A"
                      }
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 18px",
                          border: "1px solid #ccc",
                          borderRadius: "16px",
                          color: "#000",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        Rs {training.Training_cost}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={training.status}
                        onChange={(e) => handleStatusChange1(index, e.target.value)}
                        sx={{ borderRadius: "20px", width: "200px" }}
                      >
                        <MenuItem value="Active">
                          <RadioButtonCheckedIcon style={{ color: "green" }} />Active
                        </MenuItem>
                        <MenuItem value="Inactive">
                          <RadioButtonCheckedIcon style={{ color: "red" }} />Inactive
                        </MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  // Debug information
  console.log('Current state:', {
    view,
    trainers: trainers.length,
    trainings: trainings.length,
    loading
  });

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
          <div style={{ padding: "70px" }}>
            <h2>Training</h2>
            <p>Configuration / Training</p>

            {/* Debug information */}
            <Box sx={{ p: 1, mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption">
                Debug: View: {view}, Trainers: {trainers.length}, Trainings: {trainings.length}, Loading: {loading.toString()}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} height={75}>
              <Box display="flex" gap={2}>
                <Button
                  variant={view === "TrainingList" ? "contained" : "outlined"}
                  sx={{
                    width: '200px',
                    color: view === "TrainingList" ? "white" : "#004E69",
                    backgroundColor: view === "TrainingList" ? "#004E69" : "transparent",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#004E69", color: "white" },
                  }}
                  onClick={() => handleViewChange("TrainingList")}
                >
                  Training List
                </Button>
                <Button
                  variant={view === "TrainerList" ? "contained" : "outlined"}
                  sx={{
                    width: '200px',
                    color: view === "TrainerList" ? "white" : "#004E69",
                    backgroundColor: view === "TrainerList" ? "#004E69" : "transparent",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#004E69", color: "white" },
                  }}
                  onClick={() => handleViewChange("TrainerList")}
                >
                  Trainer List
                </Button>
              </Box>
              <Button variant="contained" sx={{ backgroundColor: "#FF902F" }} onClick={handleOpen}>
                Add New
              </Button>
            </Box>

            {view === "TrainingList" && (
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label="Search Training Type"
                  variant="outlined"
                  size="small"
                  sx={{ width: '300px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="success"
                  sx={{ width: '250px', backgroundColor: "#55CE63" }}
                  onClick={handleSearch}
                >
                  SEARCH
                </Button>
              </Box>
            )}

            {renderTable()}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
              <DialogTitle>
                Add New {view === "TrainerList" ? "Trainer" : "Training"}
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  style={{ position: "absolute", right: 16, top: 16 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                {view === "TrainerList" ? (
                  <>
                    <TextField
                      label="First name"
                      name="firstname"
                      variant="outlined"
                      fullWidth
                      value={formData.firstname || ""}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      label="Last Name"
                      name="lastname"
                      variant="outlined"
                      fullWidth
                      value={formData.lastname || ""}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      label="Role"
                      name="role"
                      variant="outlined"
                      fullWidth
                      value={formData.role || ""}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      label="Email Id"
                      name="emailid"
                      type="email"
                      variant="outlined"
                      fullWidth
                      value={formData.emailid || ""}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      label="Phone No"
                      name="phoneno"
                      variant="outlined"
                      fullWidth
                      value={formData.phoneno || ""}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <Select
                      name="status"
                      value={formData.status || "Active"}
                      onChange={handleChange}
                      fullWidth
                      style={{ marginTop: "16px" }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </>
                ) : (
                  <>
                    <TextField
                      label="Training Type"
                      name="trainingtype"
                      variant="outlined"
                      fullWidth
                      value={formData.trainingtype || ""}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      label="Trainer"
                      name="trainer"
                      variant="outlined"
                      fullWidth
                      value={formData.trainer || ""}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <TextField
                      label="Training Cost"
                      name="Training_cost"
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={formData.Training_cost || ""}
                      onChange={handleChange}
                      margin="normal"
                      required
                    />
                    <Box display="flex" gap={2} mt={2}>
                      <TextField
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate || ""}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                      <TextField
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={formData.endDate || ""}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Box>
                    <Select
                      name="status"
                      value={formData.status || "Active"}
                      onChange={handleChange}
                      fullWidth
                      style={{ marginTop: "16px" }}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FF902F",
                    color: "white",
                  }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </DialogActions>
            </Dialog>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Typography variant="body2">
                Showing {view === "TrainerList" ? trainers.length : trainings.length} entries
              </Typography>
            </Box>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={!!error || success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || "Operation successful!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default TrainerList;