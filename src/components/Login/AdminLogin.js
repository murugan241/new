import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Link } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'hr', label: 'HR' },
  { value: 'viewer', label: 'Viewer' },
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const { roleParam } = useParams();
  const location = useLocation();
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Derive role from URL params or query
  const queryParams = new URLSearchParams(location.search);
  const queryRole = queryParams.get('role');
  const role = (roleParam && roles.map(r => r.value).includes(roleParam)) 
    ? roleParam 
    : (queryRole && roles.map(r => r.value).includes(queryRole)) 
      ? queryRole 
      : 'admin';
  const roleObj = roles.find((r) => r.value === role);
  const displayRole = roleObj ? roleObj.label : 'Admin';
  const redirectPath = role === 'admin' || role === 'super_admin' ? '/dashboard' : `/${role}/dashboard`;

  // Handle invitation token
  useEffect(() => {
    const token = queryParams.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('AdminLogin: Decoded invitation token:', decoded);
        setEmail(decoded.email || '');
        if (decoded.role && roles.map(r => r.value).includes(decoded.role)) {
          navigate(`/login/${decoded.role}?token=${token}`, { replace: true });
        } else {
          setError('Invalid role in invitation link');
        }
      } catch (err) {
        console.error('AdminLogin: Invalid invitation token:', err);
        setError('Invalid or expired invitation link');
      }
    }
  }, [location.search, navigate]);

  useEffect(() => {
    console.log('AdminLogin: Component mounted with role:', role, 'roleParam:', roleParam, 'queryRole:', queryRole);
    // Redirect invalid roleParam
    if (roleParam && !roles.map(r => r.value).includes(roleParam)) {
      console.log(`AdminLogin: Invalid role in URL path, got: ${roleParam}, redirecting to /login`);
      navigate('/login', { replace: true });
    }
  }, [roleParam, navigate]);

  useEffect(() => {
    localStorage.setItem('email', email);
    console.log('AdminLogin: Email saved to localStorage:', email);
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) {
      console.log('AdminLogin: Login attempt blocked, isLoading:', isLoading);
      return;
    }
    if (!email || !password) {
      console.log('AdminLogin: Missing fields - Email:', !!email, 'Password:', !!password);
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setIsLoading(true);
    console.log('AdminLogin: Attempting login with:', { email, role });

    try {
      const loginEndpoint =
        role === 'admin' || role === 'super_admin'
          ? 'http://localhost:5000/api/admins/login'
          : 'http://localhost:5000/api/invitations/login';

      const response = await axios.post(loginEndpoint, {
        email,
        password,
        role
      });

      console.log('AdminLogin: Login response:', response.data);

      // Extract user info for any role
      const { token, admin, user } = response.data.data;
      const loggedInUser = admin || user;

      if (!loggedInUser || !loggedInUser.role) {
        throw new Error('Invalid user data in response');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', loggedInUser.role);
      localStorage.setItem(
        'userName',
        loggedInUser.fullName || loggedInUser.recipientName || 'User'
      );
      console.log(
        'AdminLogin: Stored in localStorage - Token:',
        token,
        'Role:',
        loggedInUser.role,
        'Name:',
        loggedInUser.fullName || loggedInUser.recipientName
      );

      console.log(`AdminLogin: Navigating to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('AdminLogin: Login error:', err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.log('AdminLogin: Set error message:', errorMessage);
    } finally {
      setIsLoading(false);
      console.log('AdminLogin: Login attempt completed, isLoading:', false);
    }
  };

  const handleNavigateToSignUp = () => {
    if (isLoading) {
      console.log('AdminLogin: Signup navigation blocked, isLoading:', isLoading);
      return;
    }
    console.log('AdminLogin: Navigating to /signup');
    navigate('/signup', { replace: true });
  };

  const handleLogout = () => {
    console.log('AdminLogin: Logging out, clearing localStorage');
    localStorage.clear();
    console.log('AdminLogin: localStorage cleared');
    navigate('/login', { replace: true });
  };

  console.log('AdminLogin: Rendering component - role:', role, 'isLoading:', isLoading, 'error:', error);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 900,
          mx: 'auto',
          p: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
            {displayRole} Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: '400px' }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              disabled={isLoading}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              disabled={isLoading}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" id="remember" disabled={isLoading} />
                <Typography variant="body2" sx={{ ml: 1 }}>Remember me</Typography>
              </Box>
              <Link href="#" variant="body2" sx={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
                Forgot Password?
              </Link>
            </Box>
            {error && (
              <Alert severity="error" sx={{ width: '100%', my: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 2, textTransform: 'none', py: '1.5' }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mb: 2, textTransform: 'none', py: '1.5' }}
              onClick={handleLogout}
              disabled={isLoading}
            >
              Clear Session (Logout)
            </Button>
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <Link
                component="button"
                onClick={handleNavigateToSignUp}
                sx={{ color: 'primary.main', pointerEvents: isLoading ? 'none' : 'auto' }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLogin;