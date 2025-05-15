import React from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import { Container, Grid, Typography, Box } from "@mui/material";
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
            <button
              onClick={handleRegisterPress}
              style={{
                background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
                borderRadius: 20,
                boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                color: "white",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: "10px 24px",
                border: "none",
                cursor: "pointer",
                outline: "none",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(45deg, #1976d2 30%, #1e88e5 90%)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)")
              }
            >
              Register Now
            </button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomePage;
