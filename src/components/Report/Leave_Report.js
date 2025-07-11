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
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const LeaveReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [indexOfLastItem, setIndexOfLastItem] = useState(5);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const itemsPerPage = 5;
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingLeaveId, setEditingLeaveId] = useState(null);

  const [formData, setFormData] = useState({
    empName: "",
    date: "",
    dept: "",
    leaveType: "",
    noOfDays: "",
    remainingLeave: "",
    status: "Approved",
    workLocation: "Office",
  });

  const [filters, setFilters] = useState({
    empName: "",
    dept: "",
    status: "",
  });

  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Fetch leaves from backend on component mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  // Update current items when page or filtered data changes
  useEffect(() => {
    const ili = currentPage * itemsPerPage;
    const ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    const c = filteredLeaves.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredLeaves]);

  // Fetch leaves from backend
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Fetching from:', `${API_URL}/api/leave-reports`); // Debug log
      
      const response = await fetch(`${API_URL}/api/leave-reports`);
      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`Failed to fetch leave reports: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log
      
      // Check different possible response structures
      let leaveData = [];
      if (data.leaves) {
        leaveData = data.leaves;
      } else if (data.leaveReports) {
        leaveData = data.leaveReports;
      } else if (Array.isArray(data)) {
        leaveData = data;
      } else if (data.data) {
        leaveData = data.data;
      }
      
      console.log('Processed leave data:', leaveData); // Debug log
      
      setLeaves(leaveData);
      setFilteredLeaves(leaveData);
    } catch (error) {
      console.error("Error fetching leave reports:", error);
      setError(`Failed to load leave reports: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add leave to database
  const addLeaveToDatabase = async (leaveData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/leave-reports/add`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add leave");
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding leave:', error);
      throw error;
    }
  };

  // Update leave in database
  const updateLeaveInDatabase = async (leaveId, leaveData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/leave-reports/update/${leaveId}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update leave");
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating leave:', error);
      throw error;
    }
  };

  // Delete leave from database
  const deleteLeaveFromDatabase = async (leaveId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/leave-reports/delete/${leaveId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete leave");
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting leave:', error);
      throw error;
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
    setEditMode(false);
    setEditingLeaveId(null);
    setError("");
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditingLeaveId(null);
    setFormData({
      empName: "",
      date: "",
      dept: "",
      leaveType: "",
      noOfDays: "",
      remainingLeave: "",
      status: "Approved",
      workLocation: "Office",
    });
    setError("");
  };

  const handleSort = (column) => {
    const newDirection = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction: newDirection });

    const sortedLeaves = [...filteredLeaves].sort((a, b) => {
      if (typeof a[column] === "string") {
        return newDirection === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
    });

    setFilteredLeaves(sortedLeaves);
  };

  const handleSearch = () => {
    const filtered = leaves.filter((leave) => {
      return (
        (filters.empName ? leave.empName.toLowerCase().includes(filters.empName.toLowerCase()) : true) &&
        (filters.dept ? leave.dept === filters.dept : true) &&
        (filters.status ? leave.status === filters.status : true)
      );
    });
    setFilteredLeaves(filtered);
    setCurrentPage(1);
  };

  const handleView = (leave) => {
    alert(`Viewing leave: ${leave.empName}`);
    handleMenuClose();
  };

  const handleEdit = (leave) => {
    setFormData({
      empName: leave.empName,
      date: leave.date,
      dept: leave.dept,
      leaveType: leave.leaveType,
      noOfDays: leave.noOfDays,
      remainingLeave: leave.remainingLeave,
      status: leave.status,
      workLocation: leave.workLocation,
    });
    setEditMode(true);
    setEditingLeaveId(leave._id);
    setModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = async (leave) => {
    if (window.confirm(`Are you sure you want to delete leave for: ${leave.empName}?`)) {
      try {
        setLoading(true);
        await deleteLeaveFromDatabase(leave._id);

        // Update local state
        const updatedLeaves = leaves.filter(l => l._id !== leave._id);
        setLeaves(updatedLeaves);
        setFilteredLeaves(updatedLeaves);
        setSuccess(true);
      } catch (error) {
        setError(error.message || "Failed to delete leave. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    handleMenuClose();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleMenuOpen = (event, leave) => {
    setAnchorEl(event.currentTarget);
    setSelectedLeave(leave);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLeave(null);
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.empName.trim()) {
      errors.push("Employee Name is required.");
    }
    if (!formData.date) {
      errors.push("Date is required.");
    }
    if (!formData.dept) {
      errors.push("Department is required.");
    }
    if (!formData.leaveType) {
      errors.push("Leave Type is required.");
    }
    if (!formData.noOfDays) {
      errors.push("Number of Days is required.");
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
      return false;
    }
    return true;
  };

  const handleAddLeave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (editMode) {
        // Update existing leave
        const result = await updateLeaveInDatabase(editingLeaveId, formData);
        console.log("Leave updated:", result);

        // Update local state
        const updatedLeaves = leaves.map(leave =>
          leave._id === editingLeaveId ? { ...leave, ...formData } : leave
        );
        setLeaves(updatedLeaves);
        setFilteredLeaves(updatedLeaves);
      } else {
        // Add new leave
        const result = await addLeaveToDatabase(formData);
        console.log("Leave saved:", result);

        // Update local state
        const updatedLeaves = [...leaves, result];
        setLeaves(updatedLeaves);
        setFilteredLeaves(updatedLeaves);
      }

      setSuccess(true);
      handleModalClose();

      // Refresh the leave list
      fetchLeaves();
    } catch (error) {
      console.error("Error saving leave:", error);
      setError(error.message || "Failed to save leave. Please try again.");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Pending":
        return "orange";
      case "Rejected":
        return "red";
      default:
        return "gray";
    }
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

  // Get unique departments for filter dropdown
  const uniqueDepartments = [...new Set(leaves.map(leave => leave.dept))];

  // Debug information
  console.log('Current state:', {
    leaves: leaves.length,
    filteredLeaves: filteredLeaves.length,
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
            <h2>Leave Report</h2>
            <p>Reporting / Leave Report</p>

            {/* Debug information */}
            <Box sx={{ p: 1, mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption">
                Debug: Total leaves: {leaves.length}, Filtered: {filteredLeaves.length}, Current items: {currentItems.length}
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <TextField
                    label="Search Employee Name"
                    name="empName"
                    value={filters.empName}
                    onChange={handleFilterChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "#fff", height: "35px" }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      name="dept"
                      value={filters.dept}
                      onChange={handleFilterChange}
                      sx={{ backgroundColor: "#fff", height: "35px" }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueDepartments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
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
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
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
            ) : filteredLeaves.length === 0 ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="h6" color="textSecondary">
                  No leave records found
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell onClick={() => handleSort("empName")} style={{ cursor: "pointer" }}>
                        Employee Name {sortConfig.key === "empName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                        Date {sortConfig.key === "date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("dept")} style={{ cursor: "pointer" }}>
                        Department {sortConfig.key === "dept" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("leaveType")} style={{ cursor: "pointer" }}>
                        Leave Type {sortConfig.key === "leaveType" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("noOfDays")} style={{ cursor: "pointer" }}>
                        No. of Days {sortConfig.key === "noOfDays" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("remainingLeave")} style={{ cursor: "pointer" }}>
                        Remaining Leave {sortConfig.key === "remainingLeave" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                        Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("workLocation")} style={{ cursor: "pointer" }}>
                        Work Location {sortConfig.key === "workLocation" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((leave, index) => (
                      <TableRow key={leave._id || index} sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7" }}>
                        <TableCell>{leave.empName}</TableCell>
                        <TableCell>{leave.date ? new Date(leave.date).toLocaleDateString() : leave.date}</TableCell>
                        <TableCell>{leave.dept}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <FiberManualRecordIcon sx={{ fontSize: 8, color: getStatusColor(leave.status) }} />
                            <Typography sx={{ fontWeight: 500, fontSize: "10px" }}>
                              {leave.leaveType}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{leave.noOfDays}</TableCell>
                        <TableCell>{leave.remainingLeave}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <FiberManualRecordIcon sx={{ fontSize: 8, color: getStatusColor(leave.status) }} />
                            <Typography sx={{ fontWeight: 500, fontSize: "10px" }}>
                              {leave.status}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{leave.workLocation}</TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleMenuOpen(event, leave)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Menu component was missing */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => selectedLeave && handleView(selectedLeave)}>View</MenuItem>
              <MenuItem onClick={() => selectedLeave && handleEdit(selectedLeave)}>Edit</MenuItem>
              <MenuItem onClick={() => selectedLeave && handleDelete(selectedLeave)}>Delete</MenuItem>
            </Menu>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeaves.length)} of {filteredLeaves.length} entries
              </Typography>
              <Pagination
                count={Math.ceil(filteredLeaves.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>

            <Modal open={modalOpen} onClose={handleModalClose}>
              <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{editMode ? 'Edit Leave' : 'Add Leave'}</Typography>
                  <Button onClick={handleModalClose} sx={{ minWidth: 0, padding: 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323">
                      <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                    </svg>
                  </Button>
                </Box>
                <Box sx={{ maxHeight: '500px', overflowY: 'auto', padding: '0 16px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Employee Name"
                        name="empName"
                        value={formData.empName}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Date"
                        name="date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select
                          name="dept"
                          value={formData.dept}
                          onChange={handleInputChange}
                          required
                        >
                          <MenuItem value="HR">HR</MenuItem>
                          <MenuItem value="Finance">Finance</MenuItem>
                          <MenuItem value="IT">IT</MenuItem>
                          <MenuItem value="Marketing">Marketing</MenuItem>
                          <MenuItem value="Sales">Sales</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Leave Type"
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Number of Days"
                        name="noOfDays"
                        type="number"
                        value={formData.noOfDays}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Remaining Leave"
                        name="remainingLeave"
                        type="number"
                        value={formData.remainingLeave}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          sx={{
                            '& .MuiSelect-select': {
                              color: getStatusColor(formData.status),
                              fontWeight: "bold"
                            }
                          }}
                        >
                          <MenuItem value="Approved" sx={{ color: "green" }}>Approved</MenuItem>
                          <MenuItem value="Pending" sx={{ color: "orange" }}>Pending</MenuItem>
                          <MenuItem value="Rejected" sx={{ color: "red" }}>Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Work Location</InputLabel>
                        <Select
                          name="workLocation"
                          value={formData.workLocation}
                          onChange={handleInputChange}
                        >
                          <MenuItem value="Office">Office</MenuItem>
                          <MenuItem value="Home">Home</MenuItem>
                          <MenuItem value="Remote">Remote</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }}
                          onClick={handleAddLeave}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} /> : editMode ? "Update" : "Submit"}
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
          {error || (editMode ? "Leave updated successfully!" : "Leave added successfully!")}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default LeaveReport;