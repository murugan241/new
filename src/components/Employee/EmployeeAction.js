import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const projectStatus = [
    { no: 1, day: "Monday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Pending", hours: "10h2m" },
    { no: 2, day: "Tuesday", date: "17/07/2024", checkIn: "00:00", checkOut: "00:00", status: "Approved", hours: "0m" },
    { no: 3, day: "Wednesday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Rejected", hours: "10h2m" },
    { no: 4, day: "Thursday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Pending", hours: "10h2m" },
    { no: 5, day: "Friday", date: "17/07/2024", checkIn: "10:30", checkOut: "18:00", status: "Approved", hours: "8h30m" },
    { no: 6, day: "Saturday", date: "17/07/2024", checkIn: "00:00", checkOut: "00:00", status: "Rejected", hours: "0m" },
    { no: 7, day: "Sunday", date: "17/07/2024", checkIn: "00:00", checkOut: "00:00", status: "Pending", hours: "0m" },
    { no: 8, day: "Monday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Approved", hours: "10h2m" },
    { no: 9, day: "Tuesday", date: "17/07/2024", checkIn: "10:30", checkOut: "18:00", status: "Rejected", hours: "8h30m" },
    { no: 10, day: "Wednesday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Pending", hours: "10h2m" },
  ];


const employeeTable = [
    { no: 1, day: "Monday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Work from home", hours: "10h2m" },
    { no: 2, day: "Tuesday", date: "17/07/2024", checkIn: "00:00", checkOut: "00:00", status: "Absent", hours: "0m" },
    { no: 3, day: "Wednesday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Work from office", hours: "10h2m" },
    { no: 4, day: "Thursday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Work from home", hours: "10h2m" },
    { no: 5, day: "Friday", date: "17/07/2024", checkIn: "10:30", checkOut: "18:00", status: "Work from office", hours: "8h30m" },
    { no: 6, day: "Saturday", date: "17/07/2024", checkIn: "00:00", checkOut: "00:00", status: "Absent", hours: "0m" },
    { no: 7, day: "Sunday", date: "17/07/2024", checkIn: "00:00", checkOut: "00:00", status: "Absent", hours: "0m" },
    { no: 8, day: "Monday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Work from home", hours: "10h2m" },
    { no: 9, day: "Tuesday", date: "17/07/2024", checkIn: "10:30", checkOut: "18:00", status: "Work from office", hours: "8h30m" },
    { no: 10, day: "Wednesday", date: "17/07/2024", checkIn: "9:00", checkOut: "18:00", status: "Work from home", hours: "10h2m" },
  ];
// Aggregate the data by status for employeeTable
const aggregateData = employeeTable.reduce((acc, entry) => {
  if (acc[entry.status]) {
    acc[entry.status]++;
  } else {
    acc[entry.status] = 1;
  }
  return acc;
}, {});

const data = Object.keys(aggregateData).map(status => ({
  name: status,
  value: aggregateData[status],
}));

// Aggregate the data by status for projectStatus
const aggregateData2 = projectStatus.reduce((acc, entry) => {
  if (acc[entry.status]) {
    acc[entry.status]++;
  } else {
    acc[entry.status] = 1;
  }
  return acc;
}, {});

const data2 = Object.keys(aggregateData2).map(status => ({
  name: status,
  value: aggregateData2[status],
}));

const COLORS = ['#004E69', '#F29425', '#E54F53', '#00C49F'];



const EmployeeAction = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: '50px', fontFamily: 'Lato, sans-serif',mb:10}}>
      <Grid item>
        <Container 
          style={{ 
            width: '450px', 
            height: '300px', 
            border: '1px solid black',
            backgroundColor: 'transparent',
            fontFamily: 'Lato, sans-serif',
          }}
        >
          <Typography variant="h6" gutterBottom style={{ fontFamily: 'Lato, sans-serif' }}>
            Attendance Status
          </Typography>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie 
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Container>
      </Grid>
      <Grid item>
        <Container 
          style={{ 
            width: '450px', 
            height: '300px', 
            border: '1px solid black',
            backgroundColor: 'transparent',
            fontFamily: 'Lato, sans-serif',
          }}
        >
          <Typography variant="h6" gutterBottom style={{ fontFamily: 'Lato, sans-serif' }}>
            Project Status
          </Typography>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie 
                data={data2}
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data2.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Container>
      </Grid>
    </Grid>
  );
};

export default EmployeeAction;
