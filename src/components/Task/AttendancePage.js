import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Pagination,
  Alert,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Common_Bar/NavBar';
import TopBar from '../Common_Bar/TopBar';
import Sidebar from '../Common_Bar/Sidebar';

// Month names for dropdown
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Create MUI theme
const theme = createTheme();

// Validate and fix attendance data
const validateAttendanceData = (backendData) => {
  return backendData.map((employee) => {
    const validatedAttendance = employee.attendance.map((entry) => {
      const daysInMonth = new Date(entry.year, entry.month, 0).getDate();
      if (!entry.days || !Array.isArray(entry.days)) {
        console.warn(`Invalid days array for employee ${employee._id}, month ${entry.month}: ${entry.days}`);
        return {
          ...entry,
          days: Array(daysInMonth).fill(false),
        };
      }
      if (entry.days.length !== daysInMonth) {
        console.warn(`Incorrect days array length for employee ${employee._id}, month ${entry.month}: got ${entry.days.length}, expected ${daysInMonth}`);
        const fixedDays = Array(daysInMonth).fill(false);
        entry.days.forEach((status, index) => {
          if (index < daysInMonth) fixedDays[index] = status;
        });
        return {
          ...entry,
          days: fixedDays,
        };
      }
      return entry;
    });
    // Consolidate multiple entries for the same month
    const attendanceByMonth = {};
    validatedAttendance.forEach((entry) => {
      const key = `${entry.year}-${entry.month}`;
      if (!attendanceByMonth[key]) {
        attendanceByMonth[key] = entry;
      } else {
        console.warn(`Duplicate month entry for employee ${employee._id}, month ${entry.month}, year ${entry.year}`);
        // Merge days, prioritizing the latest entry
        entry.days.forEach((status, index) => {
          if (status) attendanceByMonth[key].days[index] = status;
        });
      }
    });
    return {
      ...employee,
      attendance: Object.values(attendanceByMonth),
    };
  });
};

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [addEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowMonthSelections, setRowMonthSelections] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmEmployeeIndex, setConfirmEmployeeIndex] = useState(null);
  const [confirmMonth, setConfirmMonth] = useState(null);
  const [confirmDayIndex, setConfirmDayIndex] = useState(null);
  const employeesPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / employeesPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AttendancePage component mounted');
    return () => console.log('AttendancePage component unmounted');
  }, []);

  const fetchAttendanceData = async () => {
    console.log('Attempting to fetch attendance data...');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access attendance data');
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/api/employee-attendance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched raw attendance data:', JSON.stringify(response.data, null, 2));
      const validatedData = validateAttendanceData(response.data.data);
      console.log('Validated attendance data:', JSON.stringify(validatedData, null, 2));
      setAttendanceData(validatedData);
      setFilteredData(validatedData);
      const initialSelections = {};
      validatedData.forEach((employee) => {
        initialSelections[employee._id] = new Date().getMonth() + 1;
      });
      console.log('Initial row month selections:', initialSelections);
      setRowMonthSelections(initialSelections);
    } catch (error) {
      console.error('Error fetching attendance data:', error.message);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        console.log('401 Unauthorized, redirecting to login');
        navigate('/login');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to the backend server. Please ensure it is running on http://localhost:5000.');
        console.log('Network error: Backend server not reachable at http://localhost:5000');
      } else {
        setError('Failed to fetch attendance data: ' + error.message);
      }
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [navigate]);

  const handleAddEmployee = async () => {
    if (!newEmployeeName.trim()) {
      setError('Employee name is required');
      console.log('Employee name is empty');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to add an employee');
      console.log('No token found for adding employee, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
      const newAttendance = [{
        month: currentMonth,
        year: currentYear,
        days: Array(daysInMonth).fill(false),
      }];
      console.log('Sending POST request to add employee:', { name: newEmployeeName, attendance: newAttendance });
      const response = await axios.post(
        'http://localhost:5000/api/employee-attendance/add',
        { name: newEmployeeName, attendance: newAttendance },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Added employee:', JSON.stringify(response.data, null, 2));
      const newEmployee = {
        ...response.data.data,
        attendance: newAttendance,
      };
      setAttendanceData((prevData) => [...prevData, newEmployee]);
      setFilteredData((prevData) => [...prevData, newEmployee]);
      setRowMonthSelections((prev) => ({
        ...prev,
        [newEmployee._id]: currentMonth,
      }));
      const newTotalPages = Math.ceil((filteredData.length + 1) / employeesPerPage);
      setCurrentPage(newTotalPages);
      setAddEmployeeDialogOpen(false);
      setNewEmployeeName('');
      setError('');
    } catch (error) {
      console.error('Error adding employee:', error.message);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to the backend server. Please ensure it is running on http://localhost:5000.');
        console.log('Network error: Backend server not reachable at http://localhost:5000');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        console.log('401 Unauthorized while adding employee, redirecting to login');
        navigate('/login');
      } else {
        setError('Failed to add employee: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleSaveAttendance = async (employeeIndex, month, updatedDays) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to save attendance');
      console.log('No token found for saving attendance, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const employee = attendanceData[employeeIndex];
      const monthData = employee.attendance.find((m) => m.month === month) || {
        month,
        year: new Date().getFullYear(),
        days: Array(new Date(new Date().getFullYear(), month, 0).getDate()).fill(false),
      };
      const daysInMonth = new Date(monthData.year, month, 0).getDate();
      const attendanceForBackend = [{
        month,
        year: monthData.year,
        days: updatedDays.slice(0, daysInMonth),
      }];
      console.log('Saving attendance for employee:', employee._id, 'month:', month, 'attendance:', JSON.stringify(attendanceForBackend, null, 2));
      const response = await axios.post(
        `http://localhost:5000/api/employee-attendance/${employee._id}`,
        { attendance: attendanceForBackend },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Updated attendance:', JSON.stringify(response.data, null, 2));
      await fetchAttendanceData();
      setError('');
    } catch (error) {
      console.error('Error saving attendance:', error.message);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to the backend server. Please ensure it is running on http://localhost:5000.');
        console.log('Network error: Backend server not reachable at http://localhost:5000');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        console.log('401 Unauthorized while saving attendance, redirecting to login');
        navigate('/login');
      } else {
        setError('Failed to save attendance: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const toggleAttendance = (employeeIndex, month, dayIndex) => {
    console.log(`Toggling attendance for employee ${employeeIndex}, month ${month}, day ${dayIndex}`);
    const employee = attendanceData[employeeIndex];
    const monthData = employee.attendance.find((m) => m.month === month) || {
      month,
      year: new Date().getFullYear(),
      days: Array(new Date(new Date().getFullYear(), month, 0).getDate()).fill(false),
    };
    const currentStatus = monthData.days[dayIndex] || false;
    const newStatus = !currentStatus;
    setConfirmAction({
      employeeIndex,
      month,
      dayIndex,
      newStatus,
    });
    setConfirmEmployeeIndex(employeeIndex);
    setConfirmMonth(month);
    setConfirmDayIndex(dayIndex);
    setConfirmDialogOpen(true);
  };

  const handleConfirmToggle = () => {
    const { employeeIndex, month, dayIndex, newStatus } = confirmAction;
    const updatedData = [...attendanceData];
    const monthData = updatedData[employeeIndex].attendance.find((m) => m.month === month);
    if (!monthData) {
      const currentYear = new Date().getFullYear();
      const daysInMonth = new Date(currentYear, month, 0).getDate();
      const newMonthData = {
        month,
        year: currentYear,
        days: Array(daysInMonth).fill(false),
      };
      newMonthData.days[dayIndex] = newStatus;
      updatedData[employeeIndex].attendance.push(newMonthData);
      setAttendanceData(updatedData);
      setFilteredData(updatedData);
      handleSaveAttendance(employeeIndex, month, newMonthData.days);
    } else {
      const daysInMonth = new Date(monthData.year, month, 0).getDate();
      const updatedDays = [...monthData.days];
      if (updatedDays.length !== daysInMonth) {
        console.warn(`Fixing days array length for employee ${updatedData[employeeIndex]._id}, month ${month}: got ${updatedDays.length}, expected ${daysInMonth}`);
        const fixedDays = Array(daysInMonth).fill(false);
        updatedDays.forEach((status, index) => {
          if (index < daysInMonth) fixedDays[index] = status;
        });
        updatedDays = fixedDays;
      }
      updatedDays[dayIndex] = newStatus;
      monthData.days = updatedDays;
      setAttendanceData(updatedData);
      setFilteredData(updatedData);
      handleSaveAttendance(employeeIndex, month, updatedDays);
    }
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const handleRowMonthChange = (employeeId, month) => {
    console.log(`Row month selected for employee ${employeeId}:`, month);
    setRowMonthSelections((prev) => ({
      ...prev,
      [employeeId]: parseInt(month),
    }));
  };

  const handleSearch = () => {
    console.log('Searching with:', { selectedEmployeeName, selectedMonth, selectedYear });
    let filtered = attendanceData;

    if (selectedEmployeeName.trim()) {
      filtered = filtered.filter((employee) =>
        employee.name.toLowerCase().includes(selectedEmployeeName.toLowerCase())
      );
    }

    if (selectedMonth || selectedYear) {
      filtered = filtered.map((employee) => ({
        ...employee,
        attendance: employee.attendance.filter((month) => {
          const isMonthMatch = !selectedMonth || month.month === parseInt(selectedMonth);
          const isYearMatch = !selectedYear || month.year === parseInt(selectedYear);
          return isMonthMatch && isYearMatch;
        }),
      })).filter((employee) => employee.attendance.length > 0);
    }

    console.log('Filtered data:', JSON.stringify(filtered, null, 2));
    setFilteredData(filtered);
    setCurrentPage(1);
    setError('');
  };

  const handlePageChange = (event, value) => {
    console.log('Changing page to:', value);
    setCurrentPage(value);
  };

  const currentEmployees = filteredData.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  console.log('Rendering filter section with selectedMonth:', selectedMonth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={12}>
          <Navbar />
        </Grid>
        <Grid item xs={12}>
          <TopBar />
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={3}>
            <Sidebar />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box p={1}>
              <h2>Attendance</h2>
              <p>Configuration / Attendance</p>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box mb={2}>
                <Alert severity="info">Filter Section Rendering</Alert>
              </Box>
              <Grid container spacing={2} padding={2}>
                <Grid item xs={3}>
                  <TextField
                    label="Employee Name"
                    variant="outlined"
                    fullWidth
                    value={selectedEmployeeName}
                    onChange={(e) => setSelectedEmployeeName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  {console.log('Rendering global month dropdown with monthNames:', monthNames)}
                  <FormControl fullWidth>
                    <InputLabel id="month-select-label">Select Month (Global)</InputLabel>
                    <Select
                      labelId="month-select-label"
                      label="Select Month (Global)"
                      value={selectedMonth || ''}
                      onChange={(e) => {
                        console.log('Global month selected:', e.target.value);
                        setSelectedMonth(e.target.value);
                      }}
                    >
                      <MenuItem value="">
                        <em>All Months</em>
                      </MenuItem>
                      {monthNames.map((name, index) => (
                        <MenuItem key={index} value={index + 1}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Year"
                    variant="outlined"
                    fullWidth
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    onClick={() => setAddEmployeeDialogOpen(true)}
                    sx={{ backgroundColor: '#FF902F', '&:hover': { backgroundColor: '#FF902F' } }}
                  >
                    Add Employee
                  </Button>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ width: '50%', backgroundColor: '#55CE63', '&:hover': { backgroundColor: '#55CE63' } }}
              >
                Search
              </Button>

              {filteredData.length === 0 && (
                <Box mt={2}>
                  <Alert severity="info">No attendance data available for the selected filters.</Alert>
                </Box>
              )}

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee Name</TableCell>
                    <TableCell>Month</TableCell>
                    {Array.from({ length: 31 }, (_, dayIndex) => (
                      <TableCell key={`day-${dayIndex}`} align="center">
                        {dayIndex + 1}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentEmployees.map((employee, empIndex) => {
                    const selectedMonthForEmployee = rowMonthSelections[employee._id] || new Date().getMonth() + 1;
                    const monthData = employee.attendance.find(
                      (month) => month.month === selectedMonthForEmployee
                    ) || {
                      month: selectedMonthForEmployee,
                      year: new Date().getFullYear(),
                      days: Array(new Date(new Date().getFullYear(), selectedMonthForEmployee, 0).getDate()).fill(false),
                    };
                    const totalDays = new Date(monthData.year, monthData.month, 0).getDate();
                    console.log(`Rendering row for employee ${employee._id} with month:`, selectedMonthForEmployee, 'monthData:', JSON.stringify(monthData, null, 2));
                    return (
                      <TableRow key={`attendance-${employee._id}`}>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>
                          <FormControl fullWidth>
                            <InputLabel id={`month-select-${employee._id}`}>Month</InputLabel>
                            <Select
                              labelId={`month-select-${employee._id}`}
                              label="Month"
                              value={selectedMonthForEmployee}
                              onChange={(e) => handleRowMonthChange(employee._id, e.target.value)}
                            >
                              {monthNames.map((name, index) => (
                                <MenuItem key={index} value={index + 1}>
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        {Array.from({ length: 31 }, (_, dayIndex) => {
                          if (dayIndex < totalDays) {
                            return (
                              <TableCell key={`attendance-checkbox-${dayIndex}`} align="center">
                                <Checkbox
                                  checked={monthData.days[dayIndex] || false}
                                  onChange={() => toggleAttendance(empIndex, selectedMonthForEmployee, dayIndex)}
                                  icon={<span style={{ color: 'red' }}>✘</span>}
                                  checkedIcon={<span style={{ color: 'green' }}>✔</span>}
                                  color="default"
                                />
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={`attendance-blank-${dayIndex}`} align="center">
                              {/* Blank cells for days not in the month */}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Add Employee Dialog */}
        <Dialog open={addEmployeeDialogOpen} onClose={() => setAddEmployeeDialogOpen(false)}>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogContent>
            <TextField
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              label="Employee Name"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleAddEmployee}
              variant="contained"
              sx={{ backgroundColor: '#55CE63', '&:hover': { backgroundColor: '#55CE63' } }}
            >
              Add Employee
            </Button>
            <Button
              onClick={() => setAddEmployeeDialogOpen(false)}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog for Attendance Toggle */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Confirm Attendance Change</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to mark this day as {confirmAction?.newStatus ? 'present' : 'absent'}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleConfirmToggle}
              variant="contained"
              sx={{ backgroundColor: '#55CE63', '&:hover': { backgroundColor: '#55CE63' } }}
            >
              Yes
            </Button>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </ThemeProvider>
  );
};

export default AttendancePage;