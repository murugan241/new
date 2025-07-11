import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
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

const ExpenseReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [indexOfLastItem, setIndexOfLastItem] = useState(5);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const itemsPerPage = 5;
  const [currentItems, setCurrentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    item: "",
    purchaseFrom: "",
    purchaseDate: "",
    purchasedBy: "",
    amount: "",
    paidBy: "",
    status: "Pending",
  });

  const [filters, setFilters] = useState({
    item: "",
    purchasedBy: "",
    status: "",
  });

  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const ili = currentPage * itemsPerPage;
    const ifi = ili - itemsPerPage;
    setIndexOfLastItem(ili);
    setIndexOfFirstItem(ifi);
    const c = filteredExpenses.slice(ifi, ili);
    setCurrentItems(c);
  }, [currentPage, filteredExpenses]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Fetching from:', `${API_URL}/api/expense-reports`); // Debug log
      
      const response = await fetch(`${API_URL}/api/expense-reports`);
      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`Failed to fetch expense reports: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log
      
      // Check different possible response structures
      let expenseData = [];
      if (data.expenseReports) {
        expenseData = data.expenseReports;
      } else if (data.expenses) {
        expenseData = data.expenses;
      } else if (Array.isArray(data)) {
        expenseData = data;
      } else if (data.data) {
        expenseData = data.data;
      }
      
      console.log('Processed expense data:', expenseData); // Debug log
      
      setExpenses(expenseData);
      setFilteredExpenses(expenseData);
    } catch (error) {
      console.error("Error fetching expense reports:", error);
      setError(`Failed to load expense reports: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    const newDirection = sortConfig.key === column && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column, direction: newDirection });

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      if (typeof a[column] === "string") {
        return newDirection === "asc"
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
      return newDirection === "asc" ? a[column] - b[column] : b[column] - a[column];
    });

    setFilteredExpenses(sortedExpenses);
  };

  const handleSearch = () => {
    const filtered = expenses.filter((expense) => {
      return (
        (filters.item ? expense.item.toLowerCase().includes(filters.item.toLowerCase()) : true) &&
        (filters.purchasedBy ? expense.purchasedBy.toLowerCase().includes(filters.purchasedBy.toLowerCase()) : true) &&
        (filters.status ? expense.status === filters.status : true)
      );
    });
    setFilteredExpenses(filtered);
    setCurrentPage(1);
  };

  const handleView = (expense) => {
    alert(`Viewing expense: ${expense.item}`);
    handleMenuClose();
  };

  const handleDelete = async (expenseId) => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/expense-reports/${expenseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      const updatedExpenses = expenses.filter(expense => expense._id !== expenseId);
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      setSuccess(true);
    } catch (error) {
      setError("Failed to delete expense. Please try again.");
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleMenuOpen = (event, expense) => {
    setAnchorEl(event.currentTarget);
    setSelectedExpense(expense);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedExpense(null);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({
      item: "",
      purchaseFrom: "",
      purchaseDate: "",
      purchasedBy: "",
      amount: "",
      paidBy: "",
      status: "Pending",
    });
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const validateForm = () => {
    if (!formData.item.trim()) {
      setError("Item is required.");
      return false;
    }
    if (!formData.purchasedBy) {
      setError("Purchased By is required.");
      return false;
    }
    if (!formData.amount) {
      setError("Amount is required.");
      return false;
    }
    if (!formData.purchaseDate) {
      setError("Purchase Date is required.");
      return false;
    }
    return true;
  };

  const addExpenseToDatabase = async (expenseData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/expense-reports/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expense report");
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const handleAddExpense = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await addExpenseToDatabase(formData);
      console.log("Expense saved:", result);

      const updatedExpenses = [...expenses, result];
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      setSuccess(true);
      handleModalClose();
    } catch (error) {
      console.error("Error saving expense:", error);
      setError(error.message || "Failed to save expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const uniquePurchasedBy = [...new Set(expenses.map(expense => expense.purchasedBy))];

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

  // Debug information
  console.log('Current state:', {
    expenses: expenses.length,
    filteredExpenses: filteredExpenses.length,
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
            <h2>Expense Report</h2>
            <p>Reporting / Expense Report</p>

            {/* Debug information */}
            <Box sx={{ p: 1, mb: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="caption">
                Debug: Total expenses: {expenses.length}, Filtered: {filteredExpenses.length}, Current items: {currentItems.length}
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
                  <TextField
                    label="Search Item"
                    name="item"
                    value={filters.item}
                    onChange={handleFilterChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "#fff", height: "35px" }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel>Purchased By</InputLabel>
                    <Select
                      name="purchasedBy"
                      value={filters.purchasedBy}
                      onChange={handleFilterChange}
                      sx={{ backgroundColor: "#fff", height: "35px" }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {uniquePurchasedBy.map((person) => (
                        <MenuItem key={person} value={person}>
                          {person}
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
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
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
            ) : filteredExpenses.length === 0 ? (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="h6" color="textSecondary">
                  No expense records found
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell onClick={() => handleSort("item")} style={{ cursor: "pointer" }}>
                        Item {sortConfig.key === "item" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("purchaseFrom")} style={{ cursor: "pointer" }}>
                        Purchase From {sortConfig.key === "purchaseFrom" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("purchaseDate")} style={{ cursor: "pointer" }}>
                        Purchase Date {sortConfig.key === "purchaseDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("purchasedBy")} style={{ cursor: "pointer" }}>
                        Purchased By {sortConfig.key === "purchasedBy" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("amount")} style={{ cursor: "pointer" }}>
                        Amount {sortConfig.key === "amount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("paidBy")} style={{ cursor: "pointer" }}>
                        Paid By {sortConfig.key === "paidBy" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                        Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((expense, index) => (
                      <TableRow key={expense._id || index} sx={{ backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7" }}>
                        <TableCell>{expense.item}</TableCell>
                        <TableCell>{expense.purchaseFrom}</TableCell>
                        <TableCell>{new Date(expense.purchaseDate).toLocaleDateString()}</TableCell>
                        <TableCell>{expense.purchasedBy}</TableCell>
                        <TableCell>₹{expense.amount}</TableCell>
                        <TableCell>{expense.paidBy}</TableCell>
                        <TableCell>
                          <Box sx={{
                            color: expense.status === "Pending" ? "orange" :
                              expense.status === "Approved" ? "green" : "red",
                            fontWeight: "bold"
                          }}>
                            {expense.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleMenuOpen(event, expense)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Move Menu outside of map function */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => selectedExpense && handleView(selectedExpense)}>View</MenuItem>
              <MenuItem onClick={() => selectedExpense && handleDelete(selectedExpense._id)}>Delete</MenuItem>
            </Menu>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredExpenses.length)} of {filteredExpenses.length} entries
              </Typography>
              <Pagination
                count={Math.ceil(filteredExpenses.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>

            <Modal open={modalOpen} onClose={handleModalClose}>
              <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Add Expense</Typography>
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
                        label="Item"
                        name="item"
                        value={formData.item}
                        onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Purchase From"
                        name="purchaseFrom"
                        value={formData.purchaseFrom}
                        onChange={(e) => setFormData({ ...formData, purchaseFrom: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Purchase Date"
                        name="purchaseDate"
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Purchased By"
                        name="purchasedBy"
                        value={formData.purchasedBy}
                        onChange={(e) => setFormData({ ...formData, purchasedBy: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Paid By</InputLabel>
                        <Select
                          name="paidBy"
                          value={formData.paidBy}
                          onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                        >
                          <MenuItem value="Cash">Cash</MenuItem>
                          <MenuItem value="Cheque">Cheque</MenuItem>
                          <MenuItem value="Credit Card">Credit Card</MenuItem>
                          <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        </Select>
                      </FormControl>
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
                              color: formData.status === "Pending" ? "orange" :
                                    formData.status === "Approved" ? "green" : "red",
                              fontWeight: "bold"
                            }
                          }}
                        >
                          <MenuItem value="Pending" sx={{ color: "orange" }}>Pending</MenuItem>
                          <MenuItem value="Approved" sx={{ color: "green" }}>Approved</MenuItem>
                          <MenuItem value="Rejected" sx={{ color: "red" }}>Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }}
                          onClick={handleAddExpense}
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
          {error || "Expense report submitted successfully!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ExpenseReport;