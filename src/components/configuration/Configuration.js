import React from "react";
import { Grid, Card, CardContent, CardActions, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import Sidebar from "../Common_Bar/Sidebar";
import Navbar from "../Common_Bar/NavBar";
import TopBar from "../Common_Bar/TopBar";

const cards = [
  "Performance",
  "Training",
  "Promotion",
  "Resignation",
  "Termination",
  "Manage Jobs",
  "Manage Resume",
  "Shortlist Candidate",
  "Offer Approval",
];

const ConfigurationPage = () => {
  const navigate = useNavigate();  // Initialize useNavigate

  const handleViewClick = (card) => {
    // Navigate to different routes based on the card name
    switch(card) {
      case "Performance":
        navigate("/performance");
        break;
      case "Training":
        navigate("/training");
        break;
      case "Promotion":
        navigate("/promotion");
        break;
      case "Resignation":
        navigate("/resignation-view");
        break;
      case "Termination":
        navigate("/termination");
        break;
      case "Manage Jobs":
        navigate("/manage-jobs-view");
        break;
      case "Manage Resume":
        navigate("/resume");
        break;
      case "Shortlist Candidate":
        navigate("/shortlist");
        break;
      case "Offer Approval":
        navigate("/offer-approval-view");
        break;
      default:
        break;
    }
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

        {/* Main Content */}
        <Box flex={1} padding="20px">
          <Typography variant="h6" gutterBottom>
            Configuration
          </Typography>
          <Grid container spacing={3}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#FFF5F5",
                    borderRadius: 2,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {card}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#003F5F",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "#003F5F",
                        },
                      }}
                      onClick={() => handleViewClick(card)}  // Call handleViewClick on button click
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfigurationPage;
