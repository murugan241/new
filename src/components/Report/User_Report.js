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

const UserReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [indexOfLastItem, setIndexOfLastItem] = useState(5);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const itemsPerPage = 5;
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    companyName: "",
    email: "",
    role: "",
    status: "active",
    assignTo: "",
  });

  const [filters, setFilters] = useState({
    username: "",
    role: "",
    status: "",
  });

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Fetch users from backend on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update current items when page or filtered data changes
  useEffect(() => {
    const ili = currentPage * itemsPerPage;
    const ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    const c = filteredUsers.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredUsers]);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Fetching from:', `${API_URL}/api/user-reports`); // Debug log
      
      const response = await fetch(`${API_URL}/api/user-reports`);
      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`Failed to fetch user reports: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log
      
      // Check different possible response structures
      let userData = [];
      if (data.users) {
        userData = data.users;
      } else if (data.userReports) {
        userData = data.userReports;
      } else if (Array.isArray(data)) {
        userData = data;
      } else if (data.data) {
        userData = data.data;
      }
      
      console.log('Processed user data:', userData); // Debug log
      
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error("Error fetching user reports:", error);
      setError(`Failed to load user reports: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add user to database
  const addUserToDatabase = async (userData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/user-reports/add`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  // Update user in database
  const updateUserInDatabase = async (userId, userData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/user-reports/update/${userId}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Delete user from database
  const deleteUserFromDatabase = async (userId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/user-reports/delete/${userId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
    setEditMode(false);
    setEditingUserId(null);
    setError("");
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditingUserId(null);
    setFormData({
      username: "",
      companyName: "",
      email: "",
      role: "",
      status: "active",
      assignTo: "",
    });
    setError("");
  };

  const handleSort = (column) => {
    const newDirection = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction: newDirection });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (typeof a[column] === "string") {
        return newDirection === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
    });

    setFilteredUsers(sortedUsers);
  };

  const handleSearch = () => {
    const filtered = users.filter((user) => {
      return (
        (filters.username ? user.username.toLowerCase().includes(filters.username.toLowerCase()) : true) &&
        (filters.role ? user.role.toLowerCase().includes(filters.role.toLowerCase()) : true) &&
        (filters.status ? user.status === filters.status : true)
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleView = (user) => {
    alert(`Viewing user: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}`);
    handleMenuClose();
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      companyName: user.companyName,
      email: user.email,
      role: user.role,
      status: user.status,
      assignTo: user.assignTo || "",
    });
    setEditMode(true);
    setEditingUserId(user._id);
    setModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user: ${user.username}?`)) {
      try {
        setLoading(true);
        await deleteUserFromDatabase(user._id);

        // Update local state
        const updatedUsers = users.filter(u => u._id !== user._id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setSuccess(true);
      } catch (error) {
        setError(error.message || "Failed to delete user. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    handleMenuClose();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.username.trim()) {
      errors.push("Username is required.");
    }
    if (!formData.companyName) {
      errors.push("Company Name is required.");
    }
    if (!formData.email) {
      errors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address.");
    }
    if (!formData.role) {
      errors.push("Role is required.");
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
      return false;
    }
    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (editMode) {
        // Update existing user
        const result = await updateUserInDatabase(editingUserId, formData);
        console.log("User updated:", result);

        // Update local state
        const updatedUsers = users.map(user =>
          user._id === editingUserId ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        // Add new user
        const result = await addUserToDatabase(formData);
        console.log("User saved:", result);

        // Update local state
        const updatedUsers = [...users, result];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      }

      setSuccess(true);
      handleModalClose();

      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      setError(error.message || "Failed to save user. Please try again.");
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

    if (error && (name === 'username' || name === 'companyName' || name === 'email' || name === 'role')) {
      setError("");
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

  // Get unique roles for filter dropdown
  const uniqueRoles = [...new Set(users.map(user => user.role))];

  // Debug information
  console.log('Current state:', {
    users: users.length,
    filteredUsers: filteredUsers.length,
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
            <h2>User Report</h2>
            <p>Reporting / User Report</p>

            {/* Debug information */}
            <Box sx={{ p: 1, mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption">
                Debug: Total users: {users.length}, Filtered: {filteredUsers.length}, Current items: {currentItems.length}
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <TextField
                    label="Search Username"
                    name="username"
                    value={filters.username}
                    onChange={handleFilterChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "#fff", height: "35px" }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={filters.role}
                      onChange={handleFilterChange}
                      sx={{ backgroundColor: "#fff", height: "35px" }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniqueRoles.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
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
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
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
            ) : filteredUsers.length === 0 ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="h6" color="textSecondary">
                  No user records found
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell onClick={() => handleSort("username")} style={{ cursor: "pointer" }}>
                        Username {sortConfig.key === "username" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("companyName")} style={{ cursor: "pointer" }}>
                        Company Name {sortConfig.key === "companyName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                        Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
                        Role {sortConfig.key === "role" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                        Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell>Assign To</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((user, index) => (
                      <TableRow key={user._id || index} sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7" }}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.companyName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Box sx={{ color: user.status === "active" ? "green" : user.status === "inactive" ? "red" : "orange", fontWeight: "bold" }}>
                            {user.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {user.assignTo}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleMenuOpen(event, user)}>
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
              <MenuItem onClick={() => selectedUser && handleView(selectedUser)}>View</MenuItem>
              <MenuItem onClick={() => selectedUser && handleEdit(selectedUser)}>Edit</MenuItem>
              <MenuItem onClick={() => selectedUser && handleDelete(selectedUser)}>Delete</MenuItem>
            </Menu>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
              </Typography>
              <Pagination
                count={Math.ceil(filteredUsers.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>

            <Modal open={modalOpen} onClose={handleModalClose}>
              <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{editMode ? 'Edit User' : 'Add User'}</Typography>
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
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                          <MenuItem value="Project Manager">Project Manager</MenuItem>
                          <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
                          <MenuItem value="Data Analyst">Data Analyst</MenuItem>
                          <MenuItem value="Machine Learning Engineer">Machine Learning Engineer</MenuItem>
                        </Select>
                      </FormControl>
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
                              color: formData.status === "active" ? "green" : formData.status === "inactive" ? "red" : "orange",
                              fontWeight: "bold"
                            }
                          }}
                        >
                          <MenuItem value="active" sx={{ color: "green" }}>Active</MenuItem>
                          <MenuItem value="inactive" sx={{ color: "red" }}>Inactive</MenuItem>
                          <MenuItem value="pending" sx={{ color: "orange" }}>Pending</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Assign To"
                        name="assignTo"
                        value={formData.assignTo}
                        onChange={handleInputChange}
                        placeholder="Enter assignment details"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }}
                          onClick={handleAddUser}
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
          {error || (editMode ? "User updated successfully!" : "User added successfully!")}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default UserReport;