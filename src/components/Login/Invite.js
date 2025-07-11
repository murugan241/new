import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'hr', label: 'HR' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'super_admin', label: 'Super Admin' }
];

const Invite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    localStorage.clear();
    if (savedEmail) {
      localStorage.setItem('email', savedEmail);
    }
    console.log('Invite: Cleared localStorage, preserved email:', savedEmail);

    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const expires = searchParams.get('expires');

    console.log('Invite: Processing invitation URL', { token: !!token, role, expires });

    const validRoles = roles.map((r) => r.value);
    if (!role || !validRoles.includes(role.toLowerCase())) {
      setError('Invalid invitation role');
      setLoading(false);
      return;
    }

    if (!token || !expires) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    const validateAndAccept = async () => {
      try {
        // 1. Validate invitation
        const validateRes = await axios.get(
          `http://localhost:5000/api/invitations/validate?token=${encodeURIComponent(token)}&role=${encodeURIComponent(role)}&expires=${encodeURIComponent(expires)}`
        );

        const email = validateRes.data.data.email;
        const recipientName = validateRes.data.data.recipientName;
        localStorage.setItem('email', email);
        console.log('Invite: Token validated, email:', email);

        // 2. Accept invitation
        const acceptRes = await axios.post(`http://localhost:5000/api/invitations/accept`, {
          token,
          name: recipientName || 'Invited User'
        });

        console.log('Invite: Invitation accepted', acceptRes.data);

        // 3. Redirect to login
        const actualRole = acceptRes.data?.data?.role || role;
navigate(`/login/${actualRole.toLowerCase()}`, { replace: true });

      } catch (err) {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Invalid or expired invitation link';
        console.error('Invite Error:', errorMessage, err.response?.data);

        if (errorMessage === 'Invitation has already been accepted') {
          setError('This invitation has already been accepted. Please log in.');
          navigate(`/login/${role.toLowerCase()}`, { replace: true });
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    validateAndAccept();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Processing invitation...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(`/login/${searchParams.get('role')?.toLowerCase() || 'login'}`)}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography>Redirecting to login...</Typography>
    </Box>
  );
};

export default Invite;
