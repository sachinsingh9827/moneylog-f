import React from "react";
import {
  Button,
  Container,
  TextField,
  Box,
  FormHelperText,
  FormControl,
  Alert,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Toast, { showToast } from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import InstructionsPage from "../InstructionsPage";

const BASE_URL = "https://moneylog-sachin-singhs-projects-df648d93.vercel.app";

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  mobile: Yup.string()
    .matches(
      /^[6-9]\d{9}$/,
      "Mobile number must be a valid 10-digit Indian number"
    )
    .required("Mobile number is required"),
  address: Yup.string(), // Optional field
});

// Initial values for the form
const initialValues = {
  name: "",
  email: "",
  mobile: "",
  address: "", // Optional field
};

export default function SlotsAddCustomer() {
  const navigate = useNavigate();

  // Retrieve the user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const { email, id, mobile, name, role, secName } = userData || {};

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitted values:", values); // Log the submitted values

    // Retrieve the user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));

    // Extract only the userId from the userData object
    const { id: userId } = userData || {}; // Only the id is extracted

    if (!userId) {
      showToast("User not logged in. Please log in first.", "error");
      return;
    }

    try {
      // Add only the userId from localStorage and the form values
      const customerData = {
        ...values, // Include the form values (name, email, mobile, etc.)
        userId, // Include only the userId from localStorage
      };

      // Make the API request to add the customer
      const response = await axios.post(
        `${BASE_URL}/moneylog/customers/create`,
        customerData
      );

      // Show success toast with the message from the response or a default message
      showToast(
        response.data.message || "Customer added successfully!",
        "success"
      );

      // Reset the form and navigate after a short delay
      resetForm();
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      // If the error is from the response, show the error message
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add customer. Please try again.";

      // Show error toast with the message
      showToast(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    window.history.back(); // Navigates to the previous page
  };

  return (
    <div className="page">
      <Button variant="outlined" onClick={handleBack} style={{ margin: 16 }}>
        Back
      </Button>
      <Toast />
      <Box
        sx={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              boxShadow: 3,
              p: 3,
              mx: "auto",
              backgroundColor: "#fff",
            }}
          >
            <h2
              style={{
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#004080",
              }}
            >
              Add Customer
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  {/* Show validation errors as an alert */}
                  {Object.keys(errors).length > 0 && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {Object.values(errors).map((err, i) => (
                        <div key={i}>- {err}</div>
                      ))}
                    </Alert>
                  )}

                  {/* Name field */}
                  <Field name="name">
                    {({ field }) => (
                      <FormControl fullWidth margin="normal">
                        <TextField
                          {...field}
                          label="Customer Name"
                          variant="outlined"
                          size="small"
                          error={touched.name && Boolean(errors.name)}
                        />
                        <FormHelperText error>
                          {touched.name && errors.name}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>

                  {/* Email field */}
                  <Field name="email">
                    {({ field }) => (
                      <FormControl fullWidth margin="normal">
                        <TextField
                          {...field}
                          label="Customer Email"
                          variant="outlined"
                          size="small"
                          type="email"
                          error={touched.email && Boolean(errors.email)}
                        />
                        <FormHelperText error>
                          {touched.email && errors.email}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>

                  {/* Mobile field */}
                  <Field name="mobile">
                    {({ field }) => (
                      <FormControl fullWidth margin="normal">
                        <TextField
                          {...field}
                          label="Customer Mobile"
                          variant="outlined"
                          size="small"
                          type="tel"
                          error={touched.mobile && Boolean(errors.mobile)}
                        />
                        <FormHelperText error>
                          {touched.mobile && errors.mobile}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>

                  {/* Address field (optional) */}
                  <Field name="address">
                    {({ field }) => (
                      <FormControl fullWidth margin="normal">
                        <TextField
                          {...field}
                          label="Customer Address"
                          variant="outlined"
                          size="small"
                          error={touched.address && Boolean(errors.address)}
                        />
                        <FormHelperText error>
                          {touched.address && errors.address}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Field>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      mt: 2,
                      backgroundColor: "#004080", // Custom background color
                      color: "#fff", // Text color
                      "&:hover": {
                        backgroundColor: "#003366", // Hover color
                      },
                    }}
                    disabled={isSubmitting}
                  >
                    Add Customer
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>

          <InstructionsPage
            title="Steps to Add a New Customer"
            steps={[
              "Enter customer name.",
              "Enter customer email.",
              "Enter customer mobile number.",
              "Enter customer address (optional).",
              "Click 'Add Customer' button.",
            ]}
          />
        </Container>
      </Box>
    </div>
  );
}
