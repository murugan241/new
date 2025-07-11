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
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

const Offer_Approved = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [indexOfLastItem, setIndexOfLastItem] = useState(2);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const itemsPerPage = 2;
  const [currentItems, setCurrentItems] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal and form states
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    jobTitle: "",
    department: "",
    jobLocation: "",
    jobType: "",
    pay: "",
    annualIP: "",
    longIP: "",
    status: "",
    salaryFrom: "",
    salaryTo: "",
    description: "",
  });

  // Filter states
  const [filters, setFilters] = useState({
    employeeName: "",
    jobTitle: "",
    department: "",
    jobType: "",
    longIP: "",
  });

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // API Base URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch job offers from backend
  const fetchJobOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/job-offers`);
      if (!response.ok) {
        throw new Error("Failed to fetch job offers");
      }
      const data = await response.json();
      setJobs(data.jobOffers || []);
      setFilteredJobs(data.jobOffers || []);
      updatePagination(data.jobOffers || [], 1);
    } catch (error) {
      console.error("Error fetching job offers:", error);
      setError("Failed to load job offers.");
    } finally {
      setLoading(false);
    }
  };

  // Add job offer to backend
  const addJobOfferToDatabase = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/job-offers/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add job offer");
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding job offer:', error);
      throw error;
    }
  };

  // Update job offer status
  const updateJobOfferStatus = async (jobId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/job-offers/${jobId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update job offer status");
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating job offer status:', error);
      throw error;
    }
  };

  // Delete job offer
  const deleteJobOffer = async (jobId) => {
    try {
      const response = await fetch(`${API_URL}/api/job-offers/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete job offer");
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting job offer:', error);
      throw error;
    }
  };

  // Update pagination
  const updatePagination = (jobsArray, page) => {
    const ili = page * itemsPerPage;
    const ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    const c = jobsArray.slice(ifi, ili);
    setCurrentItems(c);
  };

  // Initial load
  useEffect(() => {
    fetchJobOffers();
  }, []);

  // Update pagination when page changes
  useEffect(() => {
    updatePagination(filteredJobs, currentPage);
  }, [currentPage, filteredJobs]);

  // Form validation
  const validateForm = () => {
    const errors = [];
    if (!formData.employeeName.trim()) {
      errors.push("Employee Name is required.");
    }
    if (!formData.jobTitle.trim()) {
      errors.push("Job Title is required.");
    }
    if (!formData.department.trim()) {
      errors.push("Department is required.");
    }
    if (!formData.jobType.trim()) {
      errors.push("Job Type is required.");
    }
    if (!formData.status.trim()) {
      errors.push("Status is required.");
    }
    if (formData.salaryFrom && formData.salaryTo && 
        Number(formData.salaryFrom) > Number(formData.salaryTo)) {
      errors.push("Salary From must be less than Salary To.");
    }
    
    if (errors.length > 0) {
      setError(errors.join(" "));
      return false;
    }
    return true;
  };

  const handleClose = () => {
    setModalOpen(false);
    setError("");
  };

  const handleSort = (column) => {
    const newDirection = 
      sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    
    setSortConfig({ key: column, direction: newDirection });
    
    const sortedJobs = [...currentItems].sort((a, b) => {
      if (typeof a[column] === "string") {
        return newDirection === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
    });
    
    setCurrentItems(sortedJobs);
  };

  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      return (
        (filters.employeeName ? job.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase()) : true) &&
        (filters.jobTitle ? job.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase()) : true) &&
        (filters.jobType ? job.jobType === filters.jobType : true) &&
        (filters.longIP ? job.longIP === filters.longIP : true)
      );
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);
    updatePagination(filtered, 1);
  };

  const handleView = () => {
    alert(`Viewing job: ${selectedJob.jobTitle}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedJob || !selectedJob.id) {
      setError("No job selected for deletion.");
      return;
    }

    setLoading(true);
    try {
      await deleteJobOffer(selectedJob.id);
      setSuccess("Job offer deleted successfully!");
      await fetchJobOffers(); // Refresh the list
      handleMenuClose();
    } catch (error) {
      setError(error.message || "Failed to delete job offer.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (job, newStatus) => {
    setLoading(true);
    try {
      await updateJobOfferStatus(job.id, newStatus);
      setSuccess("Status updated successfully!");
      await fetchJobOffers(); // Refresh the list
    } catch (error) {
      setError(error.message || "Failed to update status.");
    } finally {
      setLoading(false);
    }
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
      department: "",
      jobLocation: "",
      jobType: "",
      pay: "",
      annualIP: "",
      longIP: "",
      status: "",
      salaryFrom: "",
      salaryTo: "",
      description: "",
    });
    setError("");
  };

  const handleAnnualIPChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    if (value > 100) {
      value = "100";
    }
    if (value) {
      value = `${value}%`;
    }
    setFormData({ ...formData, annualIP: value });
  };

  const handleAddJob = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await addJobOfferToDatabase(formData);
      console.log("Job offer saved:", result);
      setSuccess("Job offer added successfully!");
      await fetchJobOffers(); // Refresh the list
      handleModalClose();
    } catch (error) {
      setError(error.message || "Failed to save job offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess("");
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
            <h2>Offer Approval</h2>
            <p>Configuration / Offer Approval</p>

            {/* Loading indicator */}
            {loading && (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress />
              </Box>
            )}

            {/* Filters */}
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Employee Name</InputLabel>
                    <Select
                      name="employeeName"
                      value={filters.employeeName}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {/* Dynamic employee names from jobs */}
                      {[...new Set(jobs.map(job => job.employeeName))].map((name) => (
                        <MenuItem key={name} value={name}>{name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Job Title</InputLabel>
                    <Select
                      name="jobTitle"
                      value={filters.jobTitle}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {[...new Set(jobs.map(job => job.jobTitle))].map((title) => (
                        <MenuItem key={title} value={title}>{title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      name="jobType"
                      value={filters.jobType}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Temporary">Temporary</MenuItem>
                      <MenuItem value="Salary">Salary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Long Term IP</InputLabel>
                    <Select
                      name="longIP"
                      value={filters.longIP}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="NO">NO</MenuItem>
                      <MenuItem value="YES">YES</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={2} textAlign="right">
                  <Button 
                    variant="contained" 
                    onClick={handleModalOpen} 
                    disabled={loading}
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

            {/* Search Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                sx={{
                  backgroundColor: 'green',
                  width: '50%',
                  '&:hover': {
                    backgroundColor: 'darkgreen',
                  },
                }}
              >
                Search
              </Button>
            </Grid>

            {/* Job Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleSort("employeeName")}
                      style={{ cursor: "pointer" }}
                    >
                      Employee Name{" "}
                      {sortConfig.key === "employeeName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort("jobTitle")}
                      style={{ cursor: "pointer" }}
                    >
                      Job Title{" "}
                      {sortConfig.key === "jobTitle" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort("jobType")}
                      style={{ cursor: "pointer" }}
                    >
                      Job Type{" "}
                      {sortConfig.key === "jobType" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort("pay")}
                      style={{ cursor: "pointer" }}
                    >
                      Pay{" "}
                      {sortConfig.key === "pay" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort("annualIP")}
                      style={{ cursor: "pointer" }}
                    >
                      Annual IP{" "}
                      {sortConfig.key === "annualIP" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort("longIP")}
                      style={{ cursor: "pointer" }}
                    >
                      Long Term IP{" "}
                      {sortConfig.key === "longIP" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort("status")}
                      style={{ cursor: "pointer" }}
                    >
                      Status{" "}
                      {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.map((job, index) => (
                    <TableRow key={job.id || index} sx={{ backgroundColor: "#E9E9EA" }}>
                      <TableCell>{job.employeeName}</TableCell>
                      <TableCell>{job.jobTitle}</TableCell>
                      <TableCell>{job.jobType}</TableCell>
                      <TableCell>{job.pay}</TableCell>
                      <TableCell>{job.annualIP}</TableCell>
                      <TableCell>{job.longIP}</TableCell>
                      <TableCell>
                        <Select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job, e.target.value)}
                          disabled={loading}
                          sx={{
                            borderRadius: "20px",
                            backgroundColor: "#E9E9EA",
                            minWidth: "100px",
                            height: "30px",
                          }}
                        >
                          <MenuItem value="Accepted">
                            <Box display="flex" alignItems="center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="12px"
                                fill="#EA3323"
                                style={{ marginRight: 8 }}
                              >
                                <path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                              </svg>
                              Accepted
                            </Box>
                          </MenuItem>
                          <MenuItem value="Requested">
                            <Box display="flex" alignItems="center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="12px"
                                fill="#EA3323"
                                style={{ marginRight: 8 }}
                              >
                                <path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                              </svg>
                              Requested
                            </Box>
                          </MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => handleMenuOpen(event, job)}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleView}>View</MenuItem>
                          <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Box>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredJobs.length)} of {filteredJobs.length} entries
              </Box>
              <Pagination
                count={Math.ceil(filteredJobs.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                disabled={loading}
              />
            </Box>

            {/* Add Job Modal */}
            <Modal open={modalOpen} onClose={handleModalClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: "8px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                }}
              >
                <DialogTitle>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <span>Add Offer Approval</span>
                    <Button onClick={handleClose} sx={{ minWidth: 0, padding: 0 }}>
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
                        label="Employee Name"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Department</InputLabel>
                        <Select
                          name="department"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                          <MenuItem value="Development">Development</MenuItem>
                          <MenuItem value="Android">Android</MenuItem>
                          <MenuItem value="Design">Design</MenuItem>
                          <MenuItem value="Testing">Testing</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Job Location</InputLabel>
                        <Select
                          name="jobLocation"
                          value={formData.jobLocation}
                          onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
                        >
                          <MenuItem value="Chennai">Chennai</MenuItem>
                          <MenuItem value="Bangalore">Bangalore</MenuItem>
                          <MenuItem value="Mumbai">Mumbai</MenuItem>
                          <MenuItem value="Delhi">Delhi</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Pay"
                        name="pay"
                        value={formData.pay}
                        onChange={(e) => setFormData({ ...formData, pay: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Salary From"
                        name="salaryFrom"
                        type="number"
                        value={formData.salaryFrom}
                        onChange={(e) => setFormData({ ...formData, salaryFrom: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Salary To"
                        name="salaryTo"
                        type="number"
                        value={formData.salaryTo}
                        onChange={(e) => setFormData({ ...formData, salaryTo: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Job Type</InputLabel>
                        <Select
                          name="jobType"
                          value={formData.jobType}
                          onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                        >
                          <MenuItem value="Temporary">Temporary</MenuItem>
                          <MenuItem value="Salary">Salary</MenuItem>
                          <MenuItem value="Contract">Contract</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <MenuItem value="Requested">Requested</MenuItem>
                          <MenuItem value="Accepted">Accepted</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Long Term IP</InputLabel>
                        <Select
                          name="longIP"
                          value={formData.longIP}
                          onChange={(e) => setFormData({ ...formData, longIP: e.target.value })}
                        >
                          <MenuItem value="NO">NO</MenuItem>
                          <MenuItem value="YES">YES</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Annual IP"
                        name="annualIP"
                        value={formData.annualIP}
                        onChange={handleAnnualIPChange}
                        helperText="Please enter a percentage (0-100)"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button 
                          variant="outlined" 
                          onClick={handleModalClose}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="contained" 
                          sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }} 
                          onClick={handleAddJob}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
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

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Offer_Approved;