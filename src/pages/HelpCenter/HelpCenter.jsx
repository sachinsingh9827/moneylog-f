import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Divider,
} from "@mui/material";
import Banner from "../../components/Banner";
import Footer from "../Footer/Footer";

const helpData = {
  login: [
    "You selected: Login Issue",
    "Possible reasons: Incorrect password, user not found, or account deactivated.",
    "Solution: Try resetting your password.",
    "Step 1: Enter your email address.",
    "Step 2: Check your inbox for the OTP.",
    "Step 3: Enter the OTP to verify your identity.",
    "Step 4: Set a new password.",
    "You can now log in with your new password.",
    "If your account is deactivated, please contact support to reactivate it.",
  ],
  register: [
    "You selected: Register Issue",
    "Make sure all required fields are filled correctly.",
    "Ensure email is valid and not already used.",
    "If issue persists, contact support.",
  ],
  forgotPassword: [
    "You selected: Forgot Password",
    "Click on 'Forgot Password' on the login page.",
    "Enter your registered email.",
    "Check your email for the OTP.",
    "Enter the OTP and set a new password.",
  ],
  addCustomer: [
    "You selected: Add Customer",
    "Go to the Customers section in your dashboard.",
    "Click 'Add New Customer'.",
    "Fill in the required details and click Save.",
  ],
  transaction: [
    "You selected: Add Transaction History",
    "Navigate to the Transactions tab.",
    "Click on 'Add Transaction'.",
    "Enter transaction details and save.",
  ],
  updateProfile: [
    "You selected: Update Profile",
    "Click on your profile icon and choose 'Edit Profile'.",
    "Make necessary changes and click Update.",
  ],
  billing: [
    "You selected: Billing Issue",
    "Check your billing history in the Billing tab.",
    "Ensure payment method is valid.",
    "Contact support if charges are incorrect.",
  ],
  account: [
    "You selected: Account Issue",
    "Your account may have been deactivated.",
    "If you're seeing a '403 Forbidden' error during login, your account is inactive.",
    "To reactivate your account, please contact support.",
    "You can also send a reactivation request through the contact form in the app.",
    "Our team will review and assist you with reactivating your account.",
  ],
};

export default function HelpCenter() {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, currentText]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (
      selectedTopic &&
      messageIndex < helpData[selectedTopic].length &&
      charIndex < helpData[selectedTopic][messageIndex].length
    ) {
      setLoading(true);
      const timer = setTimeout(() => {
        setCurrentText(
          (prev) => prev + helpData[selectedTopic][messageIndex][charIndex]
        );
        setCharIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timer);
    } else if (
      selectedTopic &&
      messageIndex < helpData[selectedTopic].length &&
      charIndex === helpData[selectedTopic][messageIndex].length
    ) {
      setLoading(false);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          helpData[selectedTopic][messageIndex],
        ]);
        setMessageIndex((prev) => prev + 1);
        setCharIndex(0);
        setCurrentText("");
      }, 400);
    }
  }, [charIndex, messageIndex, selectedTopic]);

  const handleSelect = (e) => {
    const topic = e.target.value;
    setSelectedTopic(topic);
    setChatMessages([]);
    setMessageIndex(0);
    setCurrentText("");
    setCharIndex(0);
    setLoading(false);
  };

  const handleReset = () => {
    setSelectedTopic("");
    setChatMessages([]);
    setMessageIndex(0);
    setCurrentText("");
    setCharIndex(0);
    setLoading(false);
  };

  return (
    <div
      className="image
    "
    >
      {" "}
      <Banner
        heading="Need Help? Find Solutions to Your Issues"
        description="Browse through common issues and find step-by-step assistance to resolve your problem."
      />
      <Box
        sx={{
          maxWidth: "auto",
          margin: "10px",
          padding: "2rem",
        }}
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          style={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
            color: "#004080",
          }}
        >
          Help Center
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Select an issue below to get step-by-step assistance.
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select an Issue</InputLabel>
          <Select
            value={selectedTopic}
            onChange={handleSelect}
            label="Select an Issue"
          >
            <MenuItem value="login">Login Issue</MenuItem>
            <MenuItem value="register">Register Issue</MenuItem>
            <MenuItem value="forgotPassword">Forgot Password</MenuItem>
            <MenuItem value="addCustomer">Add Customer</MenuItem>
            <MenuItem value="transaction">Add Transaction History</MenuItem>
            <MenuItem value="updateProfile">Update Profile</MenuItem>
            <MenuItem value="billing">Billing Issue</MenuItem>
            <MenuItem value="account">Account Issue</MenuItem>
          </Select>
        </FormControl>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            marginTop: "1rem",
            backgroundColor: "#f9f9f9",
            minHeight: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {selectedTopic === "" && (
            <Typography variant="body1" color="text.secondary">
              Please select a help topic from the dropdown above.
            </Typography>
          )}
          {[...chatMessages, currentText].map((msg, index) => {
            const isQuestion = msg.startsWith("You selected:");
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: isQuestion ? "flex-start" : "flex-end",
                  marginBottom: "0.5rem",
                }}
              >
                <Paper
                  sx={{
                    padding: "0.6rem 1rem",
                    backgroundColor: isQuestion ? "#d4edda" : "#d1ecf1",
                    color: isQuestion ? "#155724" : "#0c5460",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="body1">
                    {isQuestion ? (
                      <>
                        {msg.replace("You selected:", "Your Question:").trim()}
                      </>
                    ) : (
                      msg
                    )}
                  </Typography>
                </Paper>
              </Box>
            );
          })}

          {/* Dots container positioned at bottom-right of the chat */}
          {loading && (
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                display: "flex",
                gap: "6px",
                fontSize: "24px",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#0c5460",
                  animation: "dot1 1.5s infinite ease-in-out",
                }}
              ></div>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#0c5460",
                  animation: "dot2 1.5s infinite ease-in-out",
                }}
              ></div>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#0c5460",
                  animation: "dot3 1.5s infinite ease-in-out",
                }}
              ></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </Box>
        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 2 }}
          onClick={handleReset}
          maxWidth={2}
        >
          Start Over
        </Button>
        <Divider sx={{ my: 4 }} />
        <style>
          {`
          @keyframes dot1 {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
          }

          @keyframes dot2 {
            0%, 100% { opacity: 0; }
            40% { opacity: 0; }
            60% { opacity: 1; }
            80% { opacity: 0; }
          }

          @keyframes dot3 {
            0%, 60%, 100% { opacity: 0; }
            80% { opacity: 1; }
          }
        `}
        </style>{" "}
      </Box>{" "}
      <Footer />
    </div>
  );
}
