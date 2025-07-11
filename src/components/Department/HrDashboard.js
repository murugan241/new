import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Assignment,
  CalendarToday,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { Divider } from '@mui/material';
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

const Dashboard = () => {
  // Sample data
  const totalEmployees = 560;
  const totalApplicants = 1050;
  const todayAttendance = 470;
  const totalProjects = 250;

  // Sample schedule data
  const schedule = [
    { date: '06 July 2023', time: '09:30', title: 'UI/UX Designer', description: 'Practical Task Review' },
    { date: '06 July 2023', time: '12:00', title: 'Magento Developer', description: 'Resume Review' },
    { date: '06 July 2023', time: '01:30', title: 'Sales Manager', description: 'Final HR Round' },
    { date: '07 July 2023', time: '09:30', title: 'Front end Developer', description: 'Practical Task Review' },
    { date: '07 July 2023', time: '11:00', title: 'React JS', description: 'TL Meeting' },
  ];

  // Sample attendance overview data
  const attendanceOverview = [
    { day: 'Mon', value: 75 },
    { day: 'Tue', value: 85 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 80 },
    { day: 'Fri', value: 95 },
    { day: 'Sat', value: 60 },
    { day: 'Sun', value: 50 },
  ];

  // Sample attendance details
  const attendanceDetails = [
    { name: 'Leasie Watson', designation: 'Team Lead - Design', type: 'Office', checkInTime: '09:27 AM', status: 'On Time' },
    { name: 'Darlene Robertson', designation: 'Web Designer', type: 'Office', checkInTime: '10:15 AM', status: 'Late' },
    { name: 'Jacob Jones', designation: 'Medical Assistant', type: 'Remote', checkInTime: '10:24 AM', status: 'Late' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <TopBar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Box sx={{ width: { xs: '100%', md: '250px' }, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          <Sidebar />
        </Box>
        <Box sx={{ flex: 1, backgroundColor: '#f5f5f5', padding: { xs: 2, md: 3 }, overflow: 'auto' }}>
          <Typography variant="h6" sx={{ color: '#666', marginBottom: 2, fontSize: '14px' }}>
            Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <People sx={{ fontSize: 50, color: '#9c27b0' }} />
                <Typography variant="h5">{totalEmployees}</Typography>
                <Typography color="textSecondary">Total Employee</Typography>
                <Typography variant="body2">Update July 16, 2023</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 50, color: '#3f51b5' }} />
                <Typography variant="h5">{totalApplicants}</Typography>
                <Typography color="textSecondary">Total Applicant</Typography>
                <Typography variant="body2">Update July 14, 2023</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 50, color: '#4caf50' }} />
                <Typography variant="h5">{todayAttendance}</Typography>
                <Typography color="textSecondary">Today Attendance</Typography>
                <Typography variant="body2">Update July 14, 2023</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 50, color: '#ff5722' }} />
                <Typography variant="h5">{totalProjects}</Typography>
                <Typography color="textSecondary">Total Projects</Typography>
                <Typography variant="body2">Update July 10, 2023</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Attendance Overview</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: 200 }}>
                  {attendanceOverview.map((day, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{ height: `${day.value}%`, width: 30, backgroundColor: '#3f51b5', borderRadius: '10px 10px 0 0' }} />
                      <Typography variant="caption">{day.day}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>Attendance Details</Typography>
                <List>
                  {attendanceDetails.map((detail, index) => (
                    <ListItem key={index}>
                      <Avatar sx={{ mr: 2 }} />
                      <ListItemText
                        primary={detail.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {detail.designation}
                            </Typography>
                            <br />
                            {`${detail.type} — ${detail.checkInTime} — ${detail.status}`}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>My Schedule</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">July 2023</Typography>
                </Box>
                <List>
                  {schedule.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={item.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {item.time} {item.description}
                              </Typography>
                              <br />
                              {item.date}
                            </>
                          }
                        />
                      </ListItem>
                      {index < schedule.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
