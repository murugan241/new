import React from "react";
import {
  Typography,
  IconButton,
  Box,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        height: "80px",
        backgroundColor: "#FFF7F7",
        width: "100%",
        padding: "0 20px",
      }}
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
      <Box sx={{ display: "flex", alignItems: "center", marginLeft: 5, flexGrow: 1 }}>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "20px",
            color: "#000000",
          }}
        >
          Department
        </Typography>
        <IconButton sx={{ marginTop: -1 }}>
          <SettingsIcon />
        </IconButton>
        <TextField
          size="small"
          placeholder="Enter search word"
          sx={{
            flexGrow: 1,
            maxWidth: "300px",
            backgroundColor: "#f9f9f9",
            borderRadius: "1px",
            marginLeft: 2,
          }}
        />
      </Box>
    </Box>
  );
};

const Report = () => {
  const navigate = useNavigate();

  const handleNavigation = (reportType) => {
    switch (reportType) {
      case "Expense Report":
        navigate("/expense");
        break;
      case "Project Report":
        navigate("/project");
        break;
      case "Task Report":
        navigate("/task");
        break;
      case "User Report":
        navigate("/user");
        break;

      case "Attendance Report":
        navigate("/attendancereport");
        break;
      case "Leave Report":
        navigate("/leave_report");
        break;
      case "Daily Report":
        navigate("/daily_report");
        break;
      default:
        break;
    }
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={3} md={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} sm={9} md={10} style={{ padding: "40px" }}>
          <Box sx={{ padding: "20px", flex: 1, overflowY: "auto" }}>
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>
              Reporting
            </Typography>
            <Grid container spacing={4}>
              {[
                "Daily Report",
                "Attendance Report",
                "Project Report",
                "Expense Report",
                "Task Report",
                "User Report",
                "Leave Report",
              ].map((report, index) => (
                <Grid item xs={12} sm={4} md={3} lg={3} key={index}>
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: "95px",
                      backgroundColor: "#253D90",
                      color: "#fff",
                      textTransform: "none",
                      borderRadius: "14px",
                      boxShadow: "11px 4px 14px 0px #0000001F",
                    }}
                    onClick={() => handleNavigation(report)}
                  >
                    {report}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Report;
