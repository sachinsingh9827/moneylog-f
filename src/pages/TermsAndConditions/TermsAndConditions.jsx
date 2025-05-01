import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import Banner from "../../components/Banner";

// Updated Terms & Conditions data for MoneyLog project
const termsAndConditionsData = [
  "Welcome to MoneyLog. By accessing or using our services, you agree to the following terms and conditions.",
  "You agree to comply with all applicable laws and regulations related to financial transactions and data privacy.",
  "MoneyLog reserves the right to modify, update, or amend these terms at any time. All updates will be posted on this page.",
  "Users are responsible for ensuring their account information is kept confidential. We are not liable for unauthorized access to accounts.",
  "The use of our services must comply with our acceptable usage policies and should not violate the rights of others.",
  "MoneyLog is not responsible for any losses or damages arising from the misuse of the service or unauthorized access to your account.",
];

const TermsAndConditions = () => {
  return (
    <Box className="image">
      <Banner
        heading="Your Agreement with MoneyLog"
        description="By using our services, you agree to comply with the terms outlined below. Please review them carefully."
      />
      <Container
        sx={{ py: 2 }}
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          marginTop: "10px",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", color: "#004080" }}
        >
          Terms & Conditions
        </Typography>

        <Box sx={{ lineHeight: 1.8, fontSize: "1rem", color: "" }}>
          {termsAndConditionsData.map((item, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="body1">{item}</Typography>
              {/* Add divider for visual separation between points */}
              {index !== termsAndConditionsData.length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.875rem", color: "#757575" }}
          >
            © 2025 MoneyLog. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;
