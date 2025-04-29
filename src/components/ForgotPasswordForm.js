import * as React from "react";
import {
  Button,
  FormControl,
  TextField,
  InputAdornment,
  Link,
  Alert,
  Container,
  FormHelperText,
  Box,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

// API functions
const sendOtpApi = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/moneylog/users/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (response.ok) return data;
    throw new Error(data.message || "Failed to send OTP");
  } catch (error) {
    console.error(error);
    throw new Error("Network error, please try again later.");
  }
};

const verifyOtpApi = async (email, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/moneylog/users/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (response.ok) return data;
    throw new Error(data.message || "Invalid OTP");
  } catch (error) {
    console.error(error);
    throw new Error("Network error, please try again later.");
  }
};

const resetPasswordApi = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/moneylog/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) return data;
    throw new Error(data.message || "Failed to reset password");
  } catch (error) {
    console.error(error);
    throw new Error("Network error, please try again later.");
  }
};

// Field components
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
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle fontSize="inherit" />
                  </InputAdornment>
                ),
              },
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

function CustomOtpField() {
  return (
    <Field name="otp">
      {({ field, form }) => (
        <FormControl
          fullWidth
          error={form.touched.otp && Boolean(form.errors.otp)}
        >
          <TextField
            {...field}
            label="Enter OTP"
            type="text"
            size="small"
            required
            fullWidth
            variant="outlined"
          />
          <FormHelperText>{form.touched.otp && form.errors.otp}</FormHelperText>
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
          error={form.touched.password && Boolean(form.errors.password)}
        >
          <TextField
            {...field}
            label="New Password"
            type={showPassword ? "text" : "password"}
            size="small"
            required
            fullWidth
            variant="outlined"
            style={{ marginTop: "10px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormHelperText>
            {form.touched.password && form.errors.password}
          </FormHelperText>
        </FormControl>
      )}
    </Field>
  );
}

function CustomButton({ label }) {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      {label}
    </Button>
  );
}

function BackToLoginLink({ onClick }) {
  return (
    <Link
      href="#"
      variant="body2"
      onClick={onClick}
      sx={{ display: "block", textAlign: "center" }}
    >
      Back to Login
    </Link>
  );
}

function Title({ text }) {
  return <h2 style={{ marginBottom: 8 }}>{text}</h2>;
}

// Main component
export default function ForgotPasswordForm() {
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const initialValues = {
    email: "",
    otp: "",
    password: "",
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    }

    if (otpSent && !otpVerified && !values.otp) {
      errors.otp = "OTP is required";
    }

    if (otpVerified && !values.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!otpSent) {
        const result = await sendOtpApi(values.email);
        console.log("OTP sent:", result);
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else if (otpSent && !otpVerified) {
        const result = await verifyOtpApi(values.email, values.otp);
        console.log("OTP verified:", result);
        setOtpVerified(true);
        toast.success("OTP verified successfully!");
      } else if (otpSent && otpVerified) {
        const result = await resetPasswordApi(values.email, values.password);
        console.log("Password reset:", result);
        toast.success("Password reset successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    }

    setSubmitting(false);
  };

  function handleBackToLoginClick() {
    navigate("/login");
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Title text={"Forgot Password"} />
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form>
              {Object.values(errors).length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {Object.values(errors).map((error, i) => (
                    <div key={i}>- {error}</div>
                  ))}
                </Alert>
              )}
              <CustomEmailField />
              {otpSent && !otpVerified && <CustomOtpField />}
              {otpVerified && (
                <CustomPasswordField
                  showPassword={showPassword}
                  toggleShowPassword={toggleShowPassword}
                />
              )}
              <CustomButton
                label={
                  !otpSent
                    ? "Send OTP"
                    : otpSent && !otpVerified
                      ? "Verify OTP"
                      : "Update Password"
                }
              />
              <div
                style={{ display: "flex", justifyContent: "end", marginTop: 8 }}
              >
                <BackToLoginLink onClick={handleBackToLoginClick} />
              </div>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
