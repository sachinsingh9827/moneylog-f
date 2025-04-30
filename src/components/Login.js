// components/SlotsSignIn.js
import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
  Container,
  FormHelperText,
  Box,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast, { showToast } from "./Toast"; // Assuming you've created this for showing toast messages
import { useAuth } from "../context/AuthContext";
import "./css/Login.css";

const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "https://moneylog-sachin-singhs-projects-df648d93.vercel.app";

function CustomEmailField() {
  return (
    <Field name="email">
      {({ field, form }) => (
        <FormControl
          fullWidth
          error={form.touched.email && Boolean(form.errors.email)}
        >
          <TextField
            {...field}
            label="Email"
            type="email"
            size="small"
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle fontSize="inherit" />
                </InputAdornment>
              ),
            }}
          />
          <FormHelperText>
            {form.touched.email && form.errors.email}
          </FormHelperText>
        </FormControl>
      )}
    </Field>
  );
}

function CustomPasswordField({ showPassword, toggleShowPassword }) {
  return (
    <Field name="password">
      {({ field, form }) => (
        <FormControl
          fullWidth
          variant="outlined"
          sx={{ my: 2 }}
          error={form.touched.password && Boolean(form.errors.password)}
        >
          <InputLabel size="small" htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            {...field}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            size="small"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={toggleShowPassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="inherit" />
                  ) : (
                    <Visibility fontSize="inherit" />
                  )}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormHelperText>
            {form.touched.password && form.errors.password}
          </FormHelperText>
        </FormControl>
      )}
    </Field>
  );
}

export default function SlotsSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const navigate = useNavigate();
  const { login } = useAuth(); // context-based login

  const initialValues = {
    email: "",
    password: "",
    tandc: false,
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email format";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Minimum 6 characters";
    } else if (
      !/[a-zA-Z]/.test(values.password) ||
      !/[0-9]/.test(values.password)
    ) {
      errors.password = "Must contain letters and numbers";
    }

    if (!values.tandc) {
      errors.tandc = "You must agree to the terms";
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${BASE_URL}/moneylog/users/login`, {
        email: values.email,
        password: values.password,
      });

      const { user, token } = res.data;
      login({ user, token }); // updates context + localStorage
      showToast(`Welcome back, ${user.name}!`, "success");
      navigate("/dashboard"); // Navigate to dashboard after successful login
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 ||
          error.response.data?.message?.includes("User not found"))
      ) {
        showToast("User not found. Redirecting to registration...", "info");
        setTimeout(() => {
          navigate("/register");
        }, 1000);
      } else if (error.response && error.response.status === 403) {
        // Handle the 403 Forbidden case (account deactivated)
        showToast(
          error.response.data?.message ||
            "Your account has been deactivated. Please contact support for assistance.",
          "error"
        );
        setTimeout(() => {
          navigate("/contact-us"); // Navigate to the contact us page
        }, 3000);
      } else {
        showToast("Login failed. Please check credentials.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "95.4vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="login"
    >
      <Toast />
      <Container maxWidth="sm">
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 3,
            p: 3,
            maxWidth: 400,
            mx: "auto",
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ marginBottom: 8, textAlign: "center" }}>Login</h2>

          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ errors, isSubmitting }) => (
              <Form>
                {Object.values(errors).length > 0 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {Object.values(errors).map((err, i) => (
                      <div key={i}>- {err}</div>
                    ))}
                  </Alert>
                )}
                <CustomEmailField />
                <CustomPasswordField
                  showPassword={showPassword}
                  toggleShowPassword={toggleShowPassword}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Field name="tandc">
                    {({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} color="primary" />}
                        label="I agree with the T&C"
                        sx={{ fontSize: 14 }}
                      />
                    )}
                  </Field>
                  <Link
                    href="/forgot-password"
                    variant="body2"
                    style={{ marginTop: "10px" }}
                  >
                    Forgot password?
                  </Link>
                </Box>
                <Button
                  type="submit"
                  variant="outlined"
                  color="info"
                  size="small"
                  fullWidth
                  sx={{ my: 2 }}
                  disabled={isSubmitting}
                >
                  Sign In
                </Button>
                <Box sx={{ textAlign: "center" }}>
                  <p>
                    Don't have an account?{" "}
                    <Link href="/register" variant="body2">
                      Register here
                    </Link>
                  </p>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
}
