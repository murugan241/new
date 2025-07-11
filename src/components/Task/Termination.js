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

const Termination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTermination, setSelectedTermination] = useState(null);
  const [indexOfLastItem, setIndexOfLastItem] = useState(2);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const itemsPerPage = 2;
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Start with empty array
  const [terminations, setTerminations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    employeeName: "",
    department: "",
    noticeDate: "",
    terminatedDate: "",
    reason: "",
  });

  const [filters, setFilters] = useState({
    employeeName: "",
    department: "",
    reason: "",
  });

  const [filteredTerminations, setFilteredTerminations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Fetch terminations from backend on component mount
  useEffect(() => {
    fetchTerminations();
  }, []);

  // Update current items when page or filtered data changes
  useEffect(() => {
    let ili = currentPage * itemsPerPage;
    let ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    let c = filteredTerminations.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredTerminations]);

  // Fetch terminations from backend
  const fetchTerminations = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Fetching terminations from:', `${API_URL}/api/terminations`);
      
      const response = await fetch(`${API_URL}/api/terminations`);
      console.log('Terminations response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch terminations: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Terminations data received:', data);
      
      // Handle different response structures
      let terminationData = [];
      if (data.terminations) {
        terminationData = data.terminations;
      } else if (Array.isArray(data)) {
        terminationData = data;
      } else if (data.data) {
        terminationData = data.data;
      }
      
      console.log('Processed termination data:', terminationData);
      setTerminations(terminationData);
      setFilteredTerminations(terminationData);
    } catch (error) {
      console.error("Error fetching terminations:", error);
      setError(`Failed to load terminations: ${error.message}`);
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

    const sortedTerminations = [...filteredTerminations].sort((a, b) => {
      if (typeof a[column] === "string") {
        return newDirection === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
    });

    setFilteredTerminations(sortedTerminations);
  };

  const handleSearch = () => {
    const filtered = terminations.filter((termination) => {
      return (
        (filters.employeeName ? termination.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase()) : true) &&
        (filters.department ? termination.department.toLowerCase().includes(filters.department.toLowerCase()) : true) &&
        (filters.reason ? termination.reason.toLowerCase().includes(filters.reason.toLowerCase()) : true)
      );
    });
    setFilteredTerminations(filtered);
    setCurrentPage(1);
  };

  const handleView = () => {
    alert(`Viewing termination: ${selectedTermination.employeeName} - ${selectedTermination.reason}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete termination for: ${selectedTermination.employeeName}?`)) {
      try {
        setLoading(true);
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const endpoint = `${API_URL}/api/terminations/delete/${selectedTermination._id}`;

        const response = await fetch(endpoint, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete termination");
        }

        // Remove from local state
        const updatedTerminations = terminations.filter(termination => termination._id !== selectedTermination._id);
        setTerminations(updatedTerminations);
        setFilteredTerminations(updatedTerminations);
        setSuccess(true);
      } catch (error) {
        setError(error.message || "Failed to delete termination. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    handleMenuClose();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleMenuOpen = (event, termination) => {
    setAnchorEl(event.currentTarget);
    setSelectedTermination(termination);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTermination(null);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({
      employeeName: "",
      department: "",
      noticeDate: "",
      terminatedDate: "",
      reason: "",
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
    if (!formData.department) {
      setError("Department is required.");
      return false;
    }
    if (!formData.noticeDate) {
      setError("Notice Date is required.");
      return false;
    }
    if (!formData.terminatedDate) {
      setError("Terminated Date is required.");
      return false;
    }
    if (!formData.reason.trim()) {
      setError("Reason is required.");
      return false;
    }
    if (formData.noticeDate && formData.terminatedDate && 
        new Date(formData.noticeDate) > new Date(formData.terminatedDate)) {
      setError("Terminated date must be after notice date.");
      return false;
    }
    return true;
  };

  const submitTerminationToDatabase = async (terminationData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/terminations/add`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(terminationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit termination");
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting termination:', error);
      throw error;
    }
  };

  const handleAddTermination = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const terminationData = {
        employeeName: formData.employeeName,
        department: formData.department,
        noticeDate: formData.noticeDate,
        terminatedDate: formData.terminatedDate,
        reason: formData.reason,
      };

      const result = await submitTerminationToDatabase(terminationData);
      console.log("Termination submitted:", result);

      // Refresh data from backend
      fetchTerminations();
      setSuccess(true);
      handleModalClose();
    } catch (error) {
      setError(error.message || "Failed to submit termination. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Get unique values for filter dropdowns
  const uniqueEmployeeNames = [...new Set(terminations.map(termination => termination.employeeName))];
  const uniqueDepartments = [...new Set(terminations.map(termination => termination.department))];
  const uniqueReasons = [...new Set(terminations.map(termination => termination.reason))];

  // Debug information
  console.log('Current state:', {
    terminations: terminations.length,
    filteredTerminations: filteredTerminations.length,
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
            <h2>Termination</h2>
            <p>Configuration / Termination</p>

            {/* Debug information */}
            <Box sx={{ p: 1, mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption">
                Debug: Total terminations: {terminations.length}, Filtered: {filteredTerminations.length}, Current items: {currentItems.length}
              </Typography>
            </Box>

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
                    <InputLabel>Reason</InputLabel>
                    <Select
                      name="reason"
                      value={filters.reason}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueReasons.map((reason) => (
                        <MenuItem key={reason} value={reason}>
                          {reason}
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
            ) : filteredTerminations.length === 0 ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="h6" color="textSecondary">
                  No termination records found
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
                        Employee Name{" "}
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
                        onClick={() => handleSort("noticeDate")}
                        style={{ cursor: "pointer" }}
                      >
                        Notice Date{" "}
                        {sortConfig.key === "noticeDate" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("terminatedDate")}
                        style={{ cursor: "pointer" }}
                      >
                        Terminated Date{" "}
                        {sortConfig.key === "terminatedDate" &&
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
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((termination, index) => (
                      <TableRow key={termination._id || index} sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#E9E9EA" }}>
                        <TableCell>{termination.employeeName}</TableCell>
                        <TableCell>{termination.department}</TableCell>
                        <TableCell>
                          {termination.noticeDate ? new Date(termination.noticeDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {termination.terminatedDate ? new Date(termination.terminatedDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>{termination.reason}</TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleMenuOpen(event, termination)}>
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTerminations.length)} of {filteredTerminations.length} entries
              </Typography>
              <Pagination
                count={Math.ceil(filteredTerminations.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>

            <Modal open={modalOpen} onClose={handleModalClose}>
              <Box sx={modalStyle}>
                <DialogTitle>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Add Termination</Typography>
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
                        label="Notice Date"
                        name="noticeDate"
                        type="date"
                        value={formData.noticeDate}
                        onChange={(e) => setFormData({ ...formData, noticeDate: e.target.value })}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Terminated Date"
                        name="terminatedDate"
                        type="date"
                        value={formData.terminatedDate}
                        onChange={(e) => setFormData({ ...formData, terminatedDate: e.target.value })}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Reason"
                        name="reason"
                        multiline
                        rows={4}
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
                          onClick={handleAddTermination}
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
          {error || "Termination operation completed successfully!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Termination;