import React from "react";
import {
  Button,
  Container,
  TextField,
  Box,
  FormHelperText,
  FormControl,
  Alert,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { showToast } from "../../components/Toast";
const BASE_URL = "https://moneylog-sachin-singhs-projects-df648d93.vercel.app";

// Validation schema
const validationSchema = Yup.object().shape({
  customer: Yup.string().required("Customer is required"),
  transactionType: Yup.string().required("Transaction type is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be a positive number"),
  date: Yup.date().required("Date is required"),
});

export default function AddTransaction() {
  // Initial values for the form
  const initialValues = {
    customer: "",
    transactionType: "",
    amount: "",
    date: new Date().toISOString().split("T")[0], // Set default date to today's date in YYYY-MM-DD format
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitted values:", values); // Log the submitted values to console

    try {
      // Make the API request to create the transaction
      const response = await axios.post(`${BASE_URL}/transactions/add`, values);
      showToast("Transaction added successfully!", "success");
      resetForm();
    } catch (error) {
      showToast("Failed to add transaction. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle the numeric input for the amount field
  const handleAmountChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // Remove non-numeric characters
    setFieldValue("amount", value); // Set the field value with the cleaned number
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
            maxWidth: 500,
            mx: "auto",
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 16 }}>
            Add New Transaction
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <Form>
                {/* Show validation errors as an alert */}
                {Object.keys(errors).length > 0 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {Object.values(errors).map((err, i) => (
                      <div key={i}>- {err}</div>
                    ))}
                  </Alert>
                )}

                {/* Customer selection */}
                <Field name="customer">
                  {({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Customer</InputLabel>
                      <Select
                        {...field}
                        label="Customer"
                        size="small"
                        error={touched.customer && Boolean(errors.customer)}
                      >
                        {/* Replace with dynamic customer list */}
                        <MenuItem value="customer1">Customer 1</MenuItem>
                        <MenuItem value="customer2">Customer 2</MenuItem>
                        <MenuItem value="customer3">Customer 3</MenuItem>
                      </Select>
                      <FormHelperText error>
                        {touched.customer && errors.customer}
                      </FormHelperText>
                    </FormControl>
                  )}
                </Field>

                {/* Transaction Type selection (Debit or Credit) */}
                <Field name="transactionType">
                  {({ field }) => (
                    <FormControl component="fieldset" fullWidth margin="normal">
                      <RadioGroup {...field} row>
                        <FormControlLabel
                          value="debit"
                          control={<Radio />}
                          label="Recive"
                        />
                        <FormControlLabel
                          value="credit"
                          control={<Radio />}
                          label="Credit"
                        />
                      </RadioGroup>
                      {touched.transactionType && errors.transactionType && (
                        <FormHelperText error>
                          {errors.transactionType}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                </Field>

                {/* Amount field */}
                <Field name="amount">
                  {({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <TextField
                        {...field}
                        label="Amount"
                        variant="outlined"
                        size="small"
                        type="text" // Set to text so we can control the input
                        onInput={(e) => handleAmountChange(e, setFieldValue)} // Handle the input change
                        error={touched.amount && Boolean(errors.amount)}
                      />
                      <FormHelperText error>
                        {touched.amount && errors.amount}
                      </FormHelperText>
                    </FormControl>
                  )}
                </Field>

                {/* Date field */}
                <Field name="date">
                  {({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <TextField
                        {...field}
                        label="Date"
                        variant="outlined"
                        size="small"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={touched.date && Boolean(errors.date)}
                      />
                      <FormHelperText error>
                        {touched.date && errors.date}
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
                  sx={{ mt: 2 }}
                  disabled={isSubmitting}
                >
                  Add Transaction
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
}
