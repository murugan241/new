import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  IconButton,
  Card,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit,
  CameraAlt,
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  Password,
} from '@mui/icons-material';
import axios from 'axios';
import Navbar from "../Common_Bar/NavBar";
import Sidebar from "../Common_Bar/Sidebar";

const UserProfile = ({ userData }) => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    _id: '',
    fullName: '',
    email: '',
    username: '',
    role: '',
    phone: '',
    address: '',
    state: '',
    zipCode: '',
    status: 'Online',
    completionLevel: 0,
    profileImage: null,
    password: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const fileInputRef = useRef(null);

  // Get initials from fullName for Avatar fallback
  const getInitials = (name) => {
    if (!name || name === 'User') {
      console.log('UserProfile: Generating initials for empty or default name:', name);
      return 'U';
    }
    const names = name.trim().split(' ');
    const initials = names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    console.log('UserProfile: Generated initials:', initials, 'from name:', name);
    return initials;
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('UserProfile: Fetching profile with token:', token ? 'Token exists' : 'No token found');
        if (!token) {
          console.log('UserProfile: No token, setting default profile');
          setUser(prev => ({ ...prev, fullName: 'User', profileImage: null }));
          return;
        }
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUser = response.data.user;
        const imagePath = fetchedUser.profileImage ? `/Uploads/${fetchedUser.profileImage.split('/').pop()}` : null;
        console.log('UserProfile: Profile fetch response:', {
          fullName: fetchedUser.fullName,
          profileImage: imagePath,
          avatarSrc: imagePath ? `http://localhost:5000${imagePath}` : 'Initials'
        });
        setUser({
          _id: fetchedUser._id || '',
          fullName: fetchedUser.fullName || 'User',
          email: fetchedUser.email || '',
          username: fetchedUser.username || '',
          role: fetchedUser.role || 'admin',
          phone: fetchedUser.phone || '',
          address: fetchedUser.address || '',
          state: fetchedUser.state || '',
          zipCode: fetchedUser.zipCode || '',
          status: fetchedUser.isActive ? 'Online' : 'Offline',
          completionLevel: calculateCompletionLevel(fetchedUser),
          profileImage: imagePath,
          password: '',
        });
      } catch (error) {
        console.error('UserProfile: Error fetching user data:', error.message, error.response?.data);
        console.log('UserProfile: Setting default profile due to fetch error');
        setSaveStatus({ type: 'error', message: error.response?.data?.message || 'Failed to load user data' });
        setUser(prev => ({ ...prev, fullName: 'User', profileImage: null }));
      }
    };

    if (!userData && localStorage.getItem('token')) {
      fetchUserData();
    }
  }, [userData]);

  // Calculate profile completion level
  const calculateCompletionLevel = (user) => {
    const fields = ['fullName', 'email', 'username', 'phone', 'address', 'state', 'zipCode'];
    const filledFields = fields.filter(field => user[field]).length;
    const completion = Math.round((filledFields / fields.length) * 100);
    console.log('UserProfile: Calculated completion level:', completion, '%', 'Filled fields:', filledFields, '/', fields.length);
    return completion;
  };

  const handleEdit = () => {
    setEditMode(!editMode);
    setErrors({});
    setSaveStatus(null);
    setSelectedImage(null);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Clear file input
    }
    console.log('UserProfile: Toggled edit mode:', editMode ? 'Exiting' : 'Entering');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!user.fullName || user.fullName.length < 2 || user.fullName.length > 100) {
      newErrors.fullName = 'Full name must be 2-100 characters';
    }
    if (!user.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!user.username || user.username.length < 3 || user.username.length > 30 || !/^[a-zA-Z0-9_]+$/.test(user.username)) {
      newErrors.username = 'Username must be 3-30 characters and contain only letters, numbers, and underscores';
    }
    if (user.password && user.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!['admin', 'super_admin'].includes(user.role)) {
      newErrors.role = 'Invalid role';
    }
    if (user.phone && !/^\+?[\d\s-]{10,}$/.test(user.phone)) {
      newErrors.phone = 'Valid phone number is required';
    }
    if (selectedImage) {
      const filetypes = /jpeg|jpg|png/;
      if (!filetypes.test(selectedImage.type)) {
        newErrors.profileImage = 'Image must be JPEG, JPG, or PNG';
      }
      if (selectedImage.size > 5 * 1024 * 1024) {
        newErrors.profileImage = 'Image size must be less than 5MB';
      }
    }
    setErrors(newErrors);
    console.log('UserProfile: Form validation result:', Object.keys(newErrors).length === 0 ? 'Valid' : newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    console.log('UserProfile: Field changed:', { name, value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('UserProfile: Image selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
      });
      const filetypes = /jpeg|jpg|png/;
      if (!filetypes.test(file.type)) {
        console.log('UserProfile: Image validation failed: Invalid file type');
        setErrors({ ...errors, profileImage: 'Image must be JPEG, JPG, or PNG' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.log('UserProfile: Image validation failed: File size exceeds 5MB');
        setErrors({ ...errors, profileImage: 'Image size must be less than 5MB' });
        return;
      }
      setImageUploading(true);
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('UserProfile: Image preview loaded as base64:', e.target.result.slice(0, 50) + '...');
        setUser(prevUser => ({ ...prevUser, profileImage: e.target.result }));
        setImageUploading(false);
        setImageError(false);
      };
      reader.onerror = () => {
        console.error('UserProfile: Error reading image file');
        setErrors({ ...errors, profileImage: 'Failed to read image' });
        setImageUploading(false);
        setImageError(true);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('UserProfile: No image selected');
    }
  };

  const handleImageError = () => {
    console.error('UserProfile: Failed to load profile image:', `http://localhost:5000${user.profileImage}`);
    setImageError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log('UserProfile: Form validation failed:', errors);
      return;
    }

    setSaveStatus({ type: 'loading', message: 'Saving changes...' });
    try {
      const token = localStorage.getItem('token');
      console.log('UserProfile: Updating profile with token:', token ? 'Token exists' : 'No token found');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const formData = new FormData();
      formData.append('fullName', user.fullName);
      formData.append('email', user.email);
      formData.append('username', user.username);
      if (user.password) formData.append('password', user.password);
      formData.append('role', user.role);
      formData.append('phone', user.phone);
      formData.append('address', user.address);
      formData.append('state', user.state);
      formData.append('zipCode', user.zipCode);
      if (selectedImage) {
        console.log('UserProfile: Uploading image:', selectedImage.name);
        formData.append('profileImage', selectedImage);
      }

      const response = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const imagePath = response.data.user.profileImage ? `/Uploads/${response.data.user.profileImage.split('/').pop()}` : null;
      console.log('UserProfile: Profile update response:', {
        fullName: response.data.user.fullName,
        profileImage: imagePath,
        avatarSrc: imagePath ? `http://localhost:5000${imagePath}` : 'Initials'
      });

      setUser(prevUser => ({
        ...prevUser,
        ...response.data.user,
        completionLevel: calculateCompletionLevel(response.data.user),
        profileImage: imagePath,
        password: '',
      }));
      setSelectedImage(null);
      setImageError(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Clear file input
      }
      setSaveStatus({ type: 'success', message: 'Profile updated successfully' });
      setEditMode(false);

      // Dispatch custom event to notify Navbar of profile update
      console.log('UserProfile: Dispatching profileUpdated event');
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (error) {
      console.error('UserProfile: Error updating user data:', error.message, error.response?.data);
      const message = error.response?.data?.message || 'Failed to update profile';
      setSaveStatus({ type: 'error', message });
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.reduce((acc, err) => ({
          ...acc,
          [err.param]: err.msg,
        }), {}));
      } else if (error.response?.data?.message?.includes('Images only')) {
        setErrors({ ...errors, profileImage: 'Image must be JPEG, JPG, or PNG' });
      }
    }
  };

  const triggerFileInput = () => {
    console.log('UserProfile: Triggering file input for image selection');
    fileInputRef.current.click();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box sx={{ flex: 1, backgroundColor: '#f8f9fa', p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', mb: 4, fontFamily: 'Poppins, sans-serif' }}
          >
            User Profile
          </Typography>
          {saveStatus && (
            <Alert severity={saveStatus.type} sx={{ mb: 3 }}>
              {saveStatus.message}
            </Alert>
          )}
          {errors.profileImage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.profileImage}
            </Alert>
          )}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Profile Card */}
            <Card sx={{ flex: 1, p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'relative' }}>
              <Chip
                label={user.status}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: user.status === 'Online' ? '#4caf50' : '#f44336',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Chip
                label={user.role.toUpperCase()}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  backgroundColor: '#2196f3',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Box sx={{ position: 'relative', display: 'inline-block', mt: 2 }}>
                <Avatar
                  alt="User Avatar"
                  src={user.profileImage && !imageError ? `http://localhost:5000${user.profileImage}` : undefined}
                  onError={handleImageError}
                  sx={{
                    width: { xs: 100, sm: 120 },
                    height: { xs: 100, sm: 120 },
                    margin: 'auto',
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  {(!user.profileImage || imageError) && getInitials(user.fullName)}
                </Avatar>
                {editMode && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: '#ff5722',
                      color: 'white',
                      width: 35,
                      height: 35,
                      '&:hover': {
                        backgroundColor: '#e64a19',
                      },
                    }}
                    onClick={triggerFileInput}
                    disabled={imageUploading}
                  >
                    {imageUploading ? <CircularProgress size={20} color="inherit" /> : <CameraAlt fontSize="small" />}
                  </IconButton>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  accept="image/jpeg,image/jpg,image/png"
                />
              </Box>
              <Typography
                variant="h5"
                sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}
              >
                {user.fullName || 'N/A'}
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.9, mb: 3, textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}
              >
                {user.role.toUpperCase()}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEdit}
                sx={{
                  backgroundColor: '#4A148C',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#6A1B9A',
                  },
                  mb: 2,
                  width: '100%',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, opacity: 0.9, fontFamily: 'Poppins, sans-serif' }}
                >
                  Profile Completion
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={user.completionLevel}
                    size={60}
                    thickness={4}
                    sx={{ color: '#4caf50' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      {`${user.completionLevel}%`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
            {/* Contact Information Card */}
            <Card sx={{ flex: 2, p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: '#2c3e50', fontFamily: 'Poppins, sans-serif' }}
                >
                  Contact Information
                </Typography>
                <Chip
                  label={editMode ? 'Cancel' : 'Edit'}
                  onClick={handleEdit}
                  clickable
                  sx={{
                    backgroundColor: editMode ? '#f44336' : '#2196f3',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: editMode ? '#d32f2f' : '#1976d2',
                    },
                    fontFamily: 'Poppins, sans-serif',
                  }}
                />
              </Box>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={user.fullName}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      error={!!errors.fullName}
                      helperText={errors.fullName}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: '#666' }} />,
                      }}
                      sx={{ '& .MuiInputBase-root': { fontFamily: 'Poppins, sans-serif' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      disabled={!editMode}
                      type="email"
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: '#666' }} />,
                      }}
                      sx={{ '& .MuiInputBase-root': { fontFamily: 'Poppins, sans-serif' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={user.username}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      error={!!errors.username}
                      helperText={errors.username}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: '#666' }} />,
                      }}
                      sx={{ '& .MuiInputBase-root': { fontFamily: 'Poppins, sans-serif' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password (leave blank to keep current)"
                      name="password"
                      value={user.password || ''}
                      onChange={handleChange}
                      disabled={!editMode}
                      type="password"
                      variant="outlined"
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        startAdornment: <Password sx={{ mr: 1, color: '#666' }} />,
                      }}
                      sx={{ '& .MuiInputBase-root': { fontFamily: 'Poppins, sans-serif' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      error={!!errors.phone}
                      helperText={errors.phone}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: '#666' }} />,
                      }}
                      sx={{ '& .MuiInputBase-root': { fontFamily: 'Poppins, sans-serif' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={user.state}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: '#666' }} />,
                      }}
                      sx={{ '& .MuiInputBase-root': { fontFamily: 'Poppins, sans-serif' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <Business sx={{ mr: 1, color: '#666' }} />,
                      }}
                      sx={{ '& .MuiInputBase-root': { fontFamily: 'Poppins, sans-serif' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      name="zipCode"
                      value={user.zipCode}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      sx={{ '& .MuiInputBase-root': { fontFamily: 'Poppins, sans-serif' } }}
                    />
                  </Grid>
                </Grid>
                {editMode && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        bgcolor: '#4A148C',
                        '&:hover': { bgcolor: '#6A1B9A' },
                        fontFamily: 'Poppins, sans-serif',
                      }}
                      disabled={saveStatus?.type === 'loading'}
                    >
                      {saveStatus?.type === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfile;