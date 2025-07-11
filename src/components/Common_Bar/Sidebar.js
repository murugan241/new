import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  Button,
  Typography,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

// Importing Material-UI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountingIcon from "@mui/icons-material/AccountBalance";
import PayrollIcon from "@mui/icons-material/AttachMoney";
import ChatIcon from "@mui/icons-material/Chat";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PublicIcon from "@mui/icons-material/Public";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ComputerIcon from "@mui/icons-material/Computer";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Sidebar = () => {
  const location = useLocation();
  const [openDepartment, setOpenDepartment] = useState(false);

  const handleDepartmentClick = () => {
    setOpenDepartment(!openDepartment);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      sx={{
        width: 260,
        backgroundColor: "#1A1A2E",
        color: "white",
        height: "100vh",
        padding: 2,
      }}
    >
      <List>
        <Button
          component={Link}
          to="/dashboard"
          fullWidth
          sx={{
            justifyContent: "flex-start",
            padding: 2,
            textTransform: "none",
            color: "white",
            backgroundColor: isActive("/dashboard") ? "#4A148C" : "transparent",
            "&:hover": {
              backgroundColor: "#4A148C",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <DashboardIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Dashboard
          </Typography>
        </Button>

        <Button
          component={Link}
          to="/projects"
          fullWidth
          sx={{
            justifyContent: "flex-start",
            padding: 2,
            textTransform: "none",
            color: "white",
            backgroundColor: isActive("/projects") ? "#4A148C" : "transparent",
            "&:hover": {
              backgroundColor: "#4A148C",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <WorkIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Projects
          </Typography>
        </Button>

        <ListItem button onClick={handleDepartmentClick} sx={{ color: "white" }}>
          <ListItemIcon sx={{ color: "white" }}>
            <BusinessIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Department
          </Typography>
          {openDepartment ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openDepartment} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Button
              component={Link}
              to="/administrator"
              fullWidth
              sx={{
                justifyContent: "flex-start",
                padding: 2,
                pl: 4,
                textTransform: "none",
                color: "white",
                backgroundColor: isActive("/administrator")
                  ? "#4A148C"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "#4A148C",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Administrator
              </Typography>
            </Button>
            <Button
              component={Link}
              to="/manager"
              fullWidth
              sx={{
                justifyContent: "flex-start",
                padding: 2,
                pl: 4,
                textTransform: "none",
                color: "white",
                backgroundColor: isActive("/manager")
                  ? "#4A148C"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "#4A148C",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <PeopleIcon />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Manager
              </Typography>
            </Button>
            <Button
              component={Link}
              to="/human-resources"
              fullWidth
              sx={{
                justifyContent: "flex-start",
                padding: 2,
                pl: 4,
                textTransform: "none",
                color: "white",
                backgroundColor: isActive("/human-resources")
                  ? "#4A148C"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "#4A148C",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <SupportAgentIcon />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Human Resources
              </Typography>
            </Button>
            <Button
              component={Link}
              to="/information-tech"
              fullWidth
              sx={{
                justifyContent: "flex-start",
                padding: 2,
                pl: 4,
                textTransform: "none",
                color: "white",
                backgroundColor: isActive("/information-tech")
                  ? "#4A148C"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "#4A148C",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <ComputerIcon />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Information Tech
              </Typography>
            </Button>
            <Button
              component={Link}
              to="/finance"
              fullWidth
              sx={{
                justifyContent: "flex-start",
                padding: 2,
                pl: 4,
                textTransform: "none",
                color: "white",
                backgroundColor: isActive("/finance")
                  ? "#4A148C"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "#4A148C",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <MonetizationOnIcon />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Finance
              </Typography>
            </Button>
            <Button
              component={Link}
              to="/sales-crm"
              fullWidth
              sx={{
                justifyContent: "flex-start",
                padding: 2,
                pl: 4,
                textTransform: "none",
                color: "white",
                backgroundColor: isActive("/sales-crm")
                  ? "#4A148C"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "#4A148C",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <ShoppingCartIcon />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Sales/CRM
              </Typography>
            </Button>
          </List>
        </Collapse>

        <Button
          component={Link}
          to="/attendance"
          fullWidth
          sx={{
            justifyContent: "flex-start",
            padding: 2,
            textTransform: "none",
            color: "white",
            backgroundColor: isActive("/attendance")
              ? "#4A148C"
              : "transparent",
            "&:hover": {
              backgroundColor: "#4A148C",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <AssignmentIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Attendance
          </Typography>
        </Button>

        <Button
          component={Link}
          to="/accounting"
          fullWidth
          sx={{
            justifyContent: "flex-start",
            padding: 2,
            textTransform: "none",
            color: "white",
            backgroundColor: isActive("/accounting")
              ? "#4A148C"
              : "transparent",
            "&:hover": {
              backgroundColor: "#4A148C",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <AccountingIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Accounting
          </Typography>
        </Button>

        <Button
          component={Link}
          to="/payroll"
          fullWidth
          sx={{
            justifyContent: "flex-start",
            padding: 2,
            textTransform: "none",
            color: "white",
            backgroundColor: isActive("/payroll")
              ? "#4A148C"
              : "transparent",
            "&:hover": {
              backgroundColor: "#4A148C",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <PayrollIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Payroll
          </Typography>
        </Button>

        <Button
          component={Link}
          to="/chat"
          fullWidth
          sx={{
            justifyContent: "flex-start",
            padding: 2,
            textTransform: "none",
            color: "white",
            backgroundColor: isActive("/chat")
              ? "#4A148C"
              : "transparent",
            "&:hover": {
              backgroundColor: "#4A148C",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <ChatIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Chat
          </Typography>
        </Button>

        <Button
          component={Link}
          to="/holidays"
          fullWidth
          sx={{
            justifyContent: "flex-start",
            padding: 2,
            textTransform: "none",
            color: "white",
            backgroundColor: isActive("/holidays")
              ? "#4A148C"
              : "transparent",
            "&:hover": {
              backgroundColor: "#4A148C",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <PublicIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Holidays
          </Typography>
        </Button>

        <Button
          component={Link}
          to="/userprofile"
          fullWidth
          sx={{
            justifyContent: "flex-start",
            padding: 2,
            textTransform: "none",
            color: "white",
            backgroundColor: isActive("/userprofile")
              ? "#4A148C"
              : "transparent",
            "&:hover": {
              backgroundColor: "#4A148C",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <SettingsIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Profile
          </Typography>
        </Button>

        <Button
          component={Link}
          to="/login"
          fullWidth
          sx={{
            justifyContent: "flex-start",
            padding: 2,
            textTransform: "none",
            color: "white",
            backgroundColor: isActive("/login")
              ? "#4A148C"
              : "transparent",
            "&:hover": {
              backgroundColor: "#4A148C",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Logout
          </Typography>
        </Button>
      </List>
    </Box>
  );
};

export default Sidebar;