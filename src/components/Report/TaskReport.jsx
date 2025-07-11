import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  Modal,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";
import TopBar from "../Common_Bar/TopBar";
import emp1 from '../../assets/emp1.png';
import emp2 from '../../assets/emp2.png';

const TaskReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [indexOfLastItem, setIndexOfLastItem] = useState(5);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const itemsPerPage = 5;
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    assignedTo: "",
    description: "",
    priority: "Medium",
  });

  const [filters, setFilters] = useState({
    title: "",
    client: "",
    status: "",
  });

  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Fetch tasks from backend on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Update current items when page or filtered data changes
  useEffect(() => {
    const ili = currentPage * itemsPerPage;
    const ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    const c = filteredTasks.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredTasks]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/task-reports`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch task reports");
      }
      
      const data = await response.json();
      setTasks(data.taskReports || []);
      setFilteredTasks(data.taskReports || []);
    } catch (error) {
      console.error("Error fetching task reports:", error);
      setError("Failed to load task reports.");
    } finally {
      setLoading(false);
    }
  };

  // Add task to database
  const addTaskToDatabase = async (taskData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/task-reports/add`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add task");
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({
      title: "",
      client: "",
      startDate: "",
      endDate: "",
      status: "Pending",
      assignedTo: "",
      description: "",
      priority: "Medium",
    });
    setError("");
  };

  const handleSort = (column) => {
    const newDirection = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction: newDirection });

    const sortedTasks = [...currentItems].sort((a, b) => {
      if (typeof a[column] === "string") {
        return newDirection === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
    });

    setCurrentItems(sortedTasks);
  };

  const handleSearch = () => {
    const filtered = tasks.filter((task) => {
      return (
        (filters.title ? task.title.toLowerCase().includes(filters.title.toLowerCase()) : true) &&
        (filters.client ? task.client.toLowerCase().includes(filters.client.toLowerCase()) : true) &&
        (filters.status ? task.status === filters.status : true)
      );
    });
    setFilteredTasks(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) {
      errors.push("Task Title is required.");
    }
    if (!formData.client.trim()) {
      errors.push("Client Name is required.");
    }
    if (!formData.startDate) {
      errors.push("Start Date is required.");
    }
    if (!formData.endDate) {
      errors.push("End Date is required.");
    }
    if (!formData.assignedTo.trim()) {
      errors.push("Assigned To is required.");
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.push("End date must be after start date.");
    }
    
    if (errors.length > 0) {
      setError(errors.join(" "));
      return false;
    }
    return true;
  };

  const handleAddTask = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await addTaskToDatabase(formData);
      console.log("Task saved:", result);
      setTasks([...tasks, result]);
      setFilteredTasks([...filteredTasks, result]);
      setSuccess(true);
      handleModalClose();
    } catch (error) {
      setError(error.message || "Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  // Get unique values for filter dropdowns
  const uniqueClients = [...new Set(tasks.map(task => task.client))];

  // Function to get avatar for assigned user
  const getAvatarForUser = (userName) => {
    // You can customize this logic based on your user data
    const avatars = [emp1, emp2];
    const index = userName ? userName.length % avatars.length : 0;
    return avatars[index];
  };

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
            <h2>Task Report</h2>
            <p>Reporting / Task Report</p>

            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <TextField
                    label="Search Task Title"
                    name="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "#fff", height: "35px" }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Client</InputLabel>
                    <Select
                      name="client"
                      value={filters.client}
                      onChange={handleFilterChange}
                      sx={{ backgroundColor: "#fff", height: "35px" }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueClients.map((client) => (
                        <MenuItem key={client} value={client}>
                          {client}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      sx={{ backgroundColor: "#fff", height: "35px" }}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2} textAlign="right">
                  <Button
                    variant="contained"
                    onClick={handleModalOpen}
                    style={{
                      borderRadius: "5px",
                      backgroundColor: "orange",
                      color: "white",
                    }}
                  >
                    Add New
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundColor: "green",
                  width: "50%",
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                }}
              >
                Search
              </Button>
            </Grid>

            {loading && !modalOpen ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell onClick={() => handleSort("title")} style={{ cursor: "pointer" }}>
                        Task Name {sortConfig.key === "title" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("client")} style={{ cursor: "pointer" }}>
                        Client Name {sortConfig.key === "client" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("startDate")} style={{ cursor: "pointer" }}>
                        Start Date {sortConfig.key === "startDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("endDate")} style={{ cursor: "pointer" }}>
                        End Date {sortConfig.key === "endDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("priority")} style={{ cursor: "pointer" }}>
                        Priority {sortConfig.key === "priority" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                        Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell>Assign To</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((task, index) => (
                      <TableRow 
                        key={task._id || index} 
                        sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7" }}
                      >
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.client}</TableCell>
                        <TableCell>
                          {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {task.endDate ? new Date(task.endDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ 
                            color: task.priority === "High" ? "red" : 
                                   task.priority === "Medium" ? "orange" : "green", 
                            fontWeight: "bold" 
                          }}>
                            {task.priority}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ 
                            color: task.status === "Pending" ? "red" : 
                                   task.status === "In Progress" ? "orange" : 
                                   task.status === "Completed" ? "green" : "blue", 
                            fontWeight: "bold" 
                          }}>
                            {task.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar 
                              src={getAvatarForUser(task.assignedTo)} 
                              alt="assign" 
                              sx={{ width: 24, height: 24, mr: 1 }}
                            />
                            <Typography sx={{ fontSize: "14px" }}>{task.assignedTo}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTasks.length)} of {filteredTasks.length} entries
              </Typography>
              <Pagination
                count={Math.ceil(filteredTasks.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>

            <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="md">
              <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Add Task Report</Typography>
                  <Button onClick={handleClose} sx={{ minWidth: 0, padding: 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323">
                      <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                    </svg>
                  </Button>
                </Box>
              </DialogTitle>
              <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    name="title"
                    label="Task Title"
                    fullWidth
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    name="client"
                    label="Client Name"
                    fullWidth
                    value={formData.client}
                    onChange={handleInputChange}
                    required
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="endDate"
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          name="priority"
                          value={formData.priority}
                          label="Priority"
                          onChange={handleInputChange}
                        >
                          <MenuItem value="Low">Low</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="High">High</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          label="Status"
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiSelect-select': {
                              color: formData.status === "Pending" ? "red" : 
                                     formData.status === "In Progress" ? "orange" : 
                                     formData.status === "Completed" ? "green" : "blue",
                              fontWeight: "bold"
                            }
                          }}
                        >
                          <MenuItem value="Pending" sx={{ color: "red" }}>Pending</MenuItem>
                          <MenuItem value="In Progress" sx={{ color: "orange" }}>In Progress</MenuItem>
                          <MenuItem value="Approved" sx={{ color: "blue" }}>Approved</MenuItem>
                          <MenuItem value="Completed" sx={{ color: "green" }}>Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <TextField
                    name="assignedTo"
                    label="Assign To"
                    fullWidth
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    name="description"
                    label="Task Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleModalClose}>Cancel</Button>
                <Button onClick={handleAddTask} color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Save"}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={!!error || success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || "Task report submitted successfully!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default TaskReport;