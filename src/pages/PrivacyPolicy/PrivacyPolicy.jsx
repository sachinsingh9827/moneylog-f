import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import Banner from "../../components/Banner";
import Footer from "../Footer/Footer";

// Updated privacy policy data for your MoneyLog project
const privacyPolicyData = [
  "At MoneyLog, we respect your privacy. This Privacy Policy describes how we collect, use, and safeguard your personal information when you use our platform.",
  "We collect personal information, such as your name, email address, phone number, and financial data, when you register or use our services.",
  "Your information is used for purposes such as creating and managing your account, facilitating transactions, and providing customer support.",
  "MoneyLog does not sell, rent, or lease your personal data to third parties. We may share your information only when required by law or for necessary service provisions.",
  "We use state-of-the-art security technologies to protect your data, including encryption protocols and regular security audits.",
  "You have full control over your personal data. You can view, update, and request deletion of your information at any time by contacting our support team.",
  "The MoneyLog team is committed to protecting your privacy. We do not exploit, misuse, or disclose your personal data. Your data is stored securely and handled with the utmost confidentiality.",
  "We may use certain non-sensitive data, such as location or device type, to enhance your overall experience with MoneyLog. This helps us improve our services and ensure smoother functionality. Please feel free and confident using our platform—we are always focused on your safety and satisfaction.",
];

const PrivacyPolicy = () => {
  return (
    <div className="image">
      <Box>
        <Banner
          heading="Your Privacy Matters at MoneyLog"
          description="We value your privacy and are committed to keeping your personal data safe. Learn how we protect your information."
        />
        <Container
          sx={{ py: 2 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
              color: "#004080",
            }}
          >
            Privacy Policy
          </Typography>

          <Box sx={{ lineHeight: 1.8, fontSize: "1rem", color: "#333" }}>
            {privacyPolicyData.map((item, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="body1">{item}</Typography>
                {/* Add divider for visual separation between points */}
                {index !== privacyPolicyData.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>{" "}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
