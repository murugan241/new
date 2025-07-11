// Payroll.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Modal,
  Box,
  Grid,
  Pagination,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";
import { useNavigate } from "react-router-dom";

const Payroll = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [openSalaryModal, setOpenSalaryModal] = useState(false);
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [customEmployeeName, setCustomEmployeeName] = useState("");
  const [formData, setFormData] = useState({
    netSalary: "",
    basic: "",
    da: "",
    hra: "",
    conveyance: "",
    allowance: "",
    medicalAllowance: "",
    earningsOthers: "",
    tds: "",
    esi: "",
    pf: "",
    leave: "",
    profTax: "",
    labourWelfare: "",
    deductionsOthers: "",
  });
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    mobile: "",
    joinDate: "",
    role: "",
    salary: "",
  });
  const [filters, setFilters] = useState({
    name: "",
    employeeId: "",
    role: "",
  });
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/employee-salaries`);
        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setEmployees(data.employeeSalaries);
        setFilteredEmployees(data.employeeSalaries);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError(error.message || "Failed to fetch employees. Please try again.");
      }
    };
    fetchEmployees();
  }, []);

  const handleOpenSalaryModal = () => setOpenSalaryModal(true);
  const handleCloseSalaryModal = () => {
    setOpenSalaryModal(false);
    setError("");
  };
  const handleOpenEmployeeModal = () => setOpenEmployeeModal(true);
  const handleCloseEmployeeModal = () => {
    setOpenEmployeeModal(false);
    setError("");
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormData({ ...employeeFormData, [name]: value });
  };
  const itemsPerPage = 2;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const generateSlip = (employeeId) => {
    navigate(`/Payslip/${employeeId}`);
  };
  const handleFilter = () => {
    const { name, employeeId, role } = filters;
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(name.toLowerCase()) &&
        emp.employeeId.toLowerCase().includes(employeeId.toLowerCase()) &&
        (!role || emp.role === role)
    );
    setFilteredEmployees(filtered);
  };
  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError("");
  };
  const handleSubmitSalary = async () => {
    if (!customEmployeeName) {
      setError("Please enter an employee name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/payroll/add`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee: customEmployeeName,
          ...formData,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add salary: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Salary added successfully:', result);
      setSuccess(true);
      handleCloseSalaryModal();
    } catch (error) {
      console.error('Error adding salary:', error);
      setError(error.message || "Failed to add salary. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitEmployee = async () => {
    setLoading(true);
    setError("");
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/employee-salary/add`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeFormData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add employee: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Employee added successfully:', result);
      setSuccess(true);
      handleCloseEmployeeModal();
    } catch (error) {
      console.error('Error adding employee:', error);
      setError(error.message || "Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
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
          <div style={{ padding: "70px" }}>
            <h2>Payroll</h2>
            <p>Admin / Payroll / Employee Salary</p>
            {/* Search Section */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <TextField
                label="Employee Name"
                name="name"
                variant="outlined"
                value={filters.name}
                onChange={handleFilterChange}
              />
              <TextField
                label="Employee ID"
                name="employeeId"
                variant="outlined"
                value={filters.employeeId}
                onChange={handleFilterChange}
              />
              <Select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                displayEmpty
                style={{ minWidth: "200px" }}
              >
                <MenuItem value="">Select Designation</MenuItem>
                {[...new Set(employees.map((emp) => emp.role))].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="contained" sx={{ backgroundColor: "#FF902F" }} onClick={handleOpenSalaryModal}>
                Add Salary
              </Button>
              <Button variant="contained" sx={{ backgroundColor: "#4CAF50" }} onClick={handleOpenEmployeeModal}>
                Employee Salary
              </Button>
            </div>
            <Button
              variant="contained"
              onClick={handleFilter}
              sx={{
                backgroundColor: "green",
                width: "40%",
                "&:hover": {
                  backgroundColor: "darkgreen",
                },
              }}
            >
              Search
            </Button>
            {/* Employee Table */}
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Join Date</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.map((emp) => (
                    <TableRow key={emp._id}>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={emp.image || "default-image-path.jpg"}
                            alt={`${emp.name}'s image`}
                            style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
                          />
                          {emp.name}
                        </div>
                      </TableCell>
                      <TableCell>{emp.employeeId}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.mobile}</TableCell>
                      <TableCell>{new Date(emp.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>{emp.role}</TableCell>
                      <TableCell>₹{emp.salary}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#FF902F" }}
                          onClick={() => generateSlip(emp.employeeId)}
                        >
                          Generate Slip
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Box>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of{" "}
                {filteredEmployees.length} entries
              </Box>
              <Pagination
                count={Math.ceil(filteredEmployees.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
            {/* Add Staff Salary Modal */}
            <Modal open={openSalaryModal} onClose={handleCloseSalaryModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "white",
                  boxShadow: 24,
                  p: 4,
                  width: "80%",
                  maxWidth: 800,
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3>Add Staff Salary</h3>
                  <IconButton onClick={handleCloseSalaryModal}>
                    <CloseIcon />
                  </IconButton>
                </div>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                  <TextField
                    label="Employee Name"
                    variant="outlined"
                    fullWidth
                    value={customEmployeeName}
                    onChange={(e) => setCustomEmployeeName(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                  <TextField
                    label="Net Salary"
                    name="netSalary"
                    variant="outlined"
                    fullWidth
                    value={formData.netSalary}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ display: "flex", gap: "40px" }}>
                  {/* Earnings Section */}
                  <div style={{ flex: 1 }}>
                    <h4>Earnings</h4>
                    {["Basic", "DA(40%)", "HRA(15%)", "Conveyance", "Allowance", "Medical Allowance", "Others"].map((label, index) => (
                      <TextField
                        key={index}
                        label={label}
                        name={label.toLowerCase().replace(/[\(\)% ]/g, "")}
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: "20px" }}
                        value={formData[label.toLowerCase().replace(/[\(\)% ]/g, "")]}
                        onChange={handleChange}
                      />
                    ))}
                  </div>
                  {/* Deductions Section */}
                  <div style={{ flex: 1 }}>
                    <h4>Deductions</h4>
                    {["TDS", "ESI", "PF", "Leave", "Prof.tax", "Labour Welfare", "Others"].map((label, index) => (
                      <TextField
                        key={index}
                        label={label}
                        name={label.toLowerCase().replace(/[\(\)% ]/g, "")}
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: "20px" }}
                        value={formData[label.toLowerCase().replace(/[\(\)% ]/g, "")]}
                        onChange={handleChange}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Add More"}
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSubmitSalary} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                </div>
              </Box>
            </Modal>
            {/* Add Employee Modal */}
            <Modal open={openEmployeeModal} onClose={handleCloseEmployeeModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "white",
                  boxShadow: 24,
                  p: 4,
                  width: "80%",
                  maxWidth: 800,
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3>Add Employee</h3>
                  <IconButton onClick={handleCloseEmployeeModal}>
                    <CloseIcon />
                  </IconButton>
                </div>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexDirection: "column" }}>
                  <TextField
                    label="Name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    value={employeeFormData.name}
                    onChange={handleEmployeeChange}
                  />
                  <TextField
                    label="Employee ID"
                    name="employeeId"
                    variant="outlined"
                    fullWidth
                    value={employeeFormData.employeeId}
                    onChange={handleEmployeeChange}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    value={employeeFormData.email}
                    onChange={handleEmployeeChange}
                  />
                  <TextField
                    label="Mobile"
                    name="mobile"
                    variant="outlined"
                    fullWidth
                    value={employeeFormData.mobile}
                    onChange={handleEmployeeChange}
                  />
                  <TextField
                    label="Join Date"
                    name="joinDate"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={employeeFormData.joinDate}
                    onChange={handleEmployeeChange}
                  />
                  <Select
                    name="role"
                    value={employeeFormData.role}
                    onChange={handleEmployeeChange}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select Role
                    </MenuItem>
                    <MenuItem value="Web Developer">Web Developer</MenuItem>
                    <MenuItem value="UI Designer">UI Designer</MenuItem>
                    <MenuItem value="Backend Developer">Backend Developer</MenuItem>
                  </Select>
                  <TextField
                    label="Salary"
                    name="salary"
                    variant="outlined"
                    fullWidth
                    value={employeeFormData.salary}
                    onChange={handleEmployeeChange}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" color="primary" onClick={handleSubmitEmployee} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                </div>
              </Box>
            </Modal>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={!!error || success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || "Operation successful!"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Payroll;
