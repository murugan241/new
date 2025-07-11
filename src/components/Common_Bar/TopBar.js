import React from "react";
import { Box, Button, Typography, IconButton, TextField } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SettingContainer from "../Notification/SettingContainer";


const TopBar = () => {
  
  return (
    <Box
      display="flex"
      alignItems="center"
      px={2}
      mt={0.5}
      sx={{
        height: "80px", // Set the height of the TopBar
        backgroundColor: "#FFF7F7", // Set the background color
      }}
    >
    <Button
      variant="contained"
      component={Link} // Use Link as the underlying component
      to="/adddepartment" // Specify the navigation route
      sx={{
        backgroundColor: "#004E69",
        color: "white",
        fontWeight: "bold",
        textTransform: "none",
        mx: 3,
        fontFamily: 'lato',
        fontWeight: '700',
        fontSize: '14px'
      }}
    >
      Add New
    </Button>

      <Box sx={{ display: "flex", mx: 5 }}>
        <Typography sx={{fontWeight: 400,fontSize:'20px',fontFamily:'lato',color:'#000000' }}>Department</Typography>
        <IconButton sx={{ mt: -1 }}>
          <SettingsIcon />
        </IconButton>
      </Box>
      <TextField
        size="small"
        placeholder="Enter search word"
        sx={{
          flexGrow: 1,
          maxWidth: "300px",
          backgroundColor: "#f9f9f9",
          borderRadius: 1,
        }}
      />
    </Box>
  );
};

export default TopBar;
