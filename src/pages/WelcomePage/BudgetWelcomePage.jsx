import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import "./BudgetWelcomePage.css"; // New CSS file for styling

const BudgetWelcomePage = () => {
  const navigate = useNavigate();

  const handleCreateBudget = () => {
    navigate("/budget");
  };

  return (
    <Box className="budget-hero-section">
      <Container maxWidth="full">
        <Card
          style={{
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        >
          <CardContent>
            <Box>
              <SavingsIcon className="budget-icon" />
              <Typography variant="h4" className="budget-title">
                Build Your Monthly Budget
              </Typography>
              <Typography variant="body1" className="budget-description">
                Stay in control of your finances. Track expenses, set saving
                goals, and plan smarter.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleCreateBudget}
                sx={{
                  background:
                    "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
                  borderRadius: 20,
                  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Start Budgeting
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default BudgetWelcomePage;
