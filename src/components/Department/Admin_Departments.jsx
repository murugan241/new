import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentCounts, setDepartmentCounts] = useState({});

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/departments');
        const data = await response.json();
        setDepartments(data.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchDepartmentCounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/staffs/department-counts');
        const data = await response.json();
        const counts = data.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {});
        setDepartmentCounts(counts);
      } catch (error) {
        console.error('Error fetching department counts:', error);
      }
    };

    fetchDepartments();
    fetchDepartmentCounts();
  }, []);

  const sortedDepartments = [...departments].sort((a, b) =>
    a.departmentName.localeCompare(b.departmentName)
  );

  return (
    <Grid container sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
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
        <Grid
          item
          xs={12}
          sm={9}
          md={10}
          sx={{
            padding: { xs: 2, sm: 3 },
            overflowY: "auto",
            backgroundColor: '#f5f5f5',
          }}
        >
          <Grid container spacing={3}>
            {sortedDepartments.map((dept, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  sx={{
                    backgroundColor: "#FFF7F7",
                    height: "170px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: "10px",
                    boxShadow: 3,
                    padding: 2,
                  }}
                >
                  <CardContent>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography
                          sx={{
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#333",
                          }}
                        >
                          {dept.departmentName}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <IconButton>
                          <MoreHorizOutlinedIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ marginTop: "auto", paddingX: 2 }}>
                    <Button
                      sx={{
                        backgroundColor: "#005366",
                        color: "#fff",
                        width: "100%",
                        textTransform: "none",
                        borderRadius: "10px",
                        "&:hover": {
                          backgroundColor: "#003d4d",
                        },
                      }}
                    >
                      <Typography>
                        {departmentCounts[dept.departmentName] || 0} Employee{(departmentCounts[dept.departmentName] || 0) !== 1 ? "s" : ""}
                      </Typography>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AdminDepartments;
