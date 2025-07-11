import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";

const Apraisal = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [values, setValues] = useState({
    employeeName: "",
    status: "Active",
    technicalCompetencies: [
      { indicator: "Marketing", expectedValue: "Advanced", setValue: "None" },
      { indicator: "Management", expectedValue: "Advanced", setValue: "Beginner" },
      { indicator: "Administration", expectedValue: "Advanced", setValue: "Intermediate" },
      { indicator: "Presentation Skill", expectedValue: "Expert / Leader", setValue: "Advanced" },
      { indicator: "Quality Of Work", expectedValue: "Expert / Leader", setValue: "Expert / Leader" },
      { indicator: "Efficiency", expectedValue: "Expert / Leader", setValue: "Expert / Leader" },
    ],
    organizationalCompetencies: [
      { indicator: "Communication", expectedValue: "Advanced", setValue: "None" },
      { indicator: "Leadership", expectedValue: "Expert / Leader", setValue: "Beginner" },
      { indicator: "Adaptability", expectedValue: "Advanced", setValue: "Intermediate" },
    ],
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSetValueChange = (index, newValue, isTechnical) => {
    const updatedCompetencies = isTechnical
      ? [...values.technicalCompetencies]
      : [...values.organizationalCompetencies];
    const key = isTechnical ? "technicalCompetencies" : "organizationalCompetencies";
    updatedCompetencies[index].setValue = newValue;
    setValues((prev) => ({ ...prev, [key]: updatedCompetencies }));
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccess(false);
  };

  const validateForm = () => {
    if (!values.employeeName.trim()) {
      setError("Employee Name is required.");
      return false;
    }
    if (!date) {
      setError("Date is required.");
      return false;
    }
    return true;
  };

  const submitApraisalToDatabase = async (formData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/appraisals/add`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit appraisal");
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting appraisal:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const appraisalData = {
        employeeName: values.employeeName,
        date: date,
        status: values.status,
        technicalCompetencies: values.technicalCompetencies,
        organizationalCompetencies: values.organizationalCompetencies,
      };

      const result = await submitApraisalToDatabase(appraisalData);
      console.log("Appraisal submitted:", result);
      setSuccess(true);
    } catch (error) {
      setError(error.message || "Failed to submit appraisal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p={3}
      sx={{
        height: "960px",
        width: "720px",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h5" mb={2}>
        Give Performance Appraisal
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <FormControl fullWidth>
          <TextField
            label="Employee Name"
            variant="outlined"
            value={values.employeeName}
            onChange={(e) => setValues({ ...values, employeeName: e.target.value })}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Select Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      </Box>

      <Tabs value={selectedTab} onChange={handleTabChange}
        textColor="inherit"
        indicatorColor="transparent"
        sx={{ marginBottom: 2 }}
      >
        <Tab
          label="Technical"
          sx={{
            border: "1px solid #ccc",
            width: "240px",
            height: "46px",
            borderRadius: "8px",
            textAlign: "center",
            textDecoration: "none",
            color: selectedTab === 0 ? 'white' : '#004E69',
            backgroundColor: selectedTab === 0 ? "#FF902F" : "transparent",
            "&:hover": {
              backgroundColor: selectedTab === 0 ? "#FF902F" : "transparent",
            },
          }}
        />
        <Tab
          label="Organizational"
          sx={{
            border: "1px solid #ccc",
            width: "240px",
            height: "46px",
            borderRadius: "8px",
            textAlign: "center",
            ml: 2,
            textDecoration: "none",
            color: selectedTab === 1 ? 'white' : '#004E69',
            backgroundColor: selectedTab === 1 ? "#FF902F" : "transparent",
            "&:hover": {
              backgroundColor: selectedTab === 1 ? "#FF902F" : "transparent",
            },
          }}
        />
      </Tabs>

      {selectedTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Indicator</TableCell>
                <TableCell>Expected Value</TableCell>
                <TableCell>Set Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.technicalCompetencies.map((competency, index) => (
                <TableRow key={index}>
                  <TableCell>{competency.indicator}</TableCell>
                  <TableCell>{competency.expectedValue}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <Select
                        value={competency.setValue}
                        onChange={(e) => handleSetValueChange(index, e.target.value, true)}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Beginner">Beginner</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                        <MenuItem value="Expert / Leader">Expert / Leader</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Indicator</TableCell>
                <TableCell>Expected Value</TableCell>
                <TableCell>Set Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.organizationalCompetencies.map((competency, index) => (
                <TableRow key={index}>
                  <TableCell>{competency.indicator}</TableCell>
                  <TableCell>{competency.expectedValue}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <Select
                        value={competency.setValue}
                        onChange={(e) => handleSetValueChange(index, e.target.value, false)}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Beginner">Beginner</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                        <MenuItem value="Expert / Leader">Expert / Leader</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box mt={3} display="flex" alignItems="center" gap={2}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value })}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ backgroundColor: "#FF902F", color: "white" }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Appraisal"}
        </Button>
      </Box>

      <Snackbar
        open={!!error || success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || "Appraisal submitted successfully!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Apraisal;
