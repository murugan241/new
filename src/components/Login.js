// import React, { useState } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import { Box, Typography, TextField, Button, Alert, Avatar, Link } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import GoogleIcon from '@mui/icons-material/Google';

// const Login = () => {
//   const { role } = useParams();
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState(state?.email || '');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);

//   const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     // Placeholder login logic
//     if (!email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }
//     // Replace with actual auth logic (e.g., Firebase, JWT)
//     console.log('Logging in:', { email, password, role });
//     setError('Authentication not implemented');
//   };

//   const handleNavigateToSignUp = () => {
//     navigate('/signup'); // Navigate to the sign-up page
//   };

//   return (
//     <Box sx={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '100vh',
//       backgroundColor: '#f5f5f5',
//       p: 2
//     }}>
//       <Box sx={{
//         display: 'flex',
//         flexDirection: { xs: 'column', md: 'row' },
//         alignItems: 'center',
//         justifyContent: 'center',
//         maxWidth: 1200,
//         mx: 'auto',
//         p: 3,
//         backgroundColor: 'white',
//         borderRadius: 2,
//         boxShadow: 3
//       }}>
//         <Box sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flex: 1,
//           p: 3
//         }}>
//           <Typography variant="h4" gutterBottom>
//             CubeAi Solution
//           </Typography>
//           <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//             <Avatar sx={{ bgcolor: 'primary.main', mx: 1 }} />
//             <Avatar sx={{ bgcolor: 'secondary.main', mx: 1 }} />
//             <Avatar sx={{ bgcolor: 'error.main', mx: 1 }} />
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//             <img
//               src="https://via.placeholder.com/500x300" // Replace with your actual image
//               alt="Computer"
//               style={{ width: '100%', maxWidth: '500px' }}
//             />
//           </Box>
//         </Box>
//         <Box sx={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           p: 3,
//           borderLeft: { md: '1px solid #e0e0e0' }
//         }}>
//           <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
//             Admin Login
//           </Typography>
//           <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', maxWidth: '400px' }}>
//             <TextField
//               label="Admin ID"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               required
//             />
//             <TextField
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               fullWidth
//               margin="normal"
//               variant="outlined"
//               required
//             />
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <input type="checkbox" id="remember" />
//                 <Typography variant="body2" sx={{ ml: 1 }}>Remember</Typography>
//               </Box>
//               <Link href="#" variant="body2">Forgot Password?</Link>
//             </Box>
//             {error && (
//               <Alert severity="error" sx={{ width: '100%', my: 2 }}>
//                 {error}
//               </Alert>
//             )}
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ mt: 2, mb: 2, textTransform: 'none', py: 1.5 }}
//               startIcon={<LockOutlinedIcon />}
//             >
//               Login
//             </Button>
//             <Button
//               variant="outlined"
//               color="inherit"
//               fullWidth
//               sx={{ textTransform: 'none', py: 1.5, mb: 2 }}
//               startIcon={<GoogleIcon />}
//             >
//               Login with Google
//             </Button>
//             <Typography variant="body2" align="center">
//               Don't have an account?{' '}
//               <Link component="button" onClick={handleNavigateToSignUp} sx={{ color: 'primary.main' }}>
//                 Sign Up
//               </Link>
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Login;