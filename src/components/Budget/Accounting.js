import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BudgetExpenses from "./BudgetExpenses";
import BudgetRevenue from "./BudgetRevenue";
import Sidebar from "../Common_Bar/Sidebar";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";

const Accounting = () => {
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [budgetData, setBudgetData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [formData, setFormData] = useState({
    budgetTitle: "",
    budgetType: "",
    startDate: "",
    endDate: "",
    rate: "",
    priority: "",
    revenueTitle: "",
    revenueAmount: "",
    overallRevenues: "",
    expenseTitle: "",
    expenseAmount: "",
    overallExpenses: "",
    expectedProfit: "",
    tax: "",
    budgetAmount: "",
  });
  const [activeComponent, setActiveComponent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/budgets");
      if (response.ok) {
        const data = await response.json();
        setBudgetData(data.budgets || []);
      } else {
        console.error("Failed to fetch budget data");
      }
    } catch (error) {
      console.error("Error fetching budget data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleOpenPopup = () => setOpenPopup(true);

  const handleClosePopup = () => {
    setOpenPopup(false);
    setFormData({
      budgetTitle: "",
      budgetType: "",
      startDate: "",
      endDate: "",
      rate: "",
      priority: "",
      revenueTitle: "",
      revenueAmount: "",
      overallRevenues: "",
      expenseTitle: "",
      expenseAmount: "",
      overallExpenses: "",
      expectedProfit: "",
      tax: "",
      budgetAmount: "",
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.budgetTitle.trim()) {
      setError("Budget Title is required");
      return false;
    }
    if (!formData.budgetType.trim()) {
      setError("Budget Type is required");
      return false;
    }
    if (!formData.startDate) {
      setError("Start Date is required");
      return false;
    }
    if (!formData.endDate) {
      setError("End Date is required");
      return false;
    }
    if (formData.startDate > formData.endDate) {
      setError("End Date must be after Start Date");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/budgets/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newBudget = await response.json();
        setBudgetData([...budgetData, newBudget]);
        setSuccess(true);
        handleClosePopup();
        fetchBudgets();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save budget");
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      setError("An error occurred while saving the budget");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError("");
  };

  const handleBudgetRevenue = () => {
    setActiveComponent("budgetrevenue");
  };

  const handleBudgetExpenses = () => {
    setActiveComponent("budgetexpenses");
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <Grid container sx={{ height: "calc(100vh - 160px)" }}>
        <Grid item xs={12} sm={3} md={2} sx={{ height: "100%" }}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} sm={9} md={10} sx={{ height: "100%", overflowY: "auto", padding: "70px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Accounting
              </Typography>
              <Typography>Admin / Accounting / Budgets</Typography>
            </Box>
            <Grid container spacing={2} justifyContent="flex-start">
              <Grid item xs={12} sm={4} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    setShowCreateBudget(true);
                    setActiveComponent("budget");
                  }}
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                  }}
                >
                  Budgets
                </Button>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor:
                      activeComponent === "budgetrevenue" ? "#004E69" : "white",
                    color:
                      activeComponent === "budgetrevenue" ? "white" : "black",
                  }}
                  onClick={handleBudgetRevenue}
                >
                  Budgets Revenues
                </Button>
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor:
                      activeComponent === "budgetexpenses" ? "#004E69" : "white",
                    color:
                      activeComponent === "budgetexpenses" ? "white" : "black",
                  }}
                  onClick={handleBudgetExpenses}
                >
                  Budgets Expenses
                </Button>
              </Grid>
            </Grid>

            {showCreateBudget && activeComponent === "budget" && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>
                    }
                    onClick={handleOpenPopup}
                    sx={{
                      backgroundColor: "#FF902F",
                      borderRadius: "50px",
                      "&:hover": {
                        backgroundColor: "#FF902F",
                      },
                      color: "white",
                    }}
                  >
                    Add Budgets
                  </Button>
                </Box>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Budget Title</TableCell>
                        <TableCell>Budget Type</TableCell>
                        <TableCell>Total Revenue</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Total Expenses</TableCell>
                        <TableCell>Tax Amount</TableCell>
                        <TableCell>Budget Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {budgetData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell>{data.budgetTitle}</TableCell>
                          <TableCell>{data.budgetType}</TableCell>
                          <TableCell>{data.overallRevenues}</TableCell>
                          <TableCell>{data.startDate}</TableCell>
                          <TableCell>{data.endDate}</TableCell>
                          <TableCell>{data.overallExpenses}</TableCell>
                          <TableCell>{data.tax}</TableCell>
                          <TableCell>{data.budgetAmount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            <Dialog
              open={openPopup}
              onClose={handleClosePopup}
              fullWidth
              maxWidth="md"
            >
              <DialogTitle>Add Budget</DialogTitle>
              <DialogContent>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <TextField
                    name="budgetTitle"
                    label="Budget Title"
                    fullWidth
                    value={formData.budgetTitle}
                    onChange={handleInputChange}
                    error={!formData.budgetTitle.trim() && error}
                  />
                  <TextField
                    name="budgetType"
                    label="Budget Type"
                    fullWidth
                    value={formData.budgetType}
                    onChange={handleInputChange}
                    error={!formData.budgetType.trim() && error}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        fullWidth
                        value={formData.startDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        error={!formData.startDate && error}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="endDate"
                        label="End Date"
                        type="date"
                        fullWidth
                        value={formData.endDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        error={!formData.endDate && error}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="rate"
                        label="Rate"
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
                        >
                          {priorityOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Typography variant="h6">Expected Revenues</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="revenueTitle"
                        label="Revenue Title"
                        fullWidth
                        value={formData.revenueTitle}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="revenueAmount"
                        label="Revenue Amount"
                        fullWidth
                        value={formData.revenueAmount}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    name="overallRevenues"
                    label="Overall Revenues"
                    fullWidth
                    value={formData.overallRevenues}
                    onChange={handleInputChange}
                  />
                  <Typography variant="h6">Expected Expenses</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="expenseTitle"
                        label="Expenses Title"
                        fullWidth
                        value={formData.expenseTitle}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="expenseAmount"
                        label="Expenses Amount"
                        fullWidth
                        value={formData.expenseAmount}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    name="overallExpenses"
                    label="Overall Expenses"
                    fullWidth
                    value={formData.overallExpenses}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="expectedProfit"
                    label="Expected Profit"
                    fullWidth
                    value={formData.expectedProfit}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="tax"
                    label="Tax"
                    fullWidth
                    value={formData.tax}
                    onChange={handleInputChange}
                  />
                  <TextField
                    name="budgetAmount"
                    label="Budget Amount"
                    fullWidth
                    value={formData.budgetAmount}
                    onChange={handleInputChange}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClosePopup} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSave} color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Save"}
                </Button>
              </DialogActions>
            </Dialog>
            {activeComponent === "budgetrevenue" && <BudgetRevenue />}
            {activeComponent === "budgetexpenses" && <BudgetExpenses />}
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Snackbar
        open={!!error || success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={success ? "Budget added successfully!" : error}
      />
    </Grid>
  );
};

export default Accounting;
