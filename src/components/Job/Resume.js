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
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

const Resume = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [indexOfLastItem, setIndexOfLastItem] = useState(2);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const itemsPerPage = 2;
  
  // Remove dummy data - start with empty array
  const [jobs, setJobs] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    jobTitle: "",
    department: "",
    jobLocation: "",
    salaryFrom: "",
    salaryTo: "",
    jobType: "",
    status: "",
    startDate: "",
    expireDate: "",
    description: "",
  });

  const [filters, setFilters] = useState({
    employeeName: "",
    jobTitle: "",
    department: "",
    fromDate: "",
    toDate: "",
  });

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [fileName, setFileName] = useState("");

  // Fetch resumes from backend on component mount
  useEffect(() => {
    fetchResumes();
  }, []);

  // Update current items when page or filtered data changes
  useEffect(() => {
    const ili = currentPage * itemsPerPage;
    const ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    const c = filteredJobs.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredJobs]);

  // Fetch resumes from backend
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/resumes`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch resumes");
      }
      
      const data = await response.json();
      setJobs(data.resumes || []);
      setFilteredJobs(data.resumes || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      setError("Failed to load resumes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    const newDirection =
      sortConfig.key === column && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    const sortedJobs = [...currentItems].sort((a, b) => {
      if (typeof a[column] === "string") {
        return newDirection === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
    });

    setSortConfig({ key: column, direction: newDirection });
    setCurrentItems(sortedJobs);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      return (
        (filters.employeeName ? job.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase()) : true) &&
        (filters.jobTitle ? job.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase()) : true) &&
        (filters.department ? job.department === filters.department : true) &&
        (filters.fromDate ? new Date(job.startDate) >= new Date(filters.fromDate) : true) &&
        (filters.toDate ? new Date(job.expireDate) <= new Date(filters.toDate) : true)
      );
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleView = () => {
    alert(`Viewing job: ${selectedJob.jobTitle}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    alert(`Deleting job: ${selectedJob.jobTitle}`);
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
      department: "",
      jobLocation: "",
      salaryFrom: "",
      salaryTo: "",
      jobType: "",
      status: "",
      startDate: "",
      expireDate: "",
      description: "",
    });
    setError("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const fetchFileUrl = (employeeId) => {
    return `https://example.com/files/${employeeId}.pdf`;
  };

  const handleDownload = () => {
    if (employeeId) {
      const fileUrl = fetchFileUrl(employeeId);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    } else {
      alert("Please enter a valid employee ID.");
    }
  };

  const addResumeToDatabase = async (formData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const endpoint = `${API_URL}/api/resumes/add`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add resume");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding resume:", error);
      throw error;
    }
  };

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
    if (!formData.startDate) {
      errors.push("Start Date is required.");
    }
    if (!formData.expireDate) {
      errors.push("Expire Date is required.");
    }
    if (formData.startDate && formData.expireDate && new Date(formData.startDate) > new Date(formData.expireDate)) {
      errors.push("Expire date must be after start date.");
    }
    
    if (errors.length > 0) {
      setError(errors.join(" "));
      return false;
    }
    return true;
  };

  const handleAddResume = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await addResumeToDatabase(formData);
      console.log("Resume saved:", result);
      setJobs([...jobs, result]);
      setFilteredJobs([...filteredJobs, result]);
      setSuccess(true);
      handleModalClose();
    } catch (error) {
      setError(error.message || "Failed to save resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  // Get unique values for filter dropdowns
  const uniqueEmployees = [...new Set(jobs.map(job => job.employeeName))];
  const uniqueDepartments = [...new Set(jobs.map(job => job.department))];

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
            <h2>Resume</h2>
            <p>Configuration / Resume</p>
            
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Employee Name</InputLabel>
                    <Select
                      name="employeeName"
                      value={filters.employeeName}
                      onChange={handleFilterChange}
                      sx={{ backgroundColor: "#fff", height: "35px" }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueEmployees.map((employee) => (
                        <MenuItem key={employee} value={employee}>
                          {employee}
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
                      sx={{ backgroundColor: "#fff", height: "35px" }}
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
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="From Date"
                    name="fromDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                    sx={{ backgroundColor: "#fff", height: "35px" }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="To Date"
                    name="toDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.toDate}
                    onChange={handleFilterChange}
                    sx={{ backgroundColor: "#fff", height: "35px" }}
                  />
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
                      <TableCell
                        onClick={() => handleSort("employeeName")}
                        style={{ cursor: "pointer" }}
                      >
                        Employee Name{" "}
                        {sortConfig.key === "employeeName" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("jobTitle")}
                        style={{ cursor: "pointer" }}
                      >
                        Job Title{" "}
                        {sortConfig.key === "jobTitle" &&
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
                        onClick={() => handleSort("startDate")}
                        style={{ cursor: "pointer" }}
                      >
                        Start Date{" "}
                        {sortConfig.key === "startDate" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("expireDate")}
                        style={{ cursor: "pointer" }}
                      >
                        Expire Date{" "}
                        {sortConfig.key === "expireDate" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("jobType")}
                        style={{ cursor: "pointer" }}
                      >
                        Job Type{" "}
                        {sortConfig.key === "jobType" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("status")}
                        style={{ cursor: "pointer" }}
                      >
                        Status{" "}
                        {sortConfig.key === "status" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell>Resume</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((job, index) => (
                      <TableRow 
                        key={job._id || index} 
                        sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7" }}
                      >
                        <TableCell>{job.employeeName}</TableCell>
                        <TableCell>{job.jobTitle}</TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>
                          {job.startDate ? new Date(job.startDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {job.expireDate ? new Date(job.expireDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ 
                            color: job.jobType === "Full Time" ? "green" : "orange", 
                            fontWeight: "bold" 
                          }}>
                            {job.jobType}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ 
                            color: job.status === "Open" ? "green" : "red", 
                            fontWeight: "bold" 
                          }}>
                            {job.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: "5px",
                              backgroundColor: "orange",
                              color: "white",
                              fontWeight: "bold",
                              padding: "5px 15px",
                              textTransform: "none",
                            }}
                            onClick={handleDownload}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
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
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">Add Resume</Typography>
                    <Button onClick={handleClose} sx={{ minWidth: 0, padding: 0 }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#EA3323"
                      >
                        <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                    </Button>
                  </Box>
                </DialogTitle>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box
                  sx={{
                    maxHeight: "500px",
                    overflowY: "auto",
                    padding: "0 16px",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} mb={2}>
                      <TextField
                        fullWidth
                        label="Employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        helperText="Enter the Employee ID to download the resume"
                      />
                    </Grid>
                    <Grid item xs={12} mb={2}>
                      <TextField
                        fullWidth
                        label="Employee Name *"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employeeName: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Job Title *"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Department *</InputLabel>
                        <Select
                          name="department"
                          value={formData.department}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              department: e.target.value,
                            })
                          }
                          required
                        >
                          <MenuItem value="Development">Development</MenuItem>
                          <MenuItem value="Android">Android</MenuItem>
                          <MenuItem value="HR">HR</MenuItem>
                          <MenuItem value="Marketing">Marketing</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Job Location</InputLabel>
                        <Select
                          name="jobLocation"
                          value={formData.jobLocation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              jobLocation: e.target.value,
                            })
                          }
                        >
                          <MenuItem value="Chennai">Chennai</MenuItem>
                          <MenuItem value="Bangalore">Bangalore</MenuItem>
                          <MenuItem value="Mumbai">Mumbai</MenuItem>
                          <MenuItem value="Delhi">Delhi</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Salary From"
                        name="salaryFrom"
                        type="number"
                        value={formData.salaryFrom}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salaryFrom: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Salary To"
                        name="salaryTo"
                        type="number"
                        value={formData.salaryTo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salaryTo: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Job Type</InputLabel>
                        <Select
                          name="jobType"
                          value={formData.jobType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              jobType: e.target.value,
                            })
                          }
                        >
                          <MenuItem value="Full Time">Full Time</MenuItem>
                          <MenuItem value="Part Time">Part Time</MenuItem>
                          <MenuItem value="Contract">Contract</MenuItem>
                          <MenuItem value="Internship">Internship</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              status: e.target.value,
                            })
                          }
                        >
                          <MenuItem value="Open">Open</MenuItem>
                          <MenuItem value="Closed">Closed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Start Date *"
                        name="startDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expire Date *"
                        name="expireDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.expireDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expireDate: e.target.value,
                          })
                        }
                        required
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label">
                        Upload Files
                        <input type="file" hidden onChange={handleFileChange} />
                      </Button>
                      {fileName && (
                        <Typography variant="body2" mt={1}>
                          Selected File: {fileName}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={handleModalClose}>Cancel</Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "orange",
                            "&:hover": { backgroundColor: "darkorange" },
                          }}
                          onClick={handleAddResume}
                          disabled={loading}
                        >
                          {loading ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Submit"
                          )}
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || "Resume added successfully!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Resume;