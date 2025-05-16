import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Typography, Box } from "@mui/material";
import "./WelcomePage.css"; // Reuse same CSS

const BudgetWelcomePage = () => {
  const navigate = useNavigate();

  const handleCreateBudget = () => {
    navigate("/budget"); // Navigate to your budget creation page
  };

  return (
    <Box className="welcome-container">
      <Container maxWidth="">
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" align="left" className="welcome-heading">
              Plan Your Monthly Budget
            </Typography>
            <Typography variant="h5" align="left" className="subheading">
              Manage your expenses, set limits, and track your savings.
            </Typography>
          </Grid>

          {/* Right Button */}
          <Grid item xs={12} md={4}>
            <button className="register-button" onClick={handleCreateBudget}>
              Create Budget
            </button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BudgetWelcomePage;
