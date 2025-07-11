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

const BudgetRevenue = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [budgetData, setBudgetData] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    notes: "",
    revenueDate: "",
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
    fetchBudgetRevenues();
  }, []);

  const fetchBudgetRevenues = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/budget-revenues");
      if (response.ok) {
        const data = await response.json();
        setBudgetData(data.budgetRevenues || []);
      } else {
        console.error("Failed to fetch budget revenue data");
      }
    } catch (error) {
      console.error("Error fetching budget revenue data:", error);
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
      notes: "",
      revenueDate: "",
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
    if (!formData.revenueDate) {
      setError("Revenue Date is required");
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
      data.append("notes", formData.notes);
      data.append("revenueDate", formData.revenueDate);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      if (formData.file) {
        data.append("file", formData.file);
      }

      const response = await fetch("http://localhost:5000/api/budget-revenues/add", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const newBudgetRevenue = await response.json();
        setBudgetData((prevData) => [...prevData, newBudgetRevenue]);
        setSuccess(true);
        handleClosePopup();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save budget revenue");
      }
    } catch (error) {
      console.error("Error saving budget revenue:", error);
      setError("An error occurred while saving the budget revenue");
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
          Add Budget Revenue
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Notes</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Revenue Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.notes}</TableCell>
                <TableCell>{data.category}</TableCell>
                <TableCell>{data.amount}</TableCell>
                <TableCell>{data.revenueDate}</TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    onClick={() =>
                      setBudgetData(budgetData.filter((_, i) => i !== index))
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
            Add Budget Revenue
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
                  Notes
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Revenue Date
                </Typography>
                <TextField
                  fullWidth
                  name="revenueDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.revenueDate || ""}
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
        message={success ? "Budget revenue added successfully!" : error}
      />
    </LocalizationProvider>
  );
};

export default BudgetRevenue;
