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
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() })); // prevent leading spaces
  };

  // ✅ Secure frontend validation (Anti-XSS & SQLi safe)
  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const messageMaxLength = 1000;
    const badCharsRegex = /[<>;"'`$%{}()=]/;

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
    } else if (formData.message.length > messageMaxLength) {
      newErrors.message = `Message too long (max ${messageMaxLength} characters)`;
    } else if (badCharsRegex.test(formData.message)) {
      newErrors.message = "Message contains invalid characters";
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

        if (response?.data?.success) {
          setFormData({ name: "", email: "", message: "" });
          showToast("Thank you for contacting us!", "success");
          setOpenModal(true);
        } else {
          showToast("Something went wrong. Please try again later.", "error");
        }
      } catch (error) {
        console.error("Contact form error:", error);
        showToast("An error occurred. Please try again later.", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/");
  };

  return (
    <div className="image">
      <Banner
        heading="Get in Touch with MoneyLog"
        description="We'd love to hear from you. Fill out the form below and we will respond as soon as possible."
      />
      <Toast />
      <Container sx={{ py: 6 }}>
        <Grid container justifyContent="center">
          <Grid item>
            <Paper
              sx={{ padding: 4, width: "full", margin: "0 auto", boxShadow: 2 }}
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

              <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
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

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Message Received</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            MoneyLog is reviewing your message. You will receive a response
            within 3 days.
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
