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
} from "@mui/material";
import Banner from "../../components/Banner";
import "./ContactUsPage.css";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      // Handle form submission logic here (e.g., send data to API)
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData({ name: "", email: "", message: "" });
        alert("Thank you for contacting us!");
      }, 2000);
    }
  };

  return (
    <div className="contact-us-page page">
      {/* Banner Section */}
      <Banner
        heading="Get in Touch with MoneyLog"
        description="We'd love to hear from you. Fill out the form below and we will respond as soon as possible."
      />

      {/* Main Content Section */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Image Section */}
          {/* <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Paper sx={{ padding: 2, maxWidth: 400 }}>
              <img
                src="your-image-url-here.jpg" // Replace with a relevant image URL
                alt="Contact Us"
                className="contact-image"
                style={{ width: "100%", height: "auto" }}
              />
            </Paper>
          </Grid> */}

          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 3, boxShadow: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
                Get in Touch
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Name Field */}
                  <FormControl fullWidth>
                    <TextField
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </FormControl>

                  {/* Email Field */}
                  <FormControl fullWidth>
                    <TextField
                      label="Your Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </FormControl>

                  {/* Message Field */}
                  <FormControl fullWidth>
                    <TextField
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      multiline
                      rows={4}
                      error={!!errors.message}
                      helperText={errors.message}
                    />
                  </FormControl>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting ? "Submitting..." : "Send Message"}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ContactUsPage;
