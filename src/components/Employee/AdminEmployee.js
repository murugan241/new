import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Paper,
  Grid,
  Dialog,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Common_Bar/NavBar';
import Sidebar from '../Common_Bar/Sidebar';
import EmployeeAction from './EmployeeAction';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteEmployee from './DeleteEmployee';
import EditIcon from '@mui/icons-material/Edit';
import TopBar from "../Common_Bar/TopBar";

const AdminEmployee = () => {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(6); // Changed to 6 employees per page
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/editemployee');
  };

  const handleDepartmentFilter = (event) => {
    setSelectedDepartment(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  const filterData = () => {
    return data.filter(staffMember => {
      const matchesSearch = Object.values(staffMember).some(value =>
        value.toString().toLowerCase().includes(searchTerm)
      );
      const matchesDepartmentFilter = selectedDepartment 
        ? staffMember.department === selectedDepartment 
        : true;
      return matchesSearch && matchesDepartmentFilter;
    });
  };

  const filteredData = filterData();
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Custom pagination handlers for arrow navigation
  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handleRequest = () => {
    setDialogContent(<EmployeeAction />);
    setOpen(true);
  };

  const clickClose = () => {
    setOpen(false);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setDeleteOpen(true);
  };

  const handleDeleteEmployee = (staffId) => {
    const updatedData = data.filter(employee => employee.staffId !== staffId);
    setData(updatedData);
    setDeleteOpen(false);
  };

  const handleCloseDialog = () => {
    setDeleteOpen(false);
  };

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/staffs`);

        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }

        const result = await response.json();
        console.log('Employees data:', result);
        setData(result.staff || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/departments');
        
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }

        const result = await response.json();
        console.log('Departments data:', result);
        setDepartments(result.departments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Get unique departments from employees data as fallback
  const getUniqueDepartments = () => {
    const uniqueDepts = [...new Set(data.map(employee => employee.department).filter(Boolean))];
    return uniqueDepts.sort();
  };

  // Combine departments from API and unique departments from employees
  const allDepartments = () => {
    const apiDepartments = departments.map(dept => dept.departmentName);
    const employeeDepartments = getUniqueDepartments();
    const combined = [...new Set([...apiDepartments, ...employeeDepartments])];
    return combined.sort();
  };

  useEffect(() => {
    console.log('Filtered data:', filteredData);
    console.log('Paginated data:', paginatedData);
  }, [filteredData, paginatedData]);

  return (
    <Grid container bgcolor={'#E5F1FF'} sx={{ height: '100vh', overflowY: "auto" }}>
      <Grid item lg={12} xs={12} sx={{ flexShrink: 0 }}>
        <Navbar />
      </Grid>
      <Grid item lg={12} xs={12} sx={{ flexShrink: 0 }}>
        <TopBar />
      </Grid>
      <Grid container item lg={12} xs={11.5} sx={{ height: 'calc(100vh - 144px)' }}>
        <Grid item lg={2} md={1.2} sm={2} xs={12} sx={{ height: '100%' }}>
          <Sidebar />
        </Grid>
        <Grid item lg={9.8} md={10.8} sm={10} xs={12} bgcolor={'#E5F1FF'} sx={{ height: '100%' }}>
          {/* Top Control Card */}
          <Card sx={{ width: '100%', height: '130px', borderRadius: '20px', mt: 2, ml: "20px" }}>
            <Grid container spacing={2} sx={{ p: 1, mt: "-5px" }}>
              <Grid item xs={12} sm={2.8} sx={{ ml: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                <Typography sx={{ fontWeight: "400", fontSize: "14px", color: "#121212" }}>
                  Quick search a staff
                </Typography>
                <TextField
                  variant="outlined"
                  placeholder="Enter search word"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: '100%',
                    maxWidth: '350px',
                    borderRadius: 1,
                    backgroundColor: 'white',
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        border: "1px solid #D0D0D0",
                        borderRadius: "10px",
                      },
                      '&:hover fieldset': {
                        border: "1px solid #D0D0D0",
                        borderRadius: "10px",
                      },
                      '&.Mui-focused fieldset': {
                        border: "1px solid #D0D0D0",
                        borderRadius: "10px",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2.8} sx={{ ml: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                <Typography sx={{ fontWeight: "800", fontSize: "24px", color: "#272525" }}>
                  {filteredData.length}
                </Typography>
                <Typography sx={{ fontWeight: "400", fontSize: "14px", color: "#515151" }}>
                  {selectedDepartment ? `Staff in ${selectedDepartment}` : 'Total number of staff'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={2.8} sx={{ ml: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                <Typography sx={{ fontWeight: "400", fontSize: "14px", color: "#121212" }}>
                  Filter by Department
                </Typography>
                <FormControl sx={{ width: "100%", mt: "10px", borderRadius: "20px", background: "#F2F7FF", border: "none" }}>
                  <InputLabel id="department-label">All Departments</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department-select"
                    value={selectedDepartment}
                    onChange={handleDepartmentFilter}
                    input={
                      <OutlinedInput
                        label="Department"
                        sx={{
                          borderRadius: "10px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none"
                          },
                        }}
                      />
                    }
                    sx={{
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {allDepartments().map((department) => (
                      <MenuItem key={department} value={department}>
                        {department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2.8} sx={{ ml: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Link to='/employeeAdd'>
                  <Button
                    sx={{
                      width: '100%',
                      maxWidth: '180px',
                      height: '46px',
                      bgcolor: "#004E69",
                      mt: { xs: 2, sm: 4 },
                      borderRadius: "10px",
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: "#004E69",
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "white", textTransform: "none" }}>
                      Add New Staff
                    </Typography>
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Card>

          {/* Main Table Container */}
          <TableContainer component={Paper} sx={{ width: '100%', height: 'auto', mt: 2, borderRadius: '10px', overflow: 'auto', ml: "20px" }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Table Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "20px", color: "#515151" }}>
                  {selectedDepartment ? `${selectedDepartment} Department Staff` : 'All Staff'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* Pagination Info */}
                  <Typography sx={{ fontWeight: 500, fontSize: "14px", color: "#515151" }}>
                    Showing {paginatedData.length > 0 ? page * rowsPerPage + 1 : 0}-{Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} employees
                  </Typography>
                  
                  {/* Navigation Arrows */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={handlePrevPage}
                      disabled={page === 0}
                      sx={{
                        bgcolor: page === 0 ? '#f5f5f5' : '#004E69',
                        color: page === 0 ? '#999' : 'white',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          bgcolor: page === 0 ? '#f5f5f5' : '#003854',
                        },
                        '&:disabled': {
                          bgcolor: '#f5f5f5',
                          color: '#999',
                        }
                      }}
                    >
                      <ArrowBackIosIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    
                    <Typography sx={{ fontWeight: 500, fontSize: "14px", color: "#515151", mx: 1 }}>
                      {totalPages > 0 ? page + 1 : 0} of {totalPages}
                    </Typography>
                    
                    <IconButton
                      onClick={handleNextPage}
                      disabled={page >= totalPages - 1}
                      sx={{
                        bgcolor: page >= totalPages - 1 ? '#f5f5f5' : '#004E69',
                        color: page >= totalPages - 1 ? '#999' : 'white',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          bgcolor: page >= totalPages - 1 ? '#f5f5f5' : '#003854',
                        },
                        '&:disabled': {
                          bgcolor: '#f5f5f5',
                          color: '#999',
                        }
                      }}
                    >
                      <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  <Button onClick={handleRequest} sx={{ height: "46px", background: "#004E69", borderRadius: "10px", '&:hover': { background: "#004E69" } }}>
                    <Typography sx={{ fontWeight: 500, fontSize: "14px", color: "white", textTransform: "none" }}>
                      View Attendance and Project Status
                    </Typography>
                  </Button>
                </Box>
              </Box>

              {/* Table Content */}
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151" }}>S/N</Typography></TableCell>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151" }}>First Name</Typography></TableCell>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151" }}>Last Name</Typography></TableCell>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151" }}>Gender</Typography></TableCell>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151" }}>Staff ID</Typography></TableCell>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151" }}>Phone Number</Typography></TableCell>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151" }}>Department</Typography></TableCell>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151" }}>Role</Typography></TableCell>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151" }}>Designation</Typography></TableCell>
                      <TableCell sx={{ borderBottom: "none", bgcolor: '#f8f9fa' }}><Typography sx={{ fontWeight: 700, fontSize: "12px", color: "#515151", ml: 2 }}>Action</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography sx={{ fontSize: "16px", color: "#666" }}>Loading employees...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography sx={{ fontSize: "16px", color: "#666" }}>
                            {selectedDepartment 
                              ? `No staff found in ${selectedDepartment} department` 
                              : 'No staff found'
                            }
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((row, index) => (
                        <TableRow 
                          key={row.staffId || index}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#f5f7fa',
                            },
                            borderBottom: '1px solid #e0e0e0'
                          }}
                        >
                          <TableCell><Typography sx={{ fontWeight: 500, fontSize: "12px", color: "#515151" }}>{page * rowsPerPage + index + 1}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontWeight: 500, fontSize: "12px", color: "#515151" }}>{row.firstName}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontWeight: 500, fontSize: "12px", color: "#515151" }}>{row.lastName}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontWeight: 500, fontSize: "12px", color: "#515151" }}>{row.gender}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontWeight: 500, fontSize: "12px", color: "#515151" }}>{row.staffId}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontWeight: 500, fontSize: "12px", color: "#515151" }}>{row.phone}</Typography></TableCell>
                          <TableCell>
                            <Box sx={{ 
                              bgcolor: row.department ? '#e3f2fd' : '#f5f5f5', 
                              px: 1, 
                              py: 0.5, 
                              borderRadius: '4px',
                              display: 'inline-block'
                            }}>
                              <Typography sx={{ 
                                fontWeight: 500, 
                                fontSize: "12px", 
                                color: row.department ? "#1976d2" : "#666"
                              }}>
                                {row.department || 'N/A'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell><Typography sx={{ fontWeight: 500, fontSize: "12px", color: "#515151" }}>{row.role}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontWeight: 500, fontSize: "12px", color: "#515151" }}>{row.designation}</Typography></TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton 
                                onClick={handleNavigate} 
                                size="small"
                                sx={{ 
                                  color: "#2596BE", 
                                  '&:hover': { bgcolor: '#e3f2fd' }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDeleteClick(row)} 
                                size="small"
                                sx={{ 
                                  color: "#f44336", 
                                  '&:hover': { bgcolor: '#ffebee' }
                                }}
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>

              {/* Bottom Pagination Summary */}
              {filteredData.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: 2,
                  borderTop: '1px solid #e0e0e0',
                  bgcolor: '#f8f9fa'
                }}>
                  <Typography sx={{ fontWeight: 400, fontSize: "14px", color: "#666" }}>
                    {selectedDepartment 
                      ? `Viewing ${selectedDepartment} department employees` 
                      : 'Viewing all employees'
                    }
                  </Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: "14px", color: "#515151" }}>
                    Page {totalPages > 0 ? page + 1 : 0} of {totalPages} • Total: {filteredData.length} employees
                  </Typography>
                </Box>
              )}
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <Dialog open={open} onClose={clickClose}
        PaperProps={{
          sx: {
            width: '80%',
            maxWidth: 'none',
            height: 'auto',
          },
        }}>
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Button
            sx={{
              mt: -2,
              fontFamily: "lato",
              fontWeight: 500,
              fontSize: "14px",
              textDecoration: "underline",
              color: "inherit",
              "&:hover": {
                textDecoration: "underline",
                backgroundColor: "transparent",
              },
              height: "auto",
              width: "auto",
            }}
            onClick={clickClose}
          >
            Back
          </Button>
        </Box>
        {dialogContent}
      </Dialog>

      <Dialog open={deleteOpen} onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            width: '75%',
            maxWidth: 'none',
            height: '542px',
            borderRadius: "25px",
            boxShadow: "5px 4px 50px 5px #3354F44D"
          },
        }}>
        <DeleteEmployee selectedEmployee={selectedEmployee} onDelete={handleDeleteEmployee} onClose={handleCloseDialog} />
      </Dialog>
    </Grid>
  );
};

export default AdminEmployee;