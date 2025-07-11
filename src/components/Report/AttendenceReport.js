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
import LogoutIcon from "@mui/icons-material/Logout";

const AttendanceReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [indexOfLastItem, setIndexOfLastItem] = useState(5);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const itemsPerPage = 5;
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [attendances, setAttendances] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    empCode: "",
    inTime: "",
    outTime: "",
    workStatus: "Logout",
    workLocation: "Office",
  });

  const [filters, setFilters] = useState({
    employeeName: "",
    workStatus: "",
    workLocation: "",
  });

  const [filteredAttendances, setFilteredAttendances] = useState([]);

  useEffect(() => {
    fetchAttendances();
  }, []);

  useEffect(() => {
    const ili = currentPage * itemsPerPage;
    const ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    const c = filteredAttendances.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredAttendances]);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/attendance-reports`);

      if (!response.ok) {
        throw new Error("Failed to fetch attendance reports");
      }

      const data = await response.json();
      setAttendances(data.attendances || []);
      setFilteredAttendances(data.attendances || []);
    } catch (error) {
      console.error("Error fetching attendance reports:", error);
      setError("Failed to load attendance reports.");
    } finally {
      setLoading(false);
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
      employeeName: "",
      empCode: "",
      inTime: "",
      outTime: "",
      workStatus: "Logout",
      workLocation: "Office",
    });
  };

  const handleSort = (column) => {
    const newDirection = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction: newDirection });

    const sortedAttendances = [...currentItems].sort((a, b) => {
      if (a[column] < b[column]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setCurrentItems(sortedAttendances);
  };

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleSearch = () => {
    const filtered = attendances.filter((attendance) => {
      return (
        (filters.employeeName ? attendance.employeeName === filters.employeeName : true) &&
        (filters.workStatus ? attendance.workStatus === filters.workStatus : true) &&
        (filters.workLocation ? attendance.workLocation === filters.workLocation : true)
      );
    });
    setFilteredAttendances(filtered);
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
    if (!formData.employeeName.trim()) {
      setError("Employee Name is required.");
      return false;
    }
    if (!formData.empCode) {
      setError("Employee Code is required.");
      return false;
    }
    if (!formData.inTime) {
      setError("In Time is required.");
      return false;
    }
    if (!formData.outTime) {
      setError("Out Time is required.");
      return false;
    }
    return true;
  };

  const addAttendanceToDatabase = async (attendanceData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/attendance-reports/add`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add attendance");
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding attendance:', error);
      throw error;
    }
  };

  const handleAddAttendance = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await addAttendanceToDatabase(formData);
      console.log("Attendance saved:", result);

      const updatedAttendances = [...attendances, result];
      setAttendances(updatedAttendances);
      setFilteredAttendances(updatedAttendances);
      setSuccess(true);
      handleModalClose();
    } catch (error) {
      console.error("Error saving attendance:", error);
      setError(error.message || "Failed to save attendance. Please try again.");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Logout":
        return "#ff4444";
      case "Login":
        return "#4CAF50";
      case "Break":
        return "#ff9800";
      default:
        return "#ff4444";
    }
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
          <Box p={5}>
            <Typography variant="h4">Attendance Report</Typography>
            <Typography variant="subtitle1">Reporting / Attendance Report</Typography>

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
                      <MenuItem value="Manoj">Manoj</MenuItem>
                      <MenuItem value="Sarath">Sarath</MenuItem>
                      <MenuItem value="Raghul">Raghul</MenuItem>
                      <MenuItem value="Vicky">Vicky</MenuItem>
                      <MenuItem value="Durai">Durai</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Work Status</InputLabel>
                    <Select
                      name="workStatus"
                      value={filters.workStatus}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Logout">Logout</MenuItem>
                      <MenuItem value="Login">Login</MenuItem>
                      <MenuItem value="Break">Break</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Work Location</InputLabel>
                    <Select
                      name="workLocation"
                      value={filters.workLocation}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="Office">Office</MenuItem>
                      <MenuItem value="Home">Home</MenuItem>
                      <MenuItem value="Remote">Remote</MenuItem>
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
                    <TableCell onClick={() => handleSort("empCode")} style={{ cursor: "pointer" }}>
                      Employee Code {sortConfig.key === "empCode" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("inTime")} style={{ cursor: "pointer" }}>
                      In Time {sortConfig.key === "inTime" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("outTime")} style={{ cursor: "pointer" }}>
                      Out Time {sortConfig.key === "outTime" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("workStatus")} style={{ cursor: "pointer" }}>
                      Work Status {sortConfig.key === "workStatus" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("workLocation")} style={{ cursor: "pointer" }}>
                      Work Location {sortConfig.key === "workLocation" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.map((attendance, index) => (
                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7" }}>
                      <TableCell>{attendance.employeeName}</TableCell>
                      <TableCell>{attendance.empCode}</TableCell>
                      <TableCell>{attendance.inTime}</TableCell>
                      <TableCell>{attendance.outTime}</TableCell>
                      <TableCell>
                        <Box sx={{ color: getStatusColor(attendance.workStatus), fontWeight: "bold" }}>
                          {attendance.workStatus}
                        </Box>
                      </TableCell>
                      <TableCell>{attendance.workLocation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAttendances.length)} of {filteredAttendances.length} entries
              </Typography>
              <Pagination
                count={Math.ceil(filteredAttendances.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>

            <Modal open={modalOpen} onClose={handleModalClose}>
              <Box sx={modalStyle}>
                <DialogTitle>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Add Attendance</Typography>
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
                        label="Employee Code"
                        name="empCode"
                        value={formData.empCode}
                        onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="In Time"
                        name="inTime"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={formData.inTime}
                        onChange={(e) => setFormData({ ...formData, inTime: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Out Time"
                        name="outTime"
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={formData.outTime}
                        onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Work Status</InputLabel>
                        <Select
                          name="workStatus"
                          value={formData.workStatus}
                          onChange={(e) => setFormData({ ...formData, workStatus: e.target.value })}
                          sx={{
                            '& .MuiSelect-select': {
                              color: getStatusColor(formData.workStatus),
                              fontWeight: "bold"
                            }
                          }}
                        >
                          <MenuItem value="Logout" sx={{ color: "#ff4444" }}>Logout</MenuItem>
                          <MenuItem value="Login" sx={{ color: "#4CAF50" }}>Login</MenuItem>
                          <MenuItem value="Break" sx={{ color: "#ff9800" }}>Break</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Work Location</InputLabel>
                        <Select
                          name="workLocation"
                          value={formData.workLocation}
                          onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
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
                          onClick={handleAddAttendance}
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
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={!!error || success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || "Attendance submitted successfully!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default AttendanceReport;
