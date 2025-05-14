import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Banner from "../../components/Banner";
import "./ContactUsPage.css";
import Toast, { showToast } from "../../components/Toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

const BASE_URL = "https://moneylog-sachin-singhs-projects-df648d93.vercel.app";
const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const messageRegex = /^[a-zA-Z\s]{2,1000}$/; // Only letters and spaces allowed (max 1000 chars)

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Invalid name (only letters and spaces allowed)";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Message validation
    if (!formData.message) {
      newErrors.message = "Message is required";
    } else if (!messageRegex.test(formData.message)) {
      newErrors.message = "Invalid message (only letters and spaces allowed)";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      try {
        const response = await axios.post(
          `${BASE_URL}/moneylog/contact-us`,
          formData
        );

        const { success, message } = response.data;

        if (success) {
          // Success flow
          setFormData({ name: "", email: "", message: "" });
          showToast(message || "Thank you for contacting us!", "success");
          setOpenModal(true);
        } else {
          // Failure flow
          showToast(
            message || "Something went wrong. Please try again later.",
            "error"
          );

          if (
            message ===
            "You are not a registered member. Please register first."
          ) {
            // Reset form
            setFormData({ name: "", email: "", message: "" });

            // Navigate to Register page after 5 seconds
            setTimeout(() => {
              navigate("/register");
            }, 5000);
          }
        }
      } catch (error) {
        console.error("Error submitting contact form:", error);

        const errorMessage =
          error.response?.data?.message ||
          "An error occurred while submitting the form. Please try again later.";

        showToast(errorMessage, "error");

        if (
          errorMessage ===
          "You are not a registered member. Please register first."
        ) {
          // Reset form
          setFormData({ name: "", email: "", message: "" });

          // Navigate to Register page after 5 seconds
          setTimeout(() => {
            navigate("/register");
          }, 5000);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const navigate = useNavigate();
  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/");
  };

  return (
    <div className="image">
      {/* Banner Section */}
      <Banner
        heading="Get in Touch with MoneyLog"
        description="We'd love to hear from you. Fill out the form below and we will respond as soon as possible."
      />
      <Toast />
      {/* Main Content Section */}
      <Container sx={{ py: 6 }}>
        <Grid container justifyContent="center">
          <Grid item>
            <Paper
              sx={{
                padding: 4,
                width: "full",
                margin: "0 auto",
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  textAlign: "center",
                  color: "#004080",
                  textTransform: "uppercase",
                }}
              >
                Get in Touch
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Name and Email in one row */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Your Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>

                  {/* Message in next row */}
                  <Grid item xs={12}>
                    <TextField
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      multiline
                      rows={4}
                      fullWidth
                      error={!!errors.message}
                      helperText={errors.message}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Modal (Dialog) for Success Message */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle style={{ color: "#063852" }}>Message Received</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            MoneyLog is reviewing your message. You will receive a response
            within 3 days. Please wait for a response in your email.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            If you don't hear from us within 3 days, please feel free to reach
            out again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
