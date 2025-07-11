import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  InputBase,
  Alert,
  CircularProgress,
} from "@mui/material";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";
import SettingsIcon from "@mui/icons-material/Settings";

const AdminAddDepartment = () => {
  const [formData, setFormData] = useState({
    departmentName: "",
    manager: "",
    parentDepartment: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success"
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear alert when user starts typing
    if (alert.show) {
      setAlert({ ...alert, show: false });
    }
  };

  const showAlert = (message, severity = "success") => {
    setAlert({
      show: true,
      message,
      severity
    });
    // Auto hide after 5 seconds
    setTimeout(() => {
      setAlert({ ...alert, show: false });
    }, 5000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Basic validation
    if (!formData.departmentName.trim()) {
      showAlert("Department name is required", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/departments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showAlert("Department added successfully!", "success");
        // Reset form
        setFormData({
          departmentName: "",
          manager: "",
          parentDepartment: "",
        });
      } else {
        showAlert(data.message || "Failed to add department", "error");
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      departmentName: "",
      manager: "",
      parentDepartment: "",
    });
    setAlert({ ...alert, show: false });
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12}>
        {/* NavBar */}
        <Navbar />

        {/* TopBar */}
        <Box
          display="flex"
          alignItems="center"
          px={2}
          mt={0.5}
          sx={{ height: "80px", backgroundColor: "#FFF7F7" }}
        >
          <Box sx={{ display: "flex", mx: 5 }}>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "20px",
                color: "#000000",
              }}
            >
              Department
            </Typography>
            <IconButton sx={{ mt: -1 }}>
              <SettingsIcon />
            </IconButton>
          </Box>
          <TextField
            size="small"
            placeholder="Enter search word"
            sx={{
              flexGrow: 1,
              maxWidth: "300px",
              backgroundColor: "#f9f9f9",
              borderRadius: "1px",
            }}
          />
        </Box>

        <Grid container>
          {/* SideBar */}
          <Grid item xs={12} sm={3} md={2}>
            <Sidebar />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} sm={9} md={10} style={{ padding: "70px" }}>
            
            {/* Alert */}
            {alert.show && (
              <Alert 
                severity={alert.severity} 
                sx={{ marginBottom: "20px", maxWidth: "800px" }}
                onClose={() => setAlert({ ...alert, show: false })}
              >
                {alert.message}
              </Alert>
            )}

            {/* Form */}
            <Box
              component="form"
              style={{ maxWidth: "800px" }}
              onSubmit={handleSubmit}
            >
              {/* Department Name */}
              <Box sx={{ marginBottom: "20px" }}>
                <Typography variant="subtitle1" sx={{ marginBottom: "5px" }}>
                  Department Name *
                </Typography>
                <InputBase
                  value={formData.departmentName}
                  onChange={handleChange("departmentName")}
                  placeholder="Enter department name"
                  required
                  sx={{
                    width: "300px",
                    height: "50px",
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                />
              </Box>

              {/* Manager and Parent Department */}
              <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ marginBottom: "5px" }}>
                    Manager
                  </Typography>
                  <InputBase
                    value={formData.manager}
                    onChange={handleChange("manager")}
                    placeholder="Enter manager name"
                    sx={{
                      width: "300px",
                      height: "50px",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      padding: "10px",
                      border: "1px solid #ccc",
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ marginBottom: "5px" }}>
                    Parent Department
                  </Typography>
                  <InputBase
                    value={formData.parentDepartment}
                    onChange={handleChange("parentDepartment")}
                    placeholder="Enter parent department"
                    sx={{
                      width: "300px",
                      height: "50px",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                      padding: "10px",
                      border: "1px solid #ccc",
                    }}
                  />
                </Box>
              </Box>

              {/* Buttons */}
              <Box style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    width: "130px",
                    backgroundColor: "#004E69",
                    borderRadius: "10px",
                    color: "#fff",
                    height: "46px",
                    textTransform: "none",
                    position: "relative",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Save & Close"
                  )}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{
                    width: "130px",
                    backgroundColor: "#004E69",
                    borderRadius: "10px",
                    color: "#fff",
                    height: "46px",
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminAddDepartment;