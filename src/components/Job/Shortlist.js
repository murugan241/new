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
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

const Shortlist = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [indexOfLastItem, setIndexOfLastItem] = useState(2);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const itemsPerPage = 2;
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
  });
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ili = currentPage * itemsPerPage;
    const ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    const c = filteredJobs.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredJobs]);

  useEffect(() => {
    const fetchShortlist = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/shortlists`);
        if (!response.ok) {
          throw new Error("Failed to fetch shortlist");
        }
        const data = await response.json();
        setJobs(data.shortlistEntries || []);
        setFilteredJobs(data.shortlistEntries || []);
      } catch (error) {
        console.error("Error fetching shortlist:", error);
        setError("Failed to load shortlist.");
      }
    };

    fetchShortlist();
  }, []);

  const handleSort = (column) => {
    const newDirection = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedJobs = [...currentItems].sort((a, b) => {
      if (typeof a[column] === "string") {
        return newDirection === "asc" ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]);
      }
      return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
    });

    setSortConfig({ key: column, direction: newDirection });
    setCurrentItems(sortedJobs);
  };

  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      return (
        (filters.employeeName ? job.employeeName === filters.employeeName : true) &&
        (filters.jobTitle ? job.jobTitle === filters.jobTitle : true) &&
        (filters.department ? job.department === filters.department : true)
      );
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
  };

  const addShortlistToDatabase = async (formData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const endpoint = `${API_URL}/api/shortlists/add`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add candidate to shortlist");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding candidate to shortlist:", error);
      throw error;
    }
  };

  const handleAddShortlist = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await addShortlistToDatabase(formData);
      console.log("Candidate added to shortlist:", result);
      setJobs([...jobs, result]);
      setFilteredJobs([...filteredJobs, result]);
      handleModalClose();
    } catch (error) {
      setError(error.message || "Failed to add candidate to shortlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
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
            <h2>Candidate Shortlist</h2>
            <p>Configuration / Candidate Shortlist</p>
            
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
                      <MenuItem value="Madhan">Madhan</MenuItem>
                      <MenuItem value="Kishore">Kishore</MenuItem>
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
                      <MenuItem value="Web Developer">Web Developer</MenuItem>
                      <MenuItem value="Android Developer">Android Developer</MenuItem>
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
                      <MenuItem value="Development">Development</MenuItem>
                      <MenuItem value="Android">Android</MenuItem>
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
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleSort("employeeName")} style={{ cursor: "pointer" }}>
                      Employee Name {sortConfig.key === "employeeName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("jobTitle")} style={{ cursor: "pointer" }}>
                      Job Title {sortConfig.key === "jobTitle" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("department")} style={{ cursor: "pointer" }}>
                      Department {sortConfig.key === "department" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                      Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.map((job, index) => (
                    <TableRow key={index} sx={{ backgroundColor: "#E9E9EA" }}>
                      <TableCell>{job.employeeName}</TableCell>
                      <TableCell>{job.jobTitle}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Box>
                Showing {currentPage} to {Math.ceil(jobs.length / itemsPerPage)} of {indexOfLastItem} entries
              </Box>
              <Pagination
                count={Math.ceil(filteredJobs.length / itemsPerPage)}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          </div>
        </Grid>
      </Grid>
      
      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="md">
        <DialogTitle>Add Candidate to Shortlist</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Employee Name"
              name="employeeName"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <MenuItem value="Development">Development</MenuItem>
                <MenuItem value="Android">Android</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Job Location"
              name="jobLocation"
              value={formData.jobLocation}
              onChange={(e) => setFormData({ ...formData, jobLocation: e.target.value })}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Salary From"
                  name="salaryFrom"
                  value={formData.salaryFrom}
                  onChange={(e) => setFormData({ ...formData, salaryFrom: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Salary To"
                  name="salaryTo"
                  value={formData.salaryTo}
                  onChange={(e) => setFormData({ ...formData, salaryTo: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    name="jobType"
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="Offered">Offered</MenuItem>
                    <MenuItem value="Not Offered">Not Offered</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Expire Date"
                  name="expireDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.expireDate}
                  onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleAddShortlist} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      
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
    </Grid>
  );
};

export default Shortlist;