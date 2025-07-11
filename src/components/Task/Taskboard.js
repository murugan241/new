import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  OutlinedInput,
  Modal,
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

const GreenLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#55CE63",
  },
  height: "15px",
  borderRadius: "7px",
});

// Success Modal Style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const TaskBoard = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
    client: "",
    startDate: "",
    endDate: "",
    rate: "",
    priority: "",
    projectLead: "",
    teamMembers: "",
    jobDescription: "",
    files: null,
  });
  const [storedProjects, setStoredProjects] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  // Updated priority options - only Low, Medium, High
  const priorityOptions = [
    { value: "Low", label: "Low", color: "#4CAF50" },
    { value: "Medium", label: "Medium", color: "#FF9800" },
    { value: "High", label: "High", color: "#F44336" },
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  // API call to fetch tasks from MongoDB
  const fetchTasks = async () => {
    try {
      setFetchLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/tasks`;

      console.log('🌐 Fetching tasks from:', endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Tasks fetched successfully:', data);

      setStoredProjects(data.tasks || data || []);
    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
      setError(error.message || "Failed to fetch tasks");
    } finally {
      setFetchLoading(false);
    }
  };

  // API call to save task to MongoDB (following staff add pattern)
  const addTaskToDatabase = async (formData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/tasks/add`;

      console.log('🌐 Making API call to:', endpoint);
      console.log('📦 FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type for FormData - browser sets it with boundary
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to add task';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Success response:', result);
      return result;
    } catch (error) {
      console.error('❌ Error adding task:', error);

      // Better error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running on port 5000.');
      }

      throw error;
    }
  };

  const handleOpenPopup = () => setOpenPopup(true);

  const handleClosePopup = () => {
    setOpenPopup(false);
    resetForm();
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      const file = files[0];
      if (file) {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError("File size should be less than 5MB");
          return;
        }
        setFormData((prev) => ({ ...prev, [name]: file }));
        setSelectedFile(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    if (!formData.taskName.trim()) {
      setError("Task Name is required");
      return false;
    }
    if (!formData.client.trim()) {
      setError("Client is required");
      return false;
    }
    if (!formData.priority) {
      setError("Priority is required");
      return false;
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      setError("End date must be after start date");
      return false;
    }
    if (formData.rate && isNaN(formData.rate)) {
      setError("Rate must be a valid number");
      return false;
    }
    // Check if priority is one of the allowed values
    const allowedPriorities = ["Low", "Medium", "High"];
    if (!allowedPriorities.includes(formData.priority)) {
      setError("Priority must be one of: Low, Medium, High");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    console.log('🎯 Submit button clicked');

    if (!validateForm()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Create FormData for file upload (following staff add pattern)
      const data = new FormData();
      data.append('taskName', formData.taskName);
      data.append('client', formData.client);
      data.append('startDate', formData.startDate);
      data.append('endDate', formData.endDate);
      data.append('rate', formData.rate);
      data.append('priority', formData.priority);
      data.append('projectLead', formData.projectLead);
      data.append('teamMembers', formData.teamMembers);
      data.append('jobDescription', formData.jobDescription);

      // Add file if selected
      if (formData.files) {
        data.append('files', formData.files);
        console.log('📎 File added to form data:', formData.files.name);
      }

      console.log('🚀 Submitting task data...');

      // Make API call
      const result = await addTaskToDatabase(data);
      console.log('🎉 Task added successfully:', result);

      // Success - show modal and refresh tasks
      setSuccessModal(true);
      fetchTasks();

    } catch (error) {
      console.error('💥 Submit error:', error);
      setError(error.message || "Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      taskName: "",
      client: "",
      startDate: "",
      endDate: "",
      rate: "",
      priority: "",
      projectLead: "",
      teamMembers: "",
      jobDescription: "",
      files: null,
    });
    setSelectedFile(null);
    setError("");
    console.log('🔄 Form reset');
  };

  const handleCloseSnackbar = () => {
    setSuccess("");
    setError("");
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal(false);
    handleClosePopup();
  };

  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(option => option.value === priority);
    return priorityOption ? priorityOption.color : "#757575";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateProgress = () => {
    if (storedProjects.length === 0) return 0;
    // Simple calculation - you can modify this based on your business logic
    const completedTasks = storedProjects.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / storedProjects.length) * 100);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Tasks Board
          </Typography>
          <Typography color="textSecondary">Dashboard / Tasks Board</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenPopup}
          sx={{
            backgroundColor: "#FF902F",
            borderRadius: "50px",
            "&:hover": {
              backgroundColor: "#E8821A",
            },
            color: "white",
            textTransform: "none",
            px: 3,
          }}
        >
          Create Task
        </Button>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Typography fontWeight="medium">Overall Progress:</Typography>
        <Box sx={{ flex: 1 }}>
          <GreenLinearProgress variant="determinate" value={calculateProgress()} />
        </Box>
        <Typography fontWeight="bold">{calculateProgress()}%</Typography>
      </Box>

      {/* Tasks Display */}
      {fetchLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {storedProjects.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No tasks found. Create your first task!
                </Typography>
              </Card>
            </Grid>
          ) : (
            storedProjects.map((task, index) => (
              <Grid item xs={12} sm={6} md={4} key={task._id || index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {task.taskName}
                      </Typography>
                      <Chip
                        label={task.priority?.toUpperCase() || 'MEDIUM'}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {task.client}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Lead: {task.projectLead || 'Not assigned'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(task.startDate)} - {formatDate(task.endDate)}
                      </Typography>
                    </Box>

                    {task.jobDescription && (
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {task.jobDescription.length > 100
                          ? `${task.jobDescription.substring(0, 100)}...`
                          : task.jobDescription
                        }
                      </Typography>
                    )}

                    {task.teamMembers && (
                      <Typography variant="body2" color="text.secondary">
                        Team: {task.teamMembers}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      Rate: ${task.rate || 'N/A'}
                    </Typography>
                    <Box>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Create Task Dialog */}
      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Create New Task
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              name="taskName"
              label="Task Name *"
              fullWidth
              value={formData.taskName}
              onChange={handleChange}
              error={!formData.taskName.trim() && error}
              variant="outlined"
            />
            <TextField
              name="client"
              label="Client *"
              fullWidth
              value={formData.client}
              onChange={handleChange}
              error={!formData.client.trim() && error}
              variant="outlined"
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="startDate"
                  label="Start Date"
                  type="date"
                  fullWidth
                  value={formData.startDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="endDate"
                  label="End Date"
                  type="date"
                  fullWidth
                  value={formData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="rate"
                  label="Rate ($)"
                  type="number"
                  fullWidth
                  value={formData.rate}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!formData.priority && error} variant="outlined">
                  <InputLabel>Priority *</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    input={<OutlinedInput label="Priority *" />}
                  >
                    {priorityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: option.color,
                              mr: 1
                            }}
                          />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              name="projectLead"
              label="Project Lead"
              fullWidth
              value={formData.projectLead}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              name="teamMembers"
              label="Team Members"
              fullWidth
              value={formData.teamMembers}
              onChange={handleChange}
              placeholder="Separate multiple members with commas"
              variant="outlined"
            />
            <TextField
              name="jobDescription"
              label="Job Description"
              multiline
              rows={4}
              fullWidth
              value={formData.jobDescription}
              onChange={handleChange}
              variant="outlined"
            />
            <Box>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                name="files"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                onClick={handleFileUpload}
                sx={{ mb: 1 }}
              >
                Upload Files
              </Button>
              {selectedFile && (
                <Typography variant="body2" color="textSecondary">
                  Selected file: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClosePopup} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Task'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal */}
      <Modal
        open={successModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="success-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
            🎉 Success!
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 3 }}>
            Your task has been created successfully and saved to the database.
          </Typography>
          <Button
            onClick={handleCloseSuccessModal}
            variant="contained"
            sx={{
              backgroundColor: "#004E69",
              '&:hover': { backgroundColor: "#003A4F" },
              textTransform: "none"
            }}
          >
            Continue
          </Button>
        </Box>
      </Modal>

      {/* Error/Success Snackbar */}
      <Snackbar
        open={!!error && !openPopup}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TaskBoard;
