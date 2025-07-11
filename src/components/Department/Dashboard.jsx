import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import PeopleIcon from "@mui/icons-material/People";
import ReduceCapacityIcon from "@mui/icons-material/ReduceCapacity";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SettingsIcon from "@mui/icons-material/Settings";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [staffCount, setStaffCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [ongoingProjectCount, setOngoingProjectCount] = useState(0);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [projectStatusCounts, setProjectStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const staffResponse = await fetch(`${API_URL}/api/staffs`);
        const departmentsResponse = await fetch(`${API_URL}/api/departments`);
        const projectsResponse = await fetch(`${API_URL}/api/projects`);

        if (!staffResponse.ok || !departmentsResponse.ok || !projectsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const staffData = await staffResponse.json();
        const departmentsData = await departmentsResponse.json();
        const projectsData = await projectsResponse.json();

        setStaffCount(staffData.count || 0);
        setDepartmentCount(departmentsData.departments.length || 0);
        setProjectCount(projectsData.projects.length || 0);

        const ongoingProjects = projectsData.projects.filter(project => project.status === 'ongoing');
        setOngoingProjectCount(ongoingProjects.length || 0);
        setOngoingProjects(ongoingProjects);

        // Calculate counts for each project status
        const counts = {
          pending: projectsData.projects.filter(project => project.status === 'pending').length,
          approved: projectsData.projects.filter(project => project.status === 'approved' || project.status === 'ongoing').length,
          rejected: projectsData.projects.filter(project => project.status === 'rejected').length,
        };

        setProjectStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, []);

  const handleStaffClick = () => {
    navigate("/employee");
  };

  const handleProjectClick = () => {
    navigate("/task");
  };

  const handleTeamClick = () => {
    navigate("/department");
  };

  const card = [
    {
      id: 1,
      num: staffCount,
      ty1: "Total no of staffs",
      ty2: "12 more than etc...",
      icon: <PeopleIcon sx={{ height: "35px", width: "50px", color: "#F29425" }} />,
      col: "#FFF4E8",
      icon2: <ArrowUpwardIcon />,
      fun: handleStaffClick,
    },
    {
      id: 2,
      num: projectCount,
      ty1: "Total Projects",
      ty2: "12 more than etc...",
      icon: <FileCopyIcon sx={{ height: "35px", width: "50px", color: "#248CD8" }} />,
      col: "#E8F5FF",
      icon2: <ArrowUpwardIcon />,
      fun: handleProjectClick,
    },
    {
      id: 3,
      num: ongoingProjectCount,
      ty1: "Ongoing Projects",
      ty2: "12 more than etc...",
      icon: <RocketLaunchIcon sx={{ height: "35px", width: "50px", color: "#A601FF" }} />,
      col: "#F9EFFF",
      icon2: <ArrowUpwardIcon />,
      fun: handleTeamClick,
    },
    {
      id: 4,
      num: departmentCount,
      ty1: "Total Departments",
      icon: <ReduceCapacityIcon sx={{ height: "35px", width: "50px", color: "#10A142" }} />,
      col: "#ECFFF2",
      fun: handleTeamClick,
    },
  ];

  const data2 = [
    { label: "Pending", value: projectStatusCounts.pending, color: "#004E69" },
    { label: "Approved", value: projectStatusCounts.approved, color: "#10A142" },
    { label: "Rejected", value: projectStatusCounts.rejected, color: "#E54F53" },
  ];

  function createData(sl_no, team, teamLead, projects, progress) {
    return { sl_no, team, teamLead, projects, progress };
  }

  const rows = ongoingProjects.map((project, index) =>
    createData(index + 1, project.team || "N/A", project.projectLead || "N/A", project.projectName || "N/A", 100)
  );

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12}>
        <Navbar />
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
          <Grid item xs={12} sm={3} md={2}>
            <Sidebar />
          </Grid>
          <Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>
            <Typography variant="h4" fontWeight={"bold"} color={"#004E69"} marginLeft={2}>
              Dashboard
            </Typography>
            <Grid container spacing={2} rowGap={4} sx={{ padding: 2 }}>
              {card.map((card) => (
                <Grid item lg={3} md={6} sm={6} xs={12} key={card.id} flexWrap={"wrap"}>
                  <Card
                    sx={{
                      minWidth: "250px",
                      minHeight: "150px",
                      borderRadius: "15px",
                      margin: "10px",
                      cursor: "pointer",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                    }}
                    onClick={card.fun}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box>
                          <Typography variant="h4" fontWeight={"bold"}>
                            {card.num}
                          </Typography>
                          <Typography variant="body1" fontWeight={"bold"} margin={"3px"}>
                            {card.ty1}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ArrowUpwardIcon sx={{ color: "green", fontSize: "small" }} />
                            <Typography sx={{ fontSize: "small", color: "green" }}>
                              {card.ty2}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          bgcolor={card.col}
                          borderRadius={"50%"}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "60px",
                            width: "60px",
                          }}
                        >
                          {card.icon}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid item lg={7} sm={6}>
                <Paper>
                  <TableContainer
                    sx={{
                      maxHeight: 300,
                      scrollbarWidth: "thin",
                      "&::-webkit-scrollbar": {
                        width: "8px",
                        backgroundColor: "#f5f5f5",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#aaa",
                        borderRadius: "4px",
                      },
                    }}
                    bgcolor={"white"}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            <Typography fontWeight={"bold"}>S/N</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography fontWeight={"bold"}>Team</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography fontWeight={"bold"}>Team Lead</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography fontWeight={"bold"}>Ongoing Projects</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography fontWeight={"bold"}>Process</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.sl_no}>
                            <TableCell align="center">{row.sl_no}</TableCell>
                            <TableCell align="center">{row.team}</TableCell>
                            <TableCell align="center">{row.teamLead}</TableCell>
                            <TableCell align="center">{row.projects}</TableCell>
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <LinearProgress
                                  variant="determinate"
                                  value={row.progress}
                                  sx={{
                                    width: "80px",
                                    borderRadius: "5px",
                                    height: "8px",
                                    backgroundColor: "#161D2E",
                                    "& .MuiLinearProgress-bar": {
                                      backgroundColor: "#4B93E7",
                                    },
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "15px",
                                    color: "#4B93E7",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {row.progress}%
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              <Grid
                item
                lg={5}
                sm={3}
                padding={"15px"}
                sx={{
                  display: "flex",
                  justifyContent: { lg: "center", sm: "flex-start" },
                  marginLeft: { lg: 0, sm: "30px" },
                }}
              >
                <Box
                  sx={{
                    maxHeight: "300px",
                    display: "flex",
                    justifyContent: "center",
                    bgcolor: "white",
                    borderRadius: "15px",
                    border: "1px solid #E0E0E0",
                    width: "500px",
                  }}
                >
                  <div>
                    <Typography variant="h6" align="center" color={"#004E69"}>
                      Project Status
                    </Typography>
                    <PieChart
                      sx={{ marginTop: "-90px", cursor: "pointer" }}
                      series={[
                        {
                          data: data2,
                          width: 500,
                          height: 200,
                          innerRadius: 40,
                          outerRadius: 80,
                        },
                      ]}
                      height={350}
                      width={300}
                      slotProps={{
                        legend: { hidden: false },
                      }}
                    />
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
