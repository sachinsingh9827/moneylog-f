import React from "react";
import {
  Button,
  Container,
  TextField,
  FormControl,
  FormHelperText,
  Box,
  Alert,
} from "@mui/material";
import { Formik, Field, Form } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const resetPasswordApi = async (email, password) => {
  const response = await fetch(`${BASE_URL}/moneylog/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to reset password");
  return data;
};

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  if (!email) {
    toast.error("No email found for password reset.");
    navigate("/forgot-password");
    return null;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <h2>Reset Password</h2>
        <Formik
          initialValues={{ password: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.password) errors.password = "Password is required";
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await resetPasswordApi(email, values.password);
              toast.success("Password reset successful!");
              navigate("/login");
            } catch (err) {
              toast.error(err.message);
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              {Object.values(errors).length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {Object.values(errors).map((e, i) => (
                    <div key={i}>- {e}</div>
                  ))}
                </Alert>
              )}
              <Field name="password">
                {({ field }) => (
                  <FormControl
                    fullWidth
                    error={touched.password && Boolean(errors.password)}
                  >
                    <TextField
                      {...field}
                      label="New Password"
                      type="password"
                      size="small"
                      fullWidth
                    />
                    <FormHelperText>
                      {touched.password && errors.password}
                    </FormHelperText>
                  </FormControl>
                )}
              </Field>
              <Button
                type="submit"
                variant="outlined"
                color="info"
                fullWidth
                sx={{ mt: 2 }}
              >
                Update Password
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
