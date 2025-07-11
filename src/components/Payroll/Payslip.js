import React from "react";
import {
  Typography,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toWords } from "number-to-words"; // Import a library to convert numbers to words
import logo from "../../assets/cubeaisolutions.jpeg";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Sidebar from "../Common_Bar/Sidebar";

const Payslip = () => {
  const payslipData = {
    company: "CubeAISolutions Tech Pvt Ltd",
    address: "3864 Quiet Valley Lane, ",
    address1: "Bangalore",
    employeeName: "John Doe",
    designation: "Web Designer",
    employeeID: "FT-0007",
    joiningDate: "1 Jan 2013",
    salaryMonth: "February 2019",
    payslipNumber: "49029",
    earnings: [
      { name: "Basic Salary", amount: 6500 },
      { name: "House Rent Allowance (H.R.A.)", amount: 55 },
      { name: "Conveyance", amount: 55 },
      { name: "Other Allowance", amount: 55 },
    ],
    deductions: [
      { name: "Tax Deducted at Source (T.D.S.)", amount: 0 },
      { name: "Provident Fund", amount: 0 },
      { name: "ESI", amount: 0 },
      { name: "Loan", amount: 300 },
    ],
  };

  // Calculate total earnings and total deductions
  const totalEarnings = payslipData.earnings.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = payslipData.deductions.reduce((sum, item) => sum + item.amount, 0);

  // Calculate net salary
  const netSalary = totalEarnings - totalDeductions;

  // Convert net salary to words
  const netSalaryInWords = toWords(netSalary);

  const handleDownloadCSV = () => {
    const csvData = [
      ["Earnings", "Amount"],
      ...payslipData.earnings.map((item) => [item.name, `$${item.amount}`]),
      [],
      ["Deductions", "Amount"],
      ...payslipData.deductions.map((item) => [item.name, `$${item.amount}`]),
      [],
      ["Total Earnings", `$${totalEarnings}`],
      ["Total Deductions", `$${totalDeductions}`],
      ["Net Salary", `$${netSalary} (${netSalaryInWords})`],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "payslip.csv";
    link.click();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Payslip", 14, 20);
    <Grid container spacing={2} style={{ marginTop: 20, marginBottom: 20, alignItems: 'center' }}>
    <Grid item xs={12} style={{ textAlign: 'center' }}>
      <img src={logo} alt="Company Logo" style={{ maxWidth: '200px' }} />
    </Grid>
  </Grid>
    doc.text(`Company: ${payslipData.company}`, 14, 30);
    doc.text(`Address: ${payslipData.address}`, 14, 40);
    doc.text(`Address: ${payslipData.address1}`, 14, 40);
    doc.text(`Employee Name: ${payslipData.employeeName}`, 14, 50);
    doc.text(`Designation: ${payslipData.designation}`, 14, 60);
    doc.text(`Employee ID: ${payslipData.employeeID}`, 14, 70);
    doc.text(`Joining Date: ${payslipData.joiningDate}`, 14, 80);
    doc.text(`Salary Month: ${payslipData.salaryMonth}`, 14, 90);

    autoTable(doc, {
      startY: 100,
      head: [["Earnings", "Amount"]],
      body: payslipData.earnings.map((item) => [item.name, `$${item.amount}`]),
    });
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Deductions", "Amount"]],
      body: payslipData.deductions.map((item) => [item.name, `$${item.amount}`]),
    });
    doc.text(`Total Earnings: $${totalEarnings}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Total Deductions: $${totalDeductions}`, 14, doc.lastAutoTable.finalY + 30);
    doc.text(`Net Salary: $${netSalary} (${netSalaryInWords})`, 14, doc.lastAutoTable.finalY + 40);
    doc.save("payslip.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Grid >
    {/* Navbar */}
    <Grid item xs={12}>
      <Navbar />
    </Grid>

    {/* TopBar */}
    <Grid item xs={12}>
      <TopBar />
    </Grid>

    {/* Sidebar */}
    <Grid item xs={12} sm={3} md={2}>
      <Sidebar />
    </Grid>

  <Box p={3}>
    <h2>Payslip</h2>
    <p>Dashboard / Payslip/ Download Payslip</p>
    <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Button variant="contained" onClick={handleDownloadCSV} sx={{
        backgroundColor: 'white',
        color: 'black',
        border:'1px solid black', 
        '&:hover': {
          backgroundColor: '#f1f1f1', // Optional: hover effect
        },
      }}>
              CSV
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleDownloadPDF} sx={{
        backgroundColor: 'white',
        color: 'black',
        border:'1px solid black',
        '&:hover': {
          backgroundColor: '#f1f1f1', // Optional: hover effect
        },
      }}>
              PDF
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handlePrint} sx={{
        backgroundColor: 'white',
        color: 'black',
        border:'1px solid black',
        '&:hover': {
          backgroundColor: '#f1f1f1', // Optional: hover effect
        },
      }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg>
              Print
            </Button>
          </Grid>
        </Grid>
    
   
    <Card>
      <CardContent>
        {/* Buttons on top-right */}
        
        <p style={{ marginTop: 20, marginBottom: 20, textAlign: 'center',textDecoration:'underline' }}>PAYSLIP FOR THE MONTH OF </p>
        <Grid container spacing={2} style={{ marginTop: 20, marginBottom: 20, alignItems: 'center' }}>
  {/* Left: Logo */}
  <Grid item xs={6} style={{ textAlign: 'left' }}>
    <img src={logo} alt="Company Logo" style={{ maxWidth: '200px' }} />
  </Grid>

  {/* Right: Payslip Details */}
  <Grid item xs={6} style={{ textAlign: 'right' }}>
    <Typography variant="h6">PAYSLIP #{payslipData.payslipNumber}</Typography>
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <ul
        style={{
          listStyleType: 'disc',
          padding: 0,
          margin: 0,
          textAlign: 'right', // Ensures alignment of the list
          display: 'inline-block',
        }}
      >
        <li style={{ display: 'inline-block', textAlign: 'right' }}>
          <li component="span">Salary Month: {payslipData.salaryMonth}</li>
        </li>
      </ul>
    </div>
  </Grid>
</Grid>

        {/* Company Information as List */}
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={6}>
            <ul>
              <li>{payslipData.company}</li>
              <li>{payslipData.address}</li>
              <li>{payslipData.address1}</li>
            </ul>
            <Typography variant="body1"></Typography>
            
            <ul>
            <h4>{payslipData.employeeName}</h4>
            <p>{payslipData.designation}</p>
              <li>Employee ID: {payslipData.employeeID}</li>
              <li>Joining Date: {payslipData.joiningDate}</li>
            </ul>
          </Grid>
          
        </Grid>

        {/* Earnings Table */}
        <Grid container spacing={2} style={{ marginTop: 20 ,marginLeft:'1px'}}>
          {/* Left Side for Earnings Table */}
          <Grid item xs={6}>
            <Typography variant="h6">Earnings</Typography>
            <Table sx={{ border: "2px solid gray", borderCollapse: "collapse" }}>
              <TableBody>
                {payslipData.earnings.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: "2px solid gray", // Ensure all rows have the same border color
                    }}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{`$${item.amount}`}</TableCell>
                  </TableRow>
                ))}
                {/* Add Total Earnings Row */}
                <TableRow sx={{ borderTop: "2px solid gray" }}>
                  <TableCell><strong>Total Earnings</strong></TableCell>
                  <TableCell>{`$${totalEarnings}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          {/* Right Side for Deductions Table */}
          <Grid item xs={6}>
            
            <Typography variant="h6">Deductions</Typography>
            <Table sx={{ border: "2px solid gray", borderCollapse: "collapse" }}>
              <TableBody>
                {payslipData.deductions.map((item, index) => (
                  <TableRow key={index} sx={{ borderBottom: "2px solid gray" }}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{`$${item.amount}`}</TableCell>
                  </TableRow>
                ))}
                {/* Add Total Deductions Row */}
                <TableRow sx={{ borderTop: "2px solid gray" }}>
                  <TableCell><strong>Total Deductions</strong></TableCell>
                  <TableCell>{`$${totalDeductions}`}</TableCell>
                </TableRow>
                {/* Add Net Salary Row */}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Typography variant="h6" style={{ marginTop: 10 }}>
         <b> Net Salary: ${netSalary}</b> ({netSalaryInWords})
        </Typography>
      </CardContent>
    </Card>
    </Box>
    </Grid>
  );
};

export default Payslip;
