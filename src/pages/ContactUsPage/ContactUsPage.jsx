import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
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
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.message) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Make an API call to submit the contact form
        const response = await axios.post(
          `${BASE_URL}/moneylog/contact-us`,
          formData
        );

        if (response.data.success) {
          // If the message is successfully saved
          setFormData({ name: "", email: "", message: "" }); // Clear the form
          showToast("Thank you for contacting us!", "success"); // Success message
          setOpenModal(true); // Open the modal after successful submission
        } else {
          showToast("Something went wrong. Please try again later.", "error"); // Handle failure if any
        }
      } catch (error) {
        console.error("Error submitting contact form:", error);
        showToast(
          "An error occurred while submitting the form. Please try again later.",
          "error"
        );
      } finally {
        setIsSubmitting(false); // Reset the submitting state
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
        <DialogTitle>Message Received</DialogTitle>
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
    </div>
  );
};

export default ContactUsPage;
