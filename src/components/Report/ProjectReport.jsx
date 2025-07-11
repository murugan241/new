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

const ProjectReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [indexOfLastItem, setIndexOfLastItem] = useState(5);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const itemsPerPage = 5;
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    team: "",
  });

  const [filters, setFilters] = useState({
    title: "",
    client: "",
    status: "",
  });

  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const ili = currentPage * itemsPerPage;
    const ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    const c = filteredProjects.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredProjects]);

  const fetchProjects = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/project-reports`);
      if (!response.ok) {
        throw new Error("Failed to fetch project reports");
      }
      const data = await response.json();
      setProjects(data.projectReports || []);
      setFilteredProjects(data.projectReports || []);
    } catch (error) {
      console.error("Error fetching project reports:", error);
      setError("Failed to load project reports.");
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
      team: "",
    });
  };

  const handleSort = (column) => {
    const newDirection = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction: newDirection });

    const sortedProjects = [...currentItems].sort((a, b) => {
      if (a[column] < b[column]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setCurrentItems(sortedProjects);
  };

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleSearch = () => {
    const filtered = projects.filter((project) => {
      return (
        (filters.title ? project.title.includes(filters.title) : true) &&
        (filters.client ? project.client.includes(filters.client) : true) &&
        (filters.status ? project.status === filters.status : true)
      );
    });
    setFilteredProjects(filtered);
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
    if (!formData.title.trim()) {
      setError("Project Title is required.");
      return false;
    }
    if (!formData.client) {
      setError("Client Name is required.");
      return false;
    }
    if (!formData.startDate) {
      setError("Start Date is required.");
      return false;
    }
    if (!formData.endDate) {
      setError("End Date is required.");
      return false;
    }
    return true;
  };

  const handleAddProject = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/project-reports/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add project report");
      }

      const result = await response.json();
      setProjects([...projects, result]);
      setFilteredProjects([...filteredProjects, result]);
      setSuccess(true);
      handleModalClose();
    } catch (err) {
      setError(err.message || "Failed to submit project report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
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
            <h2>Project Report</h2>
            <p>Reporting / Project Report</p>

            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <TextField
                    label="Search Project Title"
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
                      <MenuItem value="Vignesh">Vignesh</MenuItem>
                      <MenuItem value="Bobby">Bobby</MenuItem>
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
                    <TableCell onClick={() => handleSort("title")} style={{ cursor: "pointer" }}>
                      Project Title {sortConfig.key === "title" && (sortConfig.direction === "asc" ? "↑" : "↓")}
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
                    <TableCell onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                      Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell>Team</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.map((project, index) => (
                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7" }}>
                      <TableCell>{project.title}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>{project.startDate}</TableCell>
                      <TableCell>{project.endDate}</TableCell>
                      <TableCell>
                        <Box sx={{ color: project.status === "Pending" ? "red" : "green", fontWeight: "bold" }}>
                          {project.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography>{project.team}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProjects.length)} of {filteredProjects.length} entries
              </Typography>
              <Pagination
                count={Math.ceil(filteredProjects.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>

            <Modal open={modalOpen} onClose={handleModalClose}>
              <Box sx={modalStyle}>
                <DialogTitle>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Add Project Report</Typography>
                    <Button onClick={handleClose} sx={{ minWidth: 0, padding: 0 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323">
                        <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                      </svg>
                    </Button>
                  </Box>
                </DialogTitle>
                <Box sx={{ maxHeight: '500px', overflowY: 'auto', padding: '0 16px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Project Title"
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Client Name"
                        name="client"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        name="startDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="End Date"
                        name="endDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          sx={{
                            '& .MuiSelect-select': {
                              color: formData.status === "Pending" ? "red" : "green",
                              fontWeight: "bold"
                            }
                          }}
                        >
                          <MenuItem value="Pending" sx={{ color: "red" }}>Pending</MenuItem>
                          <MenuItem value="Approved" sx={{ color: "green" }}>Approved</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Team Members"
                        name="team"
                        value={formData.team}
                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                        placeholder="Enter team member names, separated by commas"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }}
                          onClick={handleAddProject}
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
          {error || "Project report submitted successfully!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProjectReport;