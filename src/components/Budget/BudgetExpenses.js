import React, { useState, useEffect, useRef } from "react";
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
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const BudgetExpense = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    expenseDate: "",
    category: "",
    subCategory: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const categoryOptions = [
    { value: "Category 1", label: "Category 1" },
    { value: "Category 2", label: "Category 2" },
    { value: "Category 3", label: "Category 3" },
  ];

  const subCategoryOptions = [
    { value: "SubCategory 1", label: "SubCategory 1" },
    { value: "SubCategory 2", label: "SubCategory 2" },
    { value: "SubCategory 3", label: "SubCategory 3" },
  ];

  useEffect(() => {
    fetchBudgetExpenses();
  }, []);

  const fetchBudgetExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/budget-expenses");
      if (response.ok) {
        const data = await response.json();
        setExpenseData(data.budgetExpenses || []);
      } else {
        console.error("Failed to fetch budget expense data");
      }
    } catch (error) {
      console.error("Error fetching budget expense data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleOpenPopup = () => setOpenPopup(true);

  const handleClosePopup = () => {
    setOpenPopup(false);
    setFormData({
      amount: "",
      description: "",
      expenseDate: "",
      category: "",
      subCategory: "",
      file: null,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.amount) {
      setError("Amount is required");
      return false;
    }
    if (!formData.expenseDate) {
      setError("Expense Date is required");
      return false;
    }
    if (!formData.category) {
      setError("Category is required");
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
      const data = new FormData();
      data.append("amount", formData.amount);
      data.append("description", formData.description);
      data.append("expenseDate", formData.expenseDate);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      if (formData.file) {
        data.append("file", formData.file);
      }

      const response = await fetch("http://localhost:5000/api/budget-expenses/add", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const newBudgetExpense = await response.json();
        setExpenseData((prevData) => [...prevData, newBudgetExpense]);
        setSuccess(true);
        handleClosePopup();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save budget expense");
      }
    } catch (error) {
      console.error("Error saving budget expense:", error);
      setError("An error occurred while saving the budget expense");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError("");
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          startIcon={<span style={{ fontSize: "18px", fontWeight: "bold" }}>+</span>}
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
          Add Budget Expense
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Expense Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenseData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.description}</TableCell>
                <TableCell>{data.category}</TableCell>
                <TableCell>{data.amount}</TableCell>
                <TableCell>{data.expenseDate}</TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    onClick={() =>
                      setExpenseData(expenseData.filter((_, i) => i !== index))
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openPopup} onClose={handleClosePopup} fullWidth maxWidth="md">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Add Budget Expense
            <IconButton onClick={handleClosePopup}>
              <CloseIcon color="error" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Amount
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="amount"
                  type="number"
                  value={formData.amount || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Expense Date
                </Typography>
                <TextField
                  fullWidth
                  name="expenseDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.expenseDate || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Category
                </Typography>
                <FormControl fullWidth>
                  <Select
                    name="category"
                    value={formData.category || ""}
                    onChange={handleInputChange}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Sub-Category
                </Typography>
                <FormControl fullWidth>
                  <Select
                    name="subCategory"
                    value={formData.subCategory || ""}
                    onChange={handleInputChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select a Sub-Category
                    </MenuItem>
                    {subCategoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Attach File
                </Typography>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
                <Button
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  onClick={handleFileUpload}
                >
                  Upload File
                </Button>
                {formData.file && (
                  <Typography variant="body2" color="textSecondary">
                    Selected file: {formData.file.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Cancel</Button>
          <Button onClick={handleSave} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!error || success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={success ? "Budget expense added successfully!" : error}
      />
    </LocalizationProvider>
  );
};

export default BudgetExpense;
