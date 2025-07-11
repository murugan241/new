import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
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
  Menu,
  Modal,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";
import TopBar from "../Common_Bar/TopBar";

const Resignation = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [indexOfLastItem, setIndexOfLastItem] = useState(2);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const itemsPerPage = 2;
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Remove dummy data - start with empty array
  const [jobs, setJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    employeeName: "",
    department: "",
    reason: "",
    notice: "",
    resignation: "",
  });

  const [filters, setFilters] = useState({
    employeeName: "",
    department: "",
    resignation: "",
  });

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Fetch resignations from backend on component mount
  useEffect(() => {
    fetchResignations();
  }, []);

  // Update current items when page or filtered data changes
  useEffect(() => {
    let ili = currentPage * itemsPerPage;
    let ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    let c = filteredJobs.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredJobs]);

  // Fetch resignations from backend
  const fetchResignations = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Fetching resignations from:', `${API_URL}/api/resignations`);
      
      const response = await fetch(`${API_URL}/api/resignations`);
      console.log('Resignations response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch resignations: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Resignations data received:', data);
      
      // Handle different response structures
      let resignationData = [];
      if (data.resignations) {
        resignationData = data.resignations;
      } else if (Array.isArray(data)) {
        resignationData = data;
      } else if (data.data) {
        resignationData = data.data;
      }
      
      console.log('Processed resignation data:', resignationData);
      setJobs(resignationData);
      setFilteredJobs(resignationData);
    } catch (error) {
      console.error("Error fetching resignations:", error);
      setError(`Failed to load resignations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleSort = (column) => {
    const newDirection =
      sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction: newDirection });

    const sortedJobs = [...filteredJobs].sort((a, b) => {
      if (typeof a[column] === "string") {
        return newDirection === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
    });

    setFilteredJobs(sortedJobs);
  };

  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      return (
        (filters.employeeName ? job.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase()) : true) &&
        (filters.department ? job.department.toLowerCase().includes(filters.department.toLowerCase()) : true)
      );
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleView = () => {
    alert(`Viewing resignation: ${selectedJob.employeeName} - ${selectedJob.department}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete resignation for: ${selectedJob.employeeName}?`)) {
      try {
        setLoading(true);
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const endpoint = `${API_URL}/api/resignations/delete/${selectedJob._id}`;

        const response = await fetch(endpoint, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete resignation");
        }

        // Remove from local state
        const updatedJobs = jobs.filter(job => job._id !== selectedJob._id);
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);
        setSuccess(true);
      } catch (error) {
        setError(error.message || "Failed to delete resignation. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    handleMenuClose();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleMenuOpen = (event, job) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({
      employeeName: "",
      department: "",
      reason: "",
      notice: "",
      resignation: "",
    });
    setError("");
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

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const validateForm = () => {
    if (!formData.employeeName.trim()) {
      setError("Employee Name is required.");
      return false;
    }
    if (!formData.department.trim()) {
      setError("Department is required.");
      return false;
    }
    if (!formData.reason.trim()) {
      setError("Reason is required.");
      return false;
    }
    if (!formData.notice) {
      setError("Notice Date is required.");
      return false;
    }
    if (!formData.resignation) {
      setError("Resignation Date is required.");
      return false;
    }
    if (formData.notice && formData.resignation && new Date(formData.notice) > new Date(formData.resignation)) {
      setError("Resignation date must be after notice date.");
      return false;
    }
    return true;
  };

  const submitResignationToDatabase = async (resignationData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/resignations/add`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resignationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit resignation");
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting resignation:', error);
      throw error;
    }
  };

  const handleAddJob = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const resignationData = {
        employeeName: formData.employeeName,
        department: formData.department,
        reason: formData.reason,
        notice: formData.notice,
        resignation: formData.resignation,
      };

      const result = await submitResignationToDatabase(resignationData);
      console.log("Resignation submitted:", result);

      // Refresh data from backend
      fetchResignations();
      setSuccess(true);
      handleModalClose();
    } catch (error) {
      setError(error.message || "Failed to submit resignation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Get unique values for filter dropdowns
  const uniqueEmployeeNames = [...new Set(jobs.map(job => job.employeeName))];
  const uniqueDepartments = [...new Set(jobs.map(job => job.department))];

  // Debug information
  console.log('Current state:', {
    jobs: jobs.length,
    filteredJobs: filteredJobs.length,
    currentItems: currentItems.length,
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
            <h2>Resignation</h2>
            <p>Configuration / Resignation</p>

            {/* Debug information */}
            <Box sx={{ p: 1, mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption">
                Debug: Total resignations: {jobs.length}, Filtered: {filteredJobs.length}, Current items: {currentItems.length}
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Resignation Employee</InputLabel>
                    <Select
                      name="employeeName"
                      value={filters.employeeName}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueEmployeeNames.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="department"
                      value={filters.department}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueDepartments.map((department) => (
                        <MenuItem key={department} value={department}>
                          {department}
                        </MenuItem>
                      ))}
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

            {loading ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Box>
            ) : filteredJobs.length === 0 ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="h6" color="textSecondary">
                  No resignation records found
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        onClick={() => handleSort("employeeName")}
                        style={{ cursor: "pointer" }}
                      >
                        Resignation Employee{" "}
                        {sortConfig.key === "employeeName" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("department")}
                        style={{ cursor: "pointer" }}
                      >
                        Department{" "}
                        {sortConfig.key === "department" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("reason")}
                        style={{ cursor: "pointer" }}
                      >
                        Reason{" "}
                        {sortConfig.key === "reason" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("notice")}
                        style={{ cursor: "pointer" }}
                      >
                        Notice Date{" "}
                        {sortConfig.key === "notice" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("resignation")}
                        style={{ cursor: "pointer" }}
                      >
                        Resignation Date{" "}
                        {sortConfig.key === "resignation" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((job, index) => (
                      <TableRow key={job._id || index} sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#E9E9EA" }}>
                        <TableCell>{job.employeeName}</TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.reason}</TableCell>
                        <TableCell>{formatDate(job.notice)}</TableCell>
                        <TableCell>{formatDate(job.resignation)}</TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleMenuOpen(event, job)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Menu moved outside the table */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleView}>View</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredJobs.length)} of {filteredJobs.length} entries
              </Typography>
              <Pagination
                count={Math.ceil(filteredJobs.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>

            <Modal open={modalOpen} onClose={handleModalClose}>
              <Box sx={modalStyle}>
                <DialogTitle>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Add Resignation</Typography>
                    <Button onClick={handleModalClose} sx={{ minWidth: 0, padding: 0 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323">
                        <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                      </svg>
                    </Button>
                  </Box>
                </DialogTitle>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box sx={{ maxHeight: '500px', overflowY: 'auto', padding: '0 16px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} mb={2}>
                      <TextField
                        fullWidth
                        label="Resignation Employee"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Reason"
                        name="reason"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Notice Date"
                        name="notice"
                        type="date"
                        value={formData.notice}
                        onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Resignation Date"
                        name="resignation"
                        type="date"
                        value={formData.resignation}
                        onChange={(e) => setFormData({ ...formData, resignation: e.target.value })}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button onClick={handleModalClose} sx={{ mr: 2 }}>
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }}
                          onClick={handleAddJob}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} /> : "Submit"}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Modal>
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
          {error || "Resignation operation completed successfully!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Resignation;