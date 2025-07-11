import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Menu,
  MenuItem,
  TableFooter,
  TablePagination,
  Select,
  FormControl,
  Button,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

import emp1 from '../../assets/emp1.png';
import emp2 from '../../assets/emp2.png';
import emp3 from '../../assets/emp3.png';


const AdminDepartmentView = () => {
  const departments = [
    {
      img:emp1,
      name: "Bernardo Galaviz",
      id: "FT-0007",
      email: "bernardogalaviz@example.com",
      mobile: "9876543210",
      joinDate: "1 Jan 2013",
      role: "Web Developer",
      currentProject: "Digital AI",
      process: 55,
    },
    {
      img:emp2,
      name: "Jeffrey Warden",
      id: "FT-0006",
      email: "jeffreywarden@example.com",
      mobile: "9876543210",
      joinDate: "15 Jun 2013",
      role: "App Developer",
      currentProject: "Butcher Shop",
      process: 75,
    },
    {
      img:emp3,
      name: "Bernardo Galaviz",
      id: "FT-0007",
      email: "bernardogalaviz@example.com",
      mobile: "9876543210",
      joinDate: "1 Jan 2013",
      role: "Web Developer",
      currentProject: "Digital AI",
      process: 55,
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedRows = departments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12}>
        <Navbar />

        {/* TopBar */}
        <Box
          display="flex"
          alignItems="center"
          px={2}
          mt={0.5}
          sx={{ height: "80px", backgroundColor: "#FFF7F7" }}
        >
            <Button
                variant="contained"
                sx={{
                background: "#004E69",
                color: "white",
                height: "40px",
                borderRadius: "10px",
                width: "auto",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                }}
            >
            Add New
        </Button>
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
          <Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>
            <Box xs={{ width: "100%" }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "15px",
                  color: "#4D5154",
                  width: "100%",
                  display: "flex",
                  gap: 1.5,
                }}
              >
                Show
                <Box
                  sx={{
                    width: "30px",
                    height: "30px",
                    border: "1px solid #D3D3D4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {departments.length}
                </Box>
                entries
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Employee ID
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Email
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Mobile
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Join Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Role
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Current Project
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Process
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, fontSize: "11px" }}>
                        Action
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedRows.map((dept, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 1 ? "#FFFFFF" : "#F5F6F7",
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {/* <Avatar>{dept.name.charAt(0)}</Avatar> */}
                          <img src={dept.img} alt="emp"/>
                          <Typography
                            sx={{ fontWeight: 500, fontSize: "10.5px" }}
                          >
                            {dept.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.mobile}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.joinDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                      <FormControl
                            sx={{
                                width: "98.17px",
                                height: "23.13px",
                                borderRadius: "37.31px",
                                border: "0.75px solid #D3D3D4",
                            }}
                            >
                            <Select
                                value={dept.role}
                                onChange={(e) => {}}
                                sx={{
                                fontSize: "10.5px",
                                height: "100%",
                                borderRadius: "37.31px", // matching the border radius of FormControl
                                border: "0.75px solid #D3D3D4", // matching the border style
                                }}
                            >
                                <MenuItem value="Web Developer">Web Developer</MenuItem>
                                <MenuItem value="App Developer">App Developer</MenuItem>
                                <MenuItem value="Designer">Designer</MenuItem>
                            </Select>
                            </FormControl>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500, fontSize: "10.5px" }}>
                          {dept.currentProject}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={dept.process}
                            sx={{
                              width: "80px",
                              height: "8px",
                              borderRadius: 5,
                            }}
                          />
                          <Typography>{dept.process}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={handleMenuOpen}>
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                  <TableCell colSpan={5}>
                      <Typography>
                        Showing {page * rowsPerPage + 1} to{" "}
                        {Math.min((page + 1) * rowsPerPage, departments.length)}{" "}
                        of {departments.length} entries
                      </Typography>
                    </TableCell>
                    <TablePagination
                      rowsPerPageOptions={[7, 14, 21]}
                      count={departments.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDepartmentView;
