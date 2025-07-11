import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  MenuItem,
  Avatar,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import happy from '../../assets/Happy-Emoji-PNG 1.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [userName, setUserName] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [existingEmail, setExistingEmail] = useState("");
  const [userProfile, setUserProfile] = useState({ fullName: '', profileImage: null });
  const [imageError, setImageError] = useState(false);

  // Debugging: Log the userRole to verify its value
  console.log('Navbar: Retrieved userRole from localStorage:', localStorage.getItem('userRole'));

  // Fetch user profile data for full name and profile image
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Navbar: Fetching profile with token:', token ? 'Token exists' : 'No token found');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { fullName, profileImage } = response.data.user;
        const imagePath = profileImage ? `/Uploads/${profileImage.split('/').pop()}` : null;
        console.log('Navbar: Profile fetch response:', {
          fullName,
          profileImage: imagePath,
          avatarSrc: imagePath ? `http://localhost:5000${imagePath}` : 'Initials'
        });
        setUserProfile({ fullName: fullName || 'User', profileImage: imagePath });
      } else {
        console.log('Navbar: No token, skipping profile fetch. Using default profile.');
        setUserProfile({ fullName: 'User', profileImage: null });
      }
    } catch (error) {
      console.error('Navbar: Error fetching user profile:', error.message, error.response?.data);
      console.log('Navbar: Setting default profile due to fetch error.');
      setUserProfile({ fullName: 'User', profileImage: null });
    }
  };

  useEffect(() => {
    fetchUserProfile();
    // Listen for profile update events
    const handleProfileUpdate = () => {
      console.log('Navbar: Received profileUpdated event, re-fetching profile.');
      fetchUserProfile();
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      console.log('Navbar: Cleaning up profileUpdated event listener.');
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleImageError = () => {
    console.error('Navbar: Failed to load profile image:', `http://localhost:5000${userProfile.profileImage}`);
    setImageError(true);
  };

  const roles = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
    { value: "hr", label: "HR" },
    { value: "viewer", label: "Viewer" }
  ];

  const API_URL = 'http://localhost:5000/api/invitations';

  useEffect(() => {
    const date = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(`Today is ${date.toLocaleDateString("en-US", options)}`);
  }, []);

  const handleInviteClick = () => {
    setInviteDialogOpen(true);
  };

  const handleInviteClose = () => {
    setInviteDialogOpen(false);
    setEmailAddress("");
    setSelectedRole("");
    setUserName("");
    setGeneratedLink("");
  };

  const handleResendClose = () => {
    setResendDialogOpen(false);
    setExistingEmail("");
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendInvitationEmail = async (email, recipientName, role, resend = false) => {
    console.log('Preparing to send invitation:', { email, recipientName, role, resend });
    if (!email || !role) {
      throw new Error('Email and role are required');
    }

    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', !!token);

    if (!token) {
      console.error('No authentication token found');
      throw new Error('not_authorized');
    }

    try {
      const response = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          recipientName,
          role,
          inviterName: 'Mock Inviter',
          inviterEmail: 'inviter@cubeai.com',
          organizationName: 'CubeAI Solutions',
          resend
        }),
      });

      console.log('Response status:', response.status, 'Content-Type:', response.headers.get('content-type'));

      if (!response.ok) {
        const data = await response.json();
        console.error('Server error response:', data);
        if (data.message === 'An active invitation already exists for this email') {
          throw new Error('email_exists');
        }
        if (data.error === 'Not authorized, no token' || data.error === 'Not authorized') {
          throw new Error('not_authorized');
        }
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Invitation email sent successfully:', data);
      return { success: true, invitationUrl: data.data.invitationUrl };
    } catch (error) {
      console.error('Error sending email:', error.message, error.stack);
      throw error;
    }
  };

  const handleSendInvitation = async () => {
    if (!emailAddress || !selectedRole || !isValidEmail(emailAddress)) {
      setAlertMessage("Please provide a valid email and select a role");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      const emailResult = await sendInvitationEmail(emailAddress, userName, selectedRole);
      setGeneratedLink(emailResult.invitationUrl);
      setAlertMessage(`Invitation sent successfully to ${emailAddress}!`);
      setAlertSeverity("success");
      setShowAlert(true);
    } catch (error) {
      if (error.message === 'email_exists') {
        setExistingEmail(emailAddress);
        setResendDialogOpen(true);
      } else if (error.message === 'not_authorized') {
        setAlertMessage("You are not logged in. Please log in to send invitations.");
        setAlertSeverity("error");
        setShowAlert(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setAlertMessage(`Failed to send invitation: ${error.message}`);
        setAlertSeverity("error");
        setShowAlert(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvitation = async () => {
    setIsLoading(true);
    try {
      const emailResult = await sendInvitationEmail(existingEmail, userName, selectedRole, true);
      setGeneratedLink(emailResult.invitationUrl);
      setAlertMessage(`Invitation resent successfully to ${existingEmail}!`);
      setAlertSeverity("success");
      setShowAlert(true);
      handleResendClose();
    } catch (error) {
      if (error.message === 'not_authorized') {
        setAlertMessage("You are not logged in. Please log in to resend invitations.");
        setAlertSeverity("error");
        setShowAlert(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setAlertMessage(`Failed to resend invitation: ${error.message}`);
        setAlertSeverity("error");
        setShowAlert(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setAlertMessage("Invite link copied to clipboard!");
      setAlertSeverity("success");
      setShowAlert(true);
    } catch (err) {
      setAlertMessage("Failed to copy link. Please copy manually.");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  // Get initials from fullName for Avatar fallback
  const getInitials = (name) => {
    if (!name || name === 'User') return 'U';
    const names = name.split(' ');
    return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#F8F9FD",
          color: "black",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
          height: "100px",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "20px", fontFamily: "Lato" }}>
                CubeAiSolutions
              </Typography>
              <img
                src={happy}
                alt="CubeAi Logo"
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "8px",
                }}
              />
            </Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 400, fontSize: "12px", fontFamily: "Lato", color: "#262626" }}
            >
              {currentDate}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Link to="/employee" style={{ textDecoration: "none" }}>
              <Button sx={{ textTransform: "none", fontWeight: 400, fontSize: "20px", fontFamily: "Lato", color: "black" }}>
                Employee
              </Button>
            </Link>
            <Link to="/admindepartment" style={{ textDecoration: "none" }}>
              <Button sx={{ textTransform: "none", fontWeight: 400, fontSize: "20px", fontFamily: "Lato", color: "black" }}>
                Departments
              </Button>
            </Link>
            <Link to="/report" style={{ textDecoration: "none" }}>
              <Button sx={{ textTransform: "none", fontWeight: 400, fontSize: "20px", fontFamily: "Lato", color: "black" }}>
                Reporting
              </Button>
            </Link>
            <Link to="/configuration" style={{ textDecoration: "none" }}>
              <Button sx={{ textTransform: "none", fontWeight: 400, fontSize: "20px", fontFamily: "Lato", color: "black" }}>
                Configuration
              </Button>
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {(localStorage.getItem('userRole') === 'admin' || localStorage.getItem('userRole') === 'super_admin') && (
              <Button
                startIcon={<PersonAddIcon />}
                onClick={handleInviteClick}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "14px",
                  fontFamily: "Lato",
                  color: "#000000",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                Invite User
              </Button>
            )}
            <Link to='/notification'>
              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </Link>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                alt="User Avatar"
                src={userProfile.profileImage && !imageError ? `http://localhost:5000${userProfile.profileImage}` : undefined}
                onError={handleImageError}
                sx={{ width: 32, height: 32 }}
              >
                {(!userProfile.profileImage || imageError) && getInitials(userProfile.fullName)}
              </Avatar>
              <Typography variant="body1" sx={{ fontFamily: 'Lato' }}>
                {`Hello, ${userProfile.fullName}`}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={inviteDialogOpen}
        onClose={handleInviteClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: "center", 
          fontFamily: "Lato", 
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1
        }}>
          <EmailIcon color="primary" />
          Send Invitation
        </DialogTitle>
        
        <DialogContent sx={{ padding: "20px" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              label="Recipient Email Address *"
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              fullWidth
              variant="outlined"
              error={emailAddress && !isValidEmail(emailAddress)}
              helperText={emailAddress && !isValidEmail(emailAddress) ? "Please enter a valid email address" : ""}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                }
              }}
            />
            
            <TextField
              label="Recipient Name (Optional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              variant="outlined"
              helperText="This will be used in the invitation email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                }
              }}
            />
            
            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Role *</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Select Role *"
                sx={{
                  borderRadius: "8px",
                }}
              >
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {generatedLink && (
              <Box sx={{ 
                backgroundColor: "#f8f9fd", 
                padding: 2, 
                borderRadius: "8px",
                border: "1px solid #e0e0e0"
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                  Generated Invite Link:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "white",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #e0e0e0",
                      flex: 1,
                      fontFamily: "monospace",
                      fontSize: "12px",
                      wordBreak: "break-all",
                    }}
                  >
                    {generatedLink}
                  </Typography>
                  <IconButton
                    onClick={copyToClipboard}
                    sx={{
                      backgroundColor: "#2196f3",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#1976d2",
                      },
                    }}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ padding: "20px", gap: 1 }}>
          <Button 
            onClick={handleInviteClose}
            sx={{ 
              textTransform: "none",
              color: "#666",
              borderRadius: "8px"
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInvitation}
            variant="contained"
            disabled={isLoading || !emailAddress || !selectedRole || !isValidEmail(emailAddress)}
            startIcon={isLoading ? <CircularProgress size={16} /> : <EmailIcon />}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: "#2196f3",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
          >
            {isLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={resendDialogOpen}
        onClose={handleResendClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "12px", padding: "8px" }
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontFamily: "Lato", fontWeight: "bold" }}>
          Resend Invitation
        </DialogTitle>
        <DialogContent sx={{ padding: "20px" }}>
          <Typography variant="body1">
            An active invitation already exists for <strong>{existingEmail}</strong>. Would you like to resend the invitation?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "20px", gap: 1 }}>
          <Button
            onClick={handleResendClose}
            sx={{ textTransform: "none", color: "#666", borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResendInvitation}
            variant="contained"
            disabled={isLoading}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: "#2196f3",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
          >
            {isLoading ? "Resending..." : "Resend Invitation"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowAlert(false)} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Navbar;