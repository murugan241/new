import React, { useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Tab,
	Tabs,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	IconButton,
	TablePagination,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	MenuItem,
	Select,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Sidebar from "../Common_Bar/Sidebar";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";
import Apraisal from "./ApraisalOrganization";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CloseIcon from "@mui/icons-material/Close";

const PerformanceAppraisal = () => {
	const [tabValue, setTabValue] = React.useState(0);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [open, setOpen] = useState(false); // For dialog
	const [trainers, setTrainers] = useState([]);
	const [employees, setEmployees] = useState([]); // Empty array for original data

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleOpenDialog = () => {
		setOpen(true);
	};

	const handleCloseDialog = () => {
		setOpen(false);
	};

	const handleStatusChange = (index, newStatus) => {
		const updatedEmployees = [...employees];
		updatedEmployees[index].status = newStatus;
		setEmployees(updatedEmployees);
	};

	return (
		<Box>
			{/* Header Components */}
			<Navbar />
			<TopBar />

			{/* Main Layout */}
			<Box display="flex">
				{/* Sidebar */}
				<Sidebar />

				{/* Page Content */}
				<Box
					sx={{
						paddingTop: 2,
						paddingLeft: 4, // Add space between sidebar and content
						flexGrow: 1, // Ensure content takes remaining space
						overflow: "auto",
					}}
				>
					{/* Conditional Content Rendering Based on Tab Selection */}
					{tabValue === 0 && (
						<Box
							sx={{
								paddingTop: 2,
								flexGrow: 1, // Ensure content takes remaining space
								overflow: "auto",
							}}
						>
							{/* Title */}
							<Typography variant="h5" gutterBottom>
								Performance Indicator
							</Typography>
							<Typography
								variant="subtitle2"
								color="textSecondary"
								gutterBottom
							>
								Configuration / Performance / Performance Indicator
							</Typography>

							{/* Tabs */}
                            <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
>
<Tabs
  value={tabValue}
  onChange={handleTabChange}
  textColor="inherit" // Inherit text color
  indicatorColor="transparent" // Remove the indicator line
  sx={{ marginBottom: 3 }}
>
  <Tab
    label="Performance Indicator"
    sx={{
      border: "1px solid #ccc",
      width: "240px",
      height: "46px",
      borderRadius: "8px",
      textAlign: "center",
      textDecoration: "none", // Remove underline
      color: tabValue === 0 ? 'white' : '#004E69', // White text for selected tab
      backgroundColor: tabValue === 0 ? "#004E69" : "transparent", // Set background color for selected tab
      "&:hover": {
        backgroundColor: tabValue === 0 ? "#004E69" : "transparent", // Change background color on hover
      },
    }}
  />
  <Tab
    label="Performance Appraisal"
    sx={{
      border: "1px solid #ccc",
      width: "240px",
      height: "46px",
      borderRadius: "8px",
      textAlign: "center",
      ml: 2,
      textDecoration: "none", // Remove underline
      color: tabValue === 1 ? 'white' : '#004E69', // White text for selected tab
      backgroundColor: tabValue === 1 ? "#004E69" : "transparent", // Set background color for selected tab
      "&:hover": {
        backgroundColor: tabValue === 1 ? "#004E69" : "transparent", // Change background color on hover
      },
    }}
  />
</Tabs>

  {/* Add Button aligned to the right */}
  
</Box>

							{/* Search Bar */}
							<Box display="flex" gap={2} alignItems="center" marginBottom={3}>
								<TextField
									label="Employee Name"
									variant="outlined"
									size="small"
								/>
								<TextField
									label="Department Name"
									variant="outlined"
									size="small"
								/>
								<TextField
									label="From"
									type="date"
									variant="outlined"
									size="small"
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label="To"
									type="date"
									variant="outlined"
									size="small"
									InputLabelProps={{ shrink: true }}
								/>
								<Button variant="contained" color="success">
									Search
								</Button>
							</Box>

							{/* Table */}
							<TableContainer component={Paper}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Employee Name</TableCell>
											<TableCell>Created At</TableCell>
											<TableCell>Department</TableCell>
											<TableCell>Added By</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Action</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{employees.length === 0 ? (
											<TableRow>
												<TableCell colSpan={6} align="center">
													No data available
												</TableCell>
											</TableRow>
										) : (
											employees.map((employee, index) => (
												<TableRow key={index}>
													<TableCell>{employee.name}</TableCell>
													<TableCell>{employee.createdAt}</TableCell>
													<TableCell>{employee.department}</TableCell>
													<TableCell>
														<Chip
															label={employee.addedBy}
															color="primary"
															size="small"
															sx={{
																backgroundColor: "transparent", // Remove background color
																border: "1px solid #ccc", // Add a border
																textTransform: "uppercase", // To make the text consistent in styling
																padding: "2px 10px",
																color:"black"
															}}
														/>
													</TableCell>
													<TableCell>
														<Select
															value={employee.status}
															onChange={(e) =>
																handleStatusChange(index, e.target.value)
															}
															sx={{
																borderRadius: "20px",
																width: "200px",
															}}
														>
															<MenuItem value="Active">
																<Box display={"flex"}>
																	<RadioButtonCheckedIcon
																		style={{ color: "red" }}
																	/>
																	<Typography>Active</Typography>
																</Box>
															</MenuItem>
															<MenuItem value="Inactive">
																<Box display={"flex"}>
																	<RadioButtonCheckedIcon
																		style={{ color: "red" }}
																	/>{" "}
																	<Typography>Inactive</Typography>
																</Box>
															</MenuItem>
														</Select>
													</TableCell>
													<TableCell>
														<IconButton>
															<MoreVertIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</TableContainer>

							{/* Pagination */}
							<TablePagination
								component="div"
								count={employees.length}
								page={page}
								rowsPerPage={rowsPerPage}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Box>
					)}

					{tabValue === 1 && (
						<Box
							sx={{
								paddingTop: 2,
								flexGrow: 1, // Ensure content takes remaining space
								overflow: "auto",
							}}
						>
							{/* Title */}
							<Typography variant="h5" gutterBottom>
								Performance Appraisal
							</Typography>
							<Typography
								variant="subtitle2"
								color="textSecondary"
								gutterBottom
							>
								Configuration / Performance / Performance Appraisal
							</Typography>

							{/* Tabs and Add Button */}
                            <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
>
<Tabs
  value={tabValue}
  onChange={handleTabChange}
  textColor="inherit" // Inherit text color
  indicatorColor="transparent" // Remove the indicator line
  sx={{ marginBottom: 3 }}
>
  <Tab
    label="Performance Indicator"
    sx={{
      border: "1px solid #ccc",
      width: "240px",
      height: "46px",
      borderRadius: "8px",
      textAlign: "center",
      textDecoration: "none", // Remove underline
      color: tabValue === 0 ? 'white' : '#004E69', // White text for selected tab
      backgroundColor: tabValue === 0 ? "#004E69" : "transparent", // Set background color for selected tab
      "&:hover": {
        backgroundColor: tabValue === 0 ? "#004E69" : "transparent", // Change background color on hover
      },
    }}
  />
  <Tab
    label="Performance Appraisal"
    sx={{
      border: "1px solid #ccc",
      width: "240px",
      height: "46px",
      borderRadius: "8px",
      textAlign: "center",
      ml: 2,
      textDecoration: "none", // Remove underline
      color: tabValue === 1 ? 'white' : '#004E69', // White text for selected tab
      backgroundColor: tabValue === 1 ? "#004E69" : "transparent", // Set background color for selected tab
      "&:hover": {
        backgroundColor: tabValue === 1 ? "#004E69" : "transparent", // Change background color on hover
      },
    }}
  />
</Tabs>

  {/* Add Button aligned to the right */}
  <Button
    variant="contained"
    color="primary"
    onClick={handleOpenDialog}
    sx={{
      marginLeft: "auto", // Align the button to the right
      backgroundColor: "#FF902F",
    }}
  >
    Add
  </Button>
</Box>

							<Dialog open={open} onClose={handleCloseDialog} maxWidth="md">
								<DialogTitle>Performance Appraisal Form
                                <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            style={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
                                </DialogTitle>
								<DialogContent sx={{ width: "788px", height: "960px" }}>
									{/* Render the Existing Page Here */}
									<Apraisal />
								</DialogContent>
								<DialogActions>
									<DialogActions>
										<Button variant="contained"
											sx={{
												backgroundColor: "#FF902F",
												color: "white",
												margin: "0 auto",
												display: "block",
											}}
											onClick={handleCloseDialog}
										>
											Submit
										</Button>
									</DialogActions>
								</DialogActions>
							</Dialog>

							{/* Performance Appraisal Content */}
							<Box display="flex" gap={2} alignItems="center" marginBottom={3}>
								<TextField
									label="Employee Name"
									variant="outlined"
									size="small"
								/>
								<TextField
									label="Department Name"
									variant="outlined"
									size="small"
								/>
								<TextField
									label="From"
									type="date"
									variant="outlined"
									size="small"
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label="To"
									type="date"
									variant="outlined"
									size="small"
									InputLabelProps={{ shrink: true }}
								/>
								<Button variant="contained" color="success">
									Search
								</Button>
							</Box>

							{/* Example: Table for Performance Appraisal */}
							<TableContainer component={Paper}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Employee Name</TableCell>
											<TableCell>Created At</TableCell>
											<TableCell>Department</TableCell>
											<TableCell>Added By</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Action</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{employees.length === 0 ? (
											<TableRow>
												<TableCell colSpan={6} align="center">
													No data available
												</TableCell>
											</TableRow>
										) : (
											employees
												.slice(
													page * rowsPerPage,
													page * rowsPerPage + rowsPerPage
												)
												.map((employee, index) => (
													<TableRow key={index}>
														<TableCell>{employee.name}</TableCell>
														<TableCell>{employee.createdAt}</TableCell>
														<TableCell>{employee.department}</TableCell>
														<TableCell>
															<Chip
																label={employee.addedBy}
																color="primary"
																size="small"
																sx={{
																	backgroundColor: "transparent", // Remove background color
																	border: "1px solid #ccc", // Add a border
																	textTransform: "uppercase", // To make the text consistent in styling
																	padding: "2px 10px",
																	color:"black"
																}}
															/>
														</TableCell>
														<TableCell>
															<Select
																value={employee.status}
																onChange={(e) =>
																	handleStatusChange(index, e.target.value)
																}
																sx={{
																	borderRadius: "20px",
																	width: "200px",
																}}
															>
																<MenuItem value="Active">
																	<Box display={"flex"}>
																		<RadioButtonCheckedIcon
																			style={{ color: "red" }}
																		/>
																		<Typography>Active</Typography>
																	</Box>
																</MenuItem>
																<MenuItem value="Inactive">
																	<Box display={"flex"}>
																		<RadioButtonCheckedIcon
																			style={{ color: "red" }}
																		/>{" "}
																		<Typography>Inactive</Typography>
																	</Box>
																</MenuItem>
															</Select>
														</TableCell>
														<TableCell>
															<IconButton>
																<MoreVertIcon />
															</IconButton>
														</TableCell>
													</TableRow>
												))
										)}
									</TableBody>
								</Table>
							</TableContainer>

							{/* Pagination */}
							<TablePagination
								component="div"
								count={employees.length}
								page={page}
								rowsPerPage={rowsPerPage}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default PerformanceAppraisal;