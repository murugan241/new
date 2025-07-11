import React, { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  Slider,
  TextField,
  Typography,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Link, useNavigate } from 'react-router-dom';
import Img from "../../assets/Congratulations.jpg";
import Sidebar from '../Common_Bar/Sidebar';
import Navbar from '../Common_Bar/NavBar';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '5px',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const EmployeeAdd = () => {
  // Form state
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [designation, setDesignation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [number, setNumber] = useState("");
  const [staffId, setStaffId] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [departmentName, setDepartmentName] = useState("");

  // Work Information state
  const [workAddress, setWorkAddress] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [timeZone, setTimeZone] = useState("");

  // Private Information state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [privateEmail, setPrivateEmail] = useState("");
  const [privatePhone, setPrivatePhone] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankIFSC, setBankIFSC] = useState("");
  const [nationality, setNationality] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [aadharCardNo, setAadharCardNo] = useState("");
  const [panCardNo, setPanCardNo] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [certificateLevel, setCertificateLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [school, setSchool] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [numberOfDependentChildren, setNumberOfDependentChildren] = useState("");
  const [visaNo, setVisaNo] = useState("");
  const [workPermitNo, setWorkPermitNo] = useState("");
  const [visaExpirationDate, setVisaExpirationDate] = useState("");

  // Settings state
  const [employeeType, setEmployeeType] = useState("");
  const [relatedUser, setRelatedUser] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [badgeId, setBadgeId] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openResumeModal, setOpenResumeModal] = useState(false);
  const [openSkillsModal, setOpenSkillsModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenResumeModal = () => setOpenResumeModal(true);
  const handleCloseResumeModal = () => setOpenResumeModal(false);
  const handleOpenSkillsModal = () => setOpenSkillsModal(true);
  const handleCloseSkillsModal = () => setOpenSkillsModal(false);
  const handleChange = (event) => setGender(event.target.value);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload only JPG, JPEG, or PNG files.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("File size should be less than 2MB.");
        return;
      }
      setPhotoFile(file);
      setPhoto(URL.createObjectURL(file));
      setError("");
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPhoneNumber(numericValue);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setNumber(numericValue);
  };

  const addStaffToDatabase = async (formData) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = `${API_URL}/api/staffs/add`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        let errorMessage = 'Failed to add staff';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding staff:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !gender || !number || !role || !designation || !staffId || !officialEmail) {
      setError("Please enter all the details.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !emailRegex.test(officialEmail)) {
      setError("Please enter valid email addresses.");
      return;
    }
    if (phoneNumber.length < 10 || number.length < 10) {
      setError("Phone numbers should be at least 10 digits.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('phone', phoneNumber);
      formData.append('altPhone', number);
      formData.append('gender', gender);
      formData.append('role', role);
      formData.append('designation', designation);
      formData.append('staffId', staffId);
      formData.append('officialEmail', officialEmail);
      formData.append('employeeType', employeeType);
      formData.append('relatedUser', relatedUser);
      formData.append('pinCode', pinCode);
      formData.append('badgeId', badgeId);
      formData.append('workAddress', workAddress);
      formData.append('workLocation', workLocation);
      formData.append('workingHours', workingHours);
      formData.append('timeZone', timeZone);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('country', country);
      formData.append('privateEmail', privateEmail);
      formData.append('privatePhone', privatePhone);
      formData.append('bankAccountNo', bankAccountNo);
      formData.append('bankIFSC', bankIFSC);
      formData.append('nationality', nationality);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('placeOfBirth', placeOfBirth);
      formData.append('aadharCardNo', aadharCardNo);
      formData.append('panCardNo', panCardNo);
      formData.append('emergencyContactName', emergencyContactName);
      formData.append('certificateLevel', certificateLevel);
      formData.append('fieldOfStudy', fieldOfStudy);
      formData.append('school', school);
      formData.append('maritalStatus', maritalStatus);
      formData.append('numberOfDependentChildren', numberOfDependentChildren);
      formData.append('visaNo', visaNo);
      formData.append('workPermitNo', workPermitNo);
      formData.append('visaExpirationDate', visaExpirationDate);
      formData.append('departmentName', departmentName);

      if (photoFile) {
        formData.append('photo', photoFile);
      }
      const result = await addStaffToDatabase(formData);
      handleOpen();
    } catch (error) {
      setError(error.message || "Failed to add staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/employee");
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setNumber("");
    setGender("");
    setRole("");
    setDesignation("");
    setStaffId("");
    setOfficialEmail("");
    setPhoto(null);
    setPhotoFile(null);
    setError("");
    setWorkAddress("");
    setWorkLocation("");
    setWorkingHours("");
    setTimeZone("");
    setEmployeeType("");
    setRelatedUser("");
    setPinCode("");
    setBadgeId("");
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setPrivateEmail("");
    setPrivatePhone("");
    setBankAccountNo("");
    setBankIFSC("");
    setNationality("");
    setDateOfBirth("");
    setPlaceOfBirth("");
    setAadharCardNo("");
    setPanCardNo("");
    setEmergencyContactName("");
    setCertificateLevel("");
    setFieldOfStudy("");
    setSchool("");
    setMaritalStatus("");
    setNumberOfDependentChildren("");
    setVisaNo("");
    setWorkPermitNo("");
    setVisaExpirationDate("");
    setDepartmentName("");
  };

  return (
    <Grid container bgcolor={'#E5F1FF'} sx={{ height: '100vh', overflowY: "auto" }}>
      <Grid item lg={12} xs={12}>
        <Navbar />
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={12}>
        <Sidebar />
      </Grid>
      <Grid item lg={10} md={10} sm={10} xs={12} bgcolor={'#E5F1FF'}>
        <Grid container spacing={4} padding={3} sx={{ ml: -2, mt: 0.1 }}>
          <Link to='/employee'>
            <Button sx={{
              width: "100px",
              height: "40px",
              ":focus": { outline: "transparent" },
              ":active": { background: "transparent", bgcolor: "#E5F1FF" }
            }}>
              <Typography sx={{
                fontWeight: "500",
                fontSize: "16px",
                lineHeight: "24px",
                color: "linear-gradient(135deg, #14ADD6 0%, #384295 100%)",
                textTransform: "none"
              }}>
                <KeyboardArrowLeftIcon sx={{ verticalAlign: "middle" }} />Back
              </Typography>
            </Button>
          </Link>
          <Card sx={{
            padding: "20px",
            borderRadius: '10px',
            width: { xs: "100%", sm: "100%" },
            border: '1px solid #E8E8E8',
            marginTop: '20px',
            height: 'auto',
            maxWidth: '95%',
            mx: 'auto',
          }}>
            <Typography sx={{
              width: "157px",
              height: "27px",
              mt: "20px",
              ml: "30px",
              fontFamily: "Nunito",
              fontWeight: "800",
              fontSize: "20px",
              lineHeight: "27.28px",
              color: "#000000"
            }}>
              Add a New Staff
            </Typography>
            <Grid container spacing={3} sx={{ mt: '40px' }}>
              <Grid item xs={12} md={5}>
                <Paper elevation={0} sx={{
                  height: { sm: "100%", md: "100%", lg: '90%' },
                  width: { md: "80%", lg: '80%' },
                  border: "0.5px solid #E8E8E8",
                  borderRadius: "10px",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  ml: '40px',
                  maxWidth: '300px',
                }}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Box sx={{
                      width: { xs: '75px', sm: '130px', lg: '150px' },
                      height: { xs: '75px', sm: '130px', lg: '150px' },
                      borderRadius: '50%',
                      background: '#F2F2F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      <IconButton
                        onClick={handleUploadClick}
                        sx={{
                          position: 'absolute',
                          zIndex: 1,
                          color: '#A3A3A3',
                        }}
                      >
                        <AddAPhotoIcon />
                      </IconButton>
                      {photo && (
                        <img
                          src={photo}
                          alt="Uploaded"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                          }}
                        />
                      )}
                    </Box>
                    <Button
                      variant="text"
                      onClick={handleUploadClick}
                      sx={{
                        position: 'absolute',
                        bottom: '35px',
                        color: '#515151',
                        textTransform: 'none',
                        zIndex: 1,
                        ':hover': { background: 'transparent' },
                        ':active': { background: 'transparent' },
                        padding: 0,
                        border: 'none',
                      }}
                    >
                      <Typography sx={{
                        fontFamily: 'Lato',
                        fontWeight: '400',
                        fontSize: '14px',
                        ml: 1
                      }}>
                        Upload Photo
                      </Typography>
                    </Button>
                  </Box>
                  <Typography sx={{
                    width: "156px",
                    height: "48px",
                    mt: "50px",
                    fontWeight: "400",
                    fontSize: "14px",
                    color: "#777777",
                    textTransform: "none",
                    textAlign: "center"
                  }}>
                    Allowed format <br /><span style={{ color: "black" }}>JPG, JPEG, and PNG</span>
                  </Typography>
                  <Typography sx={{
                    width: "126px",
                    height: "48px",
                    mt: "40px",
                    fontWeight: "400",
                    fontSize: "14px",
                    color: "#777777",
                    textTransform: "none",
                    textAlign: "center"
                  }}>
                    Max file size<br /><span style={{ color: "black" }}>2MB</span>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={7}>
                {error && (
                  <Alert severity="error" sx={{ width: "83%", marginBottom: "20px", ml: 4, mt: -10 }}>
                    {error}
                  </Alert>
                )}
                <Grid container spacing={3}>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      First name
                    </Typography>
                    <TextField
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px",  }}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Last name
                    </Typography>
                    <TextField
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter Last name"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px",  }}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Email Address
                    </Typography>
                    <TextField
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px", }}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Phone Number
                    </Typography>
                    <TextField
                      type='tel'
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="Enter phone number"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px",  }}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Gender
                    </Typography>
                    <FormControl sx={{ width: "100%", mt: "10px" }}>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={gender}
                        onChange={handleChange}
                        sx={{ height: "50px", borderRadius: "10px", }}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Alternative Number
                    </Typography>
                    <TextField
                      type='tel'
                      value={number}
                      onChange={handleNumberChange}
                      placeholder="Enter phone number"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px", }}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Role
                    </Typography>
                    <TextField
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Enter Role"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px", }}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Designation
                    </Typography>
                    <TextField
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Enter Designation"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px",  }}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Department Name
                    </Typography>
                    <TextField
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      placeholder="Enter Department Name"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px",  }}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Staff ID
                    </Typography>
                    <TextField
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      placeholder="Enter Staff ID"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px",  }}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography sx={{ fontWeight: "500", fontSize: "14px", color: "#121212" }}>
                      Official Mail
                    </Typography>
                    <TextField
                      type="email"
                      value={officialEmail}
                      onChange={(e) => setOfficialEmail(e.target.value)}
                      placeholder="Enter official email"
                      sx={{ width: "100%", height: "50px", mt: "10px", borderRadius: "10px", }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '20px', mb: "20px" }}>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                variant='contained'
                sx={{
                  width: "293px",
                  height: "46px",
                  background: "#004E69",
                  ml: "40px",
                  borderRadius: "10px",
                  padding: "10px",
                  ":hover": { background: "#004E69" },
                  ":disabled": { background: "#ccc" }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Typography sx={{
                    width: "88px",
                    height: "24px",
                    fontFamily: "Lato",
                    fontWeight: "700",
                    fontSize: "14px",
                    lineHeight: "24px",
                    textTransform: "none"
                  }}>
                    Add Staff
                  </Typography>
                )}
              </Button>
              <Button
                onClick={resetForm}
                variant='outlined'
                sx={{
                  width: "150px",
                  height: "46px",
                  ml: "20px",
                  borderRadius: "10px",
                  borderColor: "#004E69",
                  color: "#004E69",
                  ":hover": { borderColor: "#004E69", background: "rgba(0,78,105,0.1)" }
                }}
              >
                <Typography sx={{
                  fontFamily: "Lato",
                  fontWeight: "700",
                  fontSize: "14px",
                  textTransform: "none"
                }}>
                  Reset Form
                </Typography>
              </Button>
            </Box>
            <Box sx={{ width: '100%', mt: 4 }}>
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="Resume" />
                <Tab label="Work Information" />
                <Tab label="Private Information" />
                <Tab label="Setting" />
              </Tabs>
              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6">Resume</Typography>
                      <Typography>There are no resume lines on this employee. Why not add a new one?</Typography>
                      <Button variant="contained" sx={{ mt: 2, backgroundColor: '#004E69' }} onClick={handleOpenResumeModal}>
                        Create New Entry
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6">Skills</Typography>
                      <Typography>You can add skills from our library to the employee profile. If skills are missing.</Typography>
                      <Button variant="contained" sx={{ mt: 2, backgroundColor: '#004E69' }} onClick={handleOpenSkillsModal}>
                        Pick a Skill from a list
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6">Work Information</Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Typography>Work Address</Typography>
                        <TextField
                          value={workAddress}
                          onChange={(e) => setWorkAddress(e.target.value)}
                          placeholder="Enter Work Address"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Work Location</Typography>
                        <TextField
                          value={workLocation}
                          onChange={(e) => setWorkLocation(e.target.value)}
                          placeholder="Enter Work Location"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Working Hours</Typography>
                        <TextField
                          value={workingHours}
                          onChange={(e) => setWorkingHours(e.target.value)}
                          placeholder="Enter Working Hours"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Time Zone</Typography>
                        <TextField
                          value={timeZone}
                          onChange={(e) => setTimeZone(e.target.value)}
                          placeholder="Enter Time Zone"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button variant="contained" sx={{ backgroundColor: '#004E69' }}>
                        Save Work Information
                      </Button>
                    </Box>
                  </Box>
                )}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6">Private Information</Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Typography>Address</Typography>
                        <TextField
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter Address"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>City</Typography>
                        <TextField
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Enter City"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>State</Typography>
                        <TextField
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Enter State"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Country</Typography>
                        <TextField
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Enter Country"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Email Id</Typography>
                        <TextField
                          type="email"
                          value={privateEmail}
                          onChange={(e) => setPrivateEmail(e.target.value)}
                          placeholder="Enter Email Id"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Phone No</Typography>
                        <TextField
                          type="tel"
                          value={privatePhone}
                          onChange={(e) => setPrivatePhone(e.target.value)}
                          placeholder="Enter Phone No"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Bank Account No</Typography>
                        <TextField
                          value={bankAccountNo}
                          onChange={(e) => setBankAccountNo(e.target.value)}
                          placeholder="Enter Bank Account No"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Bank IFSC</Typography>
                        <TextField
                          value={bankIFSC}
                          onChange={(e) => setBankIFSC(e.target.value)}
                          placeholder="Enter Bank IFSC"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Nationality</Typography>
                        <TextField
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          placeholder="Enter Nationality"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Date of Birth</Typography>
                        <TextField
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          placeholder="Enter Date of Birth"
                          sx={{ width: "100%", mt: 1 }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Place of Birth</Typography>
                        <TextField
                          value={placeOfBirth}
                          onChange={(e) => setPlaceOfBirth(e.target.value)}
                          placeholder="Enter Place of Birth"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Aadhar Card No</Typography>
                        <TextField
                          value={aadharCardNo}
                          onChange={(e) => setAadharCardNo(e.target.value)}
                          placeholder="Enter Aadhar Card No"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Pan Card No</Typography>
                        <TextField
                          value={panCardNo}
                          onChange={(e) => setPanCardNo(e.target.value)}
                          placeholder="Enter Pan Card No"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Contact Name</Typography>
                        <TextField
                          value={emergencyContactName}
                          onChange={(e) => setEmergencyContactName(e.target.value)}
                          placeholder="Enter Contact Name"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Certificate Level</Typography>
                        <TextField
                          value={certificateLevel}
                          onChange={(e) => setCertificateLevel(e.target.value)}
                          placeholder="Enter Certificate Level"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Field of Study</Typography>
                        <TextField
                          value={fieldOfStudy}
                          onChange={(e) => setFieldOfStudy(e.target.value)}
                          placeholder="Enter Field of Study"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>School</Typography>
                        <TextField
                          value={school}
                          onChange={(e) => setSchool(e.target.value)}
                          placeholder="Enter School"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Marital Status</Typography>
                        <TextField
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value)}
                          placeholder="Enter Marital Status"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Number of Dependent Children</Typography>
                        <TextField
                          type="number"
                          value={numberOfDependentChildren}
                          onChange={(e) => setNumberOfDependentChildren(e.target.value)}
                          placeholder="Enter Number of Dependent Children"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Visa No</Typography>
                        <TextField
                          value={visaNo}
                          onChange={(e) => setVisaNo(e.target.value)}
                          placeholder="Enter Visa No"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Work Permit No</Typography>
                        <TextField
                          value={workPermitNo}
                          onChange={(e) => setWorkPermitNo(e.target.value)}
                          placeholder="Enter Work Permit No"
                          sx={{ width: "100%", mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Visa Expiration Date</Typography>
                        <TextField
                          type="date"
                          value={visaExpirationDate}
                          onChange={(e) => setVisaExpirationDate(e.target.value)}
                          placeholder="Enter Visa Expiration Date"
                          sx={{ width: "100%", mt: 1 }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button variant="contained" sx={{ backgroundColor: '#004E69' }}>
                        Save Private Information
                      </Button>
                    </Box>
                  </Box>
                )}
                {tabValue === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Status</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography>Employee Type</Typography>
                        <TextField
                          value={employeeType}
                          onChange={(e) => setEmployeeType(e.target.value)}
                          placeholder="Enter Employee Type"
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Related User</Typography>
                        <Button
                          variant="contained"
                          onClick={() => setRelatedUser("User ID Created")}
                          sx={{ mt: 1, backgroundColor: "#004E69" }}
                        >
                          Create User ID
                        </Button>
                      </Grid>
                    </Grid>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Attendance/Point of Sale</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography>PIN Code</Typography>
                        <TextField
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          placeholder="Enter PIN Code"
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Badge ID</Typography>
                        <Box display="flex" alignItems="center">
                          <TextField
                            value={badgeId}
                            onChange={(e) => setBadgeId(e.target.value)}
                            placeholder="Enter Badge ID"
                            fullWidth
                            margin="normal"
                          />
                          <Button
                            variant="contained"
                            onClick={() => setBadgeId("Generated Badge ID")}
                            sx={{ ml: 2, mt: 1, backgroundColor: "#004E69" }}
                          >
                            Generate
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                      <Button
                        variant="contained"
                        sx={{ mr: 2, backgroundColor: "#004E69" }}
                      >
                        Save & Close
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ borderColor: "#004E69", color: "#004E69" }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            component='img'
            src={Img}
            sx={{ height: '200px', margin: '10px' }}
          />
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '10px'
          }}>
            <Typography variant='h4' fontWeight={'bold'}>Congratulations</Typography>
            <Typography>You have successfully added a new staff</Typography>
          </Box>
          <Button
            onClick={handleContinue}
            variant='contained'
            sx={{ color: 'white', bgcolor: "#004E69", margin: '10px' }}
          >
            Continue
          </Button>
        </Box>
      </Modal>
      <Dialog open={openResumeModal} onClose={handleCloseResumeModal}>
        <DialogTitle>New Resume Line</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Company Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Role"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResumeModal}>Cancel</Button>
          <Button onClick={handleCloseResumeModal}>Save & Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openSkillsModal} onClose={handleCloseSkillsModal}>
        <DialogTitle>Select Skills</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Skill Type"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Skill"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Skill Level"
            type="text"
            fullWidth
            variant="outlined"
          />
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Strength</Typography>
            <Slider defaultValue={80} aria-labelledby="continuous-slider" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkillsModal}>Cancel</Button>
          <Button onClick={handleCloseSkillsModal}>Save & Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default EmployeeAdd;
