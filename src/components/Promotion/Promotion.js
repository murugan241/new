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
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";
import TopBar from "../Common_Bar/TopBar";

const Promotion = () => {
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
    jobTitle: "",
    promotionFrom: "",
    promotionTo: "",
    promotionDate: "",
  });

  const [filters, setFilters] = useState({
    employeeName: "",
    jobTitle: "",
    promotionTo: "",
  });

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Fetch promotions from backend on component mount
  useEffect(() => {
    fetchPromotions();
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

  // Fetch promotions from backend
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Fetching promotions from:', `${API_URL}/api/promotions`);
      
      const response = await fetch(`${API_URL}/api/promotions`);
      console.log('Promotions response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch promotions: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Promotions data received:', data);
      
      // Handle different response structures
      let promotionData = [];
      if (data.promotions) {
        promotionData = data.promotions;
      } else if (Array.isArray(data)) {
        promotionData = data;
      } else if (data.data) {
        promotionData = data.data;
      }
      
      console.log('Processed promotion data:', promotionData);
      setJobs(promotionData);
      setFilteredJobs(promotionData);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setError(`Failed to load promotions: ${error.message}`);
    } finally {
      setLoading(false);
    }
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
        (filters.jobTitle ? job.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase()) : true) &&
        (filters.promotionTo ? job.promotionTo.toLowerCase().includes(filters.promotionTo.toLowerCase()) : true)
      );
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleView = () => {
    alert(`Viewing promotion: ${selectedJob.employeeName} - ${selectedJob.promotionTo}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete promotion for: ${selectedJob.employeeName}?`)) {
      try {
        setLoading(true);
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const endpoint = `${API_URL}/api/promotions/delete/${selectedJob._id}`;

        const response = await fetch(endpoint, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete promotion");
        }

        // Remove from local state
        const updatedJobs = jobs.filter(job => job._id !== selectedJob._id);
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);
        setSuccess(true);
      } catch (error) {
        setError(error.message || "Failed to delete promotion. Please try again.");
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
      jobTitle: "",
      promotionFrom: "",
      promotionTo: "",
      promotionDate: "",
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
    if (!formData.jobTitle) {
      setError("Department is required.");
      return false;
    }
    if (!formData.promotionFrom) {
      setError("Promotion From is required.");
      return false;
    }
    if (!formData.promotionTo) {
      setError("Promotion To is required.");
      return false;
    }
    if (!formData.promotionDate) {
      setError("Promotion Date is required.");
      return false;
    }
    return true;
  };

  const submitPromotionToDatabase = async (promotionData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/promotions/add`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit promotion");
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting promotion:', error);
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
      const promotionData = {
        employeeName: formData.employeeName,
        jobTitle: formData.jobTitle,
        promotionFrom: formData.promotionFrom,
        promotionTo: formData.promotionTo,
        promotionDate: formData.promotionDate,
      };

      const result = await submitPromotionToDatabase(promotionData);
      console.log("Promotion submitted:", result);

      // Refresh data from backend
      fetchPromotions();
      setSuccess(true);
      handleModalClose();
    } catch (error) {
      setError(error.message || "Failed to submit promotion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Get unique values for filter dropdowns
  const uniqueEmployeeNames = [...new Set(jobs.map(job => job.employeeName))];
  const uniqueJobTitles = [...new Set(jobs.map(job => job.jobTitle))];
  const uniquePromotionTo = [...new Set(jobs.map(job => job.promotionTo))];

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
            <h2>Promotion</h2>
            <p>Configuration / Promotion</p>

            {/* Debug information */}
            <Box sx={{ p: 1, mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption">
                Debug: Total promotions: {jobs.length}, Filtered: {filteredJobs.length}, Current items: {currentItems.length}
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Promoted Name</InputLabel>
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
                      name="jobTitle"
                      value={filters.jobTitle}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueJobTitles.map((title) => (
                        <MenuItem key={title} value={title}>
                          {title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Promotion To</InputLabel>
                    <Select
                      name="promotionTo"
                      value={filters.promotionTo}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniquePromotionTo.map((promotion) => (
                        <MenuItem key={promotion} value={promotion}>
                          {promotion}
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
                  No promotion records found
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
                        Promoted Name{" "}
                        {sortConfig.key === "employeeName" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("jobTitle")}
                        style={{ cursor: "pointer" }}
                      >
                        Department{" "}
                        {sortConfig.key === "jobTitle" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("promotionFrom")}
                        style={{ cursor: "pointer" }}
                      >
                        Promotion From{" "}
                        {sortConfig.key === "promotionFrom" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("promotionTo")}
                        style={{ cursor: "pointer" }}
                      >
                        Promotion To{" "}
                        {sortConfig.key === "promotionTo" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("promotionDate")}
                        style={{ cursor: "pointer" }}
                      >
                        Promotion Date{" "}
                        {sortConfig.key === "promotionDate" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((job, index) => (
                      <TableRow key={job._id || index} sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#E9E9EA" }}>
                        <TableCell>{job.employeeName}</TableCell>
                        <TableCell>{job.jobTitle}</TableCell>
                        <TableCell>{job.promotionFrom}</TableCell>
                        <TableCell>{job.promotionTo}</TableCell>
                        <TableCell>
                          {job.promotionDate ? new Date(job.promotionDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
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
                    <Typography variant="h6">Add Promotion</Typography>
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
                        label="Promoted Name"
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
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Promotion From"
                        name="promotionFrom"
                        value={formData.promotionFrom}
                        onChange={(e) => setFormData({ ...formData, promotionFrom: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Promotion To"
                        name="promotionTo"
                        value={formData.promotionTo}
                        onChange={(e) => setFormData({ ...formData, promotionTo: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Promotion Date"
                        name="promotionDate"
                        type="date"
                        value={formData.promotionDate}
                        onChange={(e) => setFormData({ ...formData, promotionDate: e.target.value })}
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
          {error || "Promotion operation completed successfully!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Promotion;