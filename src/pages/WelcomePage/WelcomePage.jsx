import React from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import { Container, Grid, Typography, Box, Button } from "@mui/material";
import "./WelcomePage.css"; // Importing the custom CSS

const WelcomePage = () => {
  const navigate = useNavigate(); // React Router hook to navigate

  const handleRegisterPress = () => {
    navigate("/register"); // Navigate to the register screen
  };

  return (
    <Box className="welcome-container">
      <Container maxWidth="">
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Content on left side */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" align="left" className="welcome-heading">
              Welcome to MoneyLog!
            </Typography>
            <Typography variant="h5" align="left" className="subheading">
              Get started by registering below and take control of your finances
            </Typography>
          </Grid>

          {/* Button on right side */}
          <Grid item xs={12} md={4}>
            <Button
              className="register-button"
              onClick={handleRegisterPress}
              sx={{
                backgroundColor: "#004080",
                color: "#fff",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: { xs: "1rem", md: "1.25rem" },
                "&:hover": {
                  backgroundColor: "#003366",
                },
                borderRadius: 2,
              }}
            >
              Register Now
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomePage;
