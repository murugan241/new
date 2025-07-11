import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Link,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.length < 2 || formData.fullName.length > 100)
      newErrors.fullName = 'Full name must be 2-100 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))
      newErrors.email = 'Invalid email address';

    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3 || formData.username.length > 30)
      newErrors.username = 'Username must be 3-30 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username))
      newErrors.username = 'Username can only contain letters, numbers, and underscores';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (!formData.repeatPassword) newErrors.repeatPassword = 'Please repeat the password';
    else if (formData.password !== formData.repeatPassword)
      newErrors.repeatPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setApiError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post('http://localhost:5000/api/admins/signup', {
        fullName: formData.fullName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: 'admin', // Default role as per Admin model
      });

      console.log('Signup response:', response.data);
      setSuccessMessage('Admin account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login/admin', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.map((err) => err.msg).join(', ') ||
        'Signup failed. Please try again.';
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    if (isLoading) return;
    navigate('/login/admin', { replace: true });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
            Sign Up
          </Typography>
          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {apiError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {apiError}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="repeatPassword"
              label="Repeat Password"
              type="password"
              id="repeatPassword"
              autoComplete="new-password"
              value={formData.repeatPassword}
              onChange={handleChange}
              error={!!errors.repeatPassword}
              helperText={errors.repeatPassword}
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#ff4081', color: 'white' }}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
            <Link
  component="button"
  variant="body2"
  onClick={navigateToLogin}
  sx={{
    display: 'block',
    textAlign: 'center',
    fontFamily: 'Lato',
    color: '#2196f3',
    textDecoration: 'none',
    padding: '8px 16px',
    margin: '8px 0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'color 0.2s ease, background-color 0.2s ease',
    '&:hover': {
      color: '#1976d2',
      textDecoration: 'none',
      backgroundColor: '#f5f5f5',
    },
    '&:disabled': {
      color: '#b0b0b0',
      cursor: 'not-allowed',
      textDecoration: 'none',
    },
  }}
  disabled={isLoading}
>
  Already have an account? Sign In
</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminSignup;