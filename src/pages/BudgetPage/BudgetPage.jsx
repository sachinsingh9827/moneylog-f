import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Paper,
  List,
  ListItem,
  Divider,
  LinearProgress,
  Stack,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Footer from "../Footer/Footer";
import Banner from "../../components/Banner";

const BudgetPage = () => {
  const [userType, setUserType] = useState("");
  const [amount, setAmount] = useState("");
  const [savingsPercent, setSavingsPercent] = useState("");
  const [budgetBreakdown, setBudgetBreakdown] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const total = parseFloat(amount);
    const savingsInput = parseFloat(savingsPercent);

    if (!userType || !amount || isNaN(total) || total <= 0) {
      setError(
        "Please select user type and enter a valid amount greater than 0"
      );
      return;
    }

    if (
      savingsPercent &&
      (isNaN(savingsInput) || savingsInput < 0 || savingsInput > 100)
    ) {
      setError("Please enter a valid Savings percentage between 0 and 100");
      return;
    }

    let breakdown = {};

    switch (userType) {
      case "student":
        breakdown = {
          "Food & Groceries": 0.3,
          Transportation: 0.2,
          "Study Materials": 0.2,
          "Entertainment & Leisure": 0.15,
          Savings: 0.1,
        };
        break;
      case "employee":
        breakdown = {
          "House Rent": 0.4,
          Utilities: 0.15,
          Groceries: 0.2,
          Transportation: 0.1,
          "Savings & Investments": 0.1,
        };
        break;
      case "retired":
        breakdown = {
          "Healthcare & Insurance": 0.3,
          Groceries: 0.25,
          Utilities: 0.15,
          "Leisure & Recreation": 0.1,
          Savings: 0.15,
        };
        break;
      case "freelancer":
        breakdown = {
          "Home Office Expenses": 0.2,
          Groceries: 0.2,
          Utilities: 0.15,
          Transportation: 0.1,
          "Savings & Tax Fund": 0.2,
          "Skill Development": 0.1,
        };
        break;
      case "homemaker":
        breakdown = {
          Groceries: 0.35,
          "Home Essentials": 0.25,
          Utilities: 0.15,
          "Family & Kids": 0.1,
          Savings: 0.15,
        };
        break;
      case "other":
        breakdown = {
          Essentials: 0.5,
          "Entertainment & Others": 0.2,
          "Health & Wellness": 0.1,
          Savings: 0.15,
        };
        break;
      default:
        break;
    }

    // Adjust for user-defined Savings %
    const savingsCategoryKey = Object.keys(breakdown).find((key) =>
      key.toLowerCase().includes("savings")
    );

    const finalBreakdown = {};
    let remainingPercent = 1.0;

    if (savingsPercent) {
      remainingPercent = (100 - savingsInput) / 100;
    } else {
      savingsInput = breakdown[savingsCategoryKey] * 100;
    }

    // Remove Savings from breakdown to redistribute remaining categories
    const otherCategories = { ...breakdown };
    delete otherCategories[savingsCategoryKey];

    const totalOtherPercent = Object.values(otherCategories).reduce(
      (sum, val) => sum + val,
      0
    );

    // Calculate new values
    Object.entries(otherCategories).forEach(([category, percent]) => {
      const adjustedPercent = (percent / totalOtherPercent) * remainingPercent;
      finalBreakdown[category] = {
        amount: (total * adjustedPercent).toFixed(2),
        percent: (adjustedPercent * 100).toFixed(1),
      };
    });

    // Add Savings with user input value
    finalBreakdown[savingsCategoryKey] = {
      amount: (total * (savingsInput / 100)).toFixed(2),
      percent: parseFloat(savingsInput).toFixed(1),
    };

    setBudgetBreakdown(finalBreakdown);
  };

  const handleDownloadPDF = () => {
    setError("Download PDF feature coming soon...");
  };

  return (
    <div className="image">
      {" "}
      <Banner
        heading="Welcome to Budget Planner"
        description="Plan smart and save more every month"
      />
      <div style={{ padding: "20px" }}>
        <Container
          maxWidth="lg"
          sx={{ py: 8 }}
          style={{
            background: "rgba(222, 219, 219, 0.3)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#004080",
            borderRadius: "15px",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, color: "#004080" }}
            >
              Monthly Budget Planner
            </Typography>

            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 5 }}
            >
              Select your profile type, enter your total monthly budget, and
              optionally adjust your Savings percentage.
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <FormControl fullWidth>
                <InputLabel>User Type</InputLabel>
                <Select
                  value={userType}
                  label="User Type"
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                  <MenuItem value="freelancer">Freelancer</MenuItem>
                  <MenuItem value="homemaker">Homemaker</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Total Monthly Budget (₹)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 10000"
                fullWidth
              />

              <TextField
                label="Savings Percentage (%)"
                type="number"
                value={savingsPercent}
                onChange={(e) => setSavingsPercent(e.target.value)}
                placeholder="Optional (default as per profile)"
                fullWidth
              />

              <Button startIcon={<SaveIcon />} variant="outlined" type="submit">
                Generate Budget Breakdown
              </Button>
            </Box>

            {budgetBreakdown && (
              <Paper elevation={3} sx={{ mt: 5, p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Your Budget Breakdown
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List>
                  {Object.entries(budgetBreakdown).map(
                    ([category, data], index) => (
                      <ListItem
                        key={category}
                        disableGutters
                        sx={{ fontWeight: 700, color: "#004080" }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%", mb: 1 }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {index + 1}. {category} ({data.percent}%)
                          </Typography>
                          <Typography variant="body1">
                            ₹ {data.amount}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(data.percent)}
                          sx={{ width: "100%", height: 8, borderRadius: 5 }}
                          color="primary"
                        />
                      </ListItem>
                    )
                  )}
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h6"
                  align="right"
                  sx={{ fontWeight: 700, color: "#004080" }}
                >
                  Total Budget: ₹ {parseFloat(amount).toFixed(2)}
                </Typography>

                <Button
                  variant="outlined"
                  sx={{ mt: 3 }}
                  onClick={handleDownloadPDF}
                >
                  Download as PDF Report
                </Button>
              </Paper>
            )}
          </Box>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default BudgetPage;
