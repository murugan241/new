import React, { useState, useEffect } from "react";
import TaskView from "../Task/TaskView";
import TaskBoard from "../Task/Taskboard";
import {
  Button,
  Grid,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ButtonGroup,
  Chip,
} from "@mui/material";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

const Projects = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [activeComponent, setActiveComponent] = useState("projects");
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    client: "",
    startDate: "",
    endDate: "",
    rate: "",
    priority: "Medium",
    projectLead: "",
    teamMembers: "",
    jobDescription: "",
    files: null,
    status: "ongoing",
  });
  const [storedProjects, setStoredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});

  const excludedDisplayFields = [
    '_id',
    'id',
    'startDate',
    'start Date',
    'endDate',
    'end Date',
    'createdAt',
    'created At',
    'updatedAt',
    'updated At',
    'isActive',
    'is Active',
    'active'
  ];

  const statusConfig = {
    ongoing: { color: '#2196F3', bgColor: '#E3F2FD', label: 'Ongoing' },
    pending: { color: '#FF9800', bgColor: '#FFF3E0', label: 'Pending' },
    rejected: { color: '#F44336', bgColor: '#FFEBEE', label: 'Rejected' }
  };

  const handleOpenPopup = () => setOpenPopup(true);

  const handleClosePopup = () => {
    setOpenPopup(false);
    setFormData({
      projectName: "",
      client: "",
      startDate: "",
      endDate: "",
      rate: "",
      priority: "Medium",
      projectLead: "",
      teamMembers: "",
      jobDescription: "",
      files: null,
      status: "ongoing",
    });
    setSearchTerm("");
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB.");
      return;
    }
    setFormData({ ...formData, files: file });
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.projectName.trim()) {
      errors.push("Project Name is required.");
    }
    if (!formData.client.trim()) {
      errors.push("Client is required.");
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.push("End date must be after start date.");
    }
    if (formData.rate && isNaN(Number(formData.rate))) {
      errors.push("Rate must be a valid number.");
    }
    if (errors.length > 0) {
      setError(errors.join(" "));
      return false;
    }
    return true;
  };

  const addProjectToDatabase = async (formData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/projects/add`;

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add project");
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/projects/${projectId}/status`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project status");
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating project status:', error);
      throw error;
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    setStatusLoading(prev => ({ ...prev, [projectId]: true }));

    try {
      await updateProjectStatus(projectId, newStatus);

      const updateProjects = (projects) =>
        projects.map(project =>
          project._id === projectId || project.id === projectId
            ? { ...project, status: newStatus }
            : project
        );

      setStoredProjects(updateProjects);
      setFilteredProjects(updateProjects);

    } catch (error) {
      setError(error.message || "Failed to update project status.");
    } finally {
      setStatusLoading(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await addProjectToDatabase(formData);
      console.log("Project saved:", result);
      setStoredProjects([...storedProjects, result]);
      setFilteredProjects([...filteredProjects, result]);
      handleClosePopup();
    } catch (error) {
      setError(error.message || "Failed to save project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredProjects(storedProjects);
    } else {
      const filtered = storedProjects.filter((project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  const handleTaskViewClick = () => {
    setShowCreateProject(false);
    setActiveComponent("taskView");
  };

  const handleProjectButtonClick = () => {
    setShowCreateProject(true);
    setActiveComponent("project");
  };

  const handleTaskboard = () => {
    setShowCreateProject(false);
    setActiveComponent("taskBoard");
  };

  const handleCloseSnackbar = () => {
    setError("");
  };

  const getDisplayableFields = (project) => {
    return Object.entries(project).filter(([key, value]) => {
      return !excludedDisplayFields.some(excludedField =>
        key.toLowerCase() === excludedField.toLowerCase() ||
        key.replace(/([A-Z])/g, " $1").trim().toLowerCase() === excludedField.toLowerCase()
      );
    });
  };

  const getProjectId = (project) => {
    return project._id || project.id;
  };

  const getProjectStatus = (project) => {
    return project.status || 'ongoing';
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/projects`);
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setStoredProjects(data.projects || []);
        setFilteredProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects.");
      }
    };

    fetchProjects();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex' }}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} sm={9} md={10} sx={{ padding: 2, minHeight: "100vh", backgroundColor: "#ffffff" }}>
          <Container>
            <Box sx={{ padding: 2 }}>
              <Grid container spacing={2} justifyContent="flex-start">
                <Grid item xs={12} sm={4} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleProjectButtonClick}
                    sx={{
                      backgroundColor: showCreateProject ? "#004E69" : "white",
                      color: showCreateProject ? "white" : "black",
                    }}
                  >
                    Projects
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: activeComponent === "taskView" ? "#004E69" : "white",
                      color: activeComponent === "taskView" ? "white" : "black",
                    }}
                    onClick={handleTaskViewClick}
                  >
                    Task View
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "#004E69",
                        color: "white",
                      },
                    }}
                    onClick={handleTaskboard}
                  >
                    Task Board
                  </Button>
                </Grid>
              </Grid>

              {showCreateProject && activeComponent === "project" && (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">Projects</Typography>
                      <Typography>Dashboard / Projects</Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>}
                      onClick={handleOpenPopup}
                      sx={{
                        backgroundColor: "#FF902F",
                        borderRadius: "50px",
                        "&:hover": { backgroundColor: "#FF902F" },
                        color: "white",
                      }}
                    >
                      Create Project
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                    <TextField
                      placeholder="Project Name"
                      fullWidth
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <TextField placeholder="Employee Name" fullWidth />
                    <TextField placeholder="Designation" fullWidth />
                  </Box>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#55CE63", width: "50%", marginTop: 3, padding: 1.5 }}
                    onClick={handleSearch}
                  >
                    SEARCH
                  </Button>

                  <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Projects:</Typography>
                    {filteredProjects.length ? (
                      <Grid container spacing={2}>
                        {filteredProjects.map((project, idx) => {
                          const projectId = getProjectId(project);
                          const currentStatus = getProjectStatus(project);
                          const isStatusLoading = statusLoading[projectId];

                          return (
                            <Grid item xs={12} md={6} key={idx}>
                              <Box sx={{ padding: 2, border: "1px solid #ccc", marginBottom: 2, borderRadius: 1 }}>
                                <Grid container spacing={2}>
                                  {getDisplayableFields(project).map(([key, value]) => (
                                    <Grid item xs={6} key={key}>
                                      <Typography sx={{ fontWeight: key === "projectName" ? "bold" : "normal", mb: 0.5 }}>
                                        {`${key.replace(/([A-Z])/g, " $1")}: ${value}`}
                                      </Typography>
                                    </Grid>
                                  ))}
                                </Grid>
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Current Status:
                                  </Typography>
                                  <Chip
                                    label={statusConfig[currentStatus]?.label || currentStatus}
                                    sx={{
                                      backgroundColor: statusConfig[currentStatus]?.bgColor || '#E0E0E0',
                                      color: statusConfig[currentStatus]?.color || '#000000',
                                      fontWeight: 'bold',
                                    }}
                                  />
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Update Status:
                                  </Typography>
                                  <ButtonGroup variant="outlined" size="small" disabled={isStatusLoading}>
                                    {Object.entries(statusConfig).map(([status, config]) => (
                                      <Button
                                        key={status}
                                        onClick={() => handleStatusChange(projectId, status)}
                                        disabled={isStatusLoading || currentStatus === status}
                                        sx={{
                                          backgroundColor: currentStatus === status ? config.bgColor : 'transparent',
                                          color: currentStatus === status ? config.color : 'inherit',
                                          borderColor: config.color,
                                          '&:hover': {
                                            backgroundColor: config.bgColor,
                                            color: config.color,
                                          },
                                          '&.Mui-disabled': {
                                            backgroundColor: currentStatus === status ? config.bgColor : 'transparent',
                                            color: currentStatus === status ? config.color : 'rgba(0, 0, 0, 0.26)',
                                          }
                                        }}
                                      >
                                        {isStatusLoading ? (
                                          <CircularProgress size={16} />
                                        ) : (
                                          config.label
                                        )}
                                      </Button>
                                    ))}
                                  </ButtonGroup>
                                </Box>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    ) : (
                      <Typography>No projects found.</Typography>
                    )}
                  </Box>
                </>
              )}

              <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
                <DialogTitle>Create Project</DialogTitle>
                <DialogContent>
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                  <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      name="projectName"
                      label="Project Name"
                      fullWidth
                      value={formData.projectName}
                      onChange={handleInputChange}
                      required
                    />
                    <TextField
                      name="client"
                      label="Client"
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
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="rate"
                          label="Rate"
                          type="number"
                          fullWidth
                          value={formData.rate}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Priority</InputLabel>
                          <Select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            label="Priority"
                          >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="projectLead"
                          label="Project Lead"
                          fullWidth
                          value={formData.projectLead}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Initial Status</InputLabel>
                          <Select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            label="Initial Status"
                          >
                            <MenuItem value="ongoing">Ongoing</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <TextField
                      name="teamMembers"
                      label="Team Members"
                      fullWidth
                      value={formData.teamMembers}
                      onChange={handleInputChange}
                    />
                    <TextField
                      name="jobDescription"
                      label="Job Description"
                      fullWidth
                      multiline
                      rows={4}
                      value={formData.jobDescription}
                      onChange={handleInputChange}
                    />
                    <Button variant="outlined" component="label">
                      Upload Files
                      <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClosePopup}>Cancel</Button>
                  <Button onClick={handleSave} color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Save"}
                  </Button>
                </DialogActions>
              </Dialog>

              {activeComponent === "taskView" && <TaskView />}
              {activeComponent === "taskBoard" && <TaskBoard />}
            </Box>
          </Container>
        </Grid>
      </Grid>
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

export default Projects;
