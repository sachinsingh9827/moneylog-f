import * as React from "react";
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
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import { showToast } from "./Toast";

const BASE_URL = "https://moneylog-sachin-singhs-projects-df648d93.vercel.app";

// ======= Custom Fields =======
function CustomEmailField() {
  return (
    <Field name="email">
      {({ field, form }) => (
        <FormControl
          fullWidth
          margin="normal"
          error={form.touched.email && Boolean(form.errors.email)}
        >
          <TextField
            {...field}
            label="Email"
            type="email"
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle fontSize="small" />
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

function CustomNameField() {
  return (
    <Field name="name">
      {({ field, form }) => (
        <FormControl
          fullWidth
          margin="normal"
          error={form.touched.name && Boolean(form.errors.name)}
        >
          <TextField
            {...field}
            label="Name"
            type="text"
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <FormHelperText>
            {form.touched.name && form.errors.name}
          </FormHelperText>
        </FormControl>
      )}
    </Field>
  );
}

function CustomPasswordField({
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
}) {
  return (
    <Field name="password">
      {({ field, form }) => (
        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
          error={form.touched.password && Boolean(form.errors.password)}
        >
          <InputLabel size="small">Password</InputLabel>
          <OutlinedInput
            {...field}
            type={showPassword ? "text" : "password"}
            size="small"
            label="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>
            {form.touched.password && form.errors.password}
          </FormHelperText>
        </FormControl>
      )}
    </Field>
  );
}

function CustomConfirmPasswordField({
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
}) {
  return (
    <Field name="confirmPassword">
      {({ field, form }) => (
        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
          error={
            form.touched.confirmPassword && Boolean(form.errors.confirmPassword)
          }
        >
          <InputLabel size="small">Confirm Password</InputLabel>
          <OutlinedInput
            {...field}
            type={showPassword ? "text" : "password"}
            size="small"
            label="Confirm Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>
            {form.touched.confirmPassword && form.errors.confirmPassword}
          </FormHelperText>
        </FormControl>
      )}
    </Field>
  );
}

function AgreeWithTerms() {
  return (
    <Field name="tandc">
      {({ field, form }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={field.value}
              color="primary"
              size="small"
            />
          }
          label="I agree with the T&C"
        />
      )}
    </Field>
  );
}

// ======= Main Component =======
export default function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    tandc: false,
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Name is required";
    else if (values.name.length < 2)
      errors.name = "Name must be at least 2 characters";

    if (!values.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email))
      errors.email = "Invalid email format";

    if (!values.password) errors.password = "Password is required";
    else if (values.password.length < 6)
      errors.password = "Minimum 6 characters";
    else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password))
      errors.password = "Include letters and numbers";

    if (!values.confirmPassword)
      errors.confirmPassword = "Confirm your password";
    else if (values.password !== values.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (!values.tandc)
      errors.tandc = "You must agree to the terms and conditions";

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await axios.post(`${BASE_URL}/moneylog/users/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      const successMessage = `User registered successfully. Welcome, ${res.data.user.name}!`;
      showToast(successMessage, "success");

      // Reset the form after successful registration
      resetForm();

      // Redirect to the login page
      window.location.href = "/login"; // Adjust based on your routing
    } catch (err) {
      console.error("Registration failed:", err);

      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      showToast(errorMessage, "error");
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
      className="image"
    >
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
          <h2 style={{ marginBottom: 16, textAlign: "center" }}>Register</h2>
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ errors, isSubmitting }) => (
              <Form noValidate>
                {Object.keys(errors).length > 0 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {Object.values(errors).map((err, i) => (
                      <div key={i}>• {err}</div>
                    ))}
                  </Alert>
                )}

                <CustomNameField />
                <CustomEmailField />
                <CustomPasswordField
                  showPassword={showPassword}
                  handleClickShowPassword={handleClickShowPassword}
                  handleMouseDownPassword={handleMouseDownPassword}
                />
                <CustomConfirmPasswordField
                  showPassword={showPassword}
                  handleClickShowPassword={handleClickShowPassword}
                  handleMouseDownPassword={handleMouseDownPassword}
                />
                <Box sx={{ mt: 1 }}>
                  <AgreeWithTerms />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="small"
                  sx={{ mt: 2 }}
                  disabled={isSubmitting}
                >
                  Register
                </Button>

                <Link
                  href="/login"
                  variant="body2"
                  display="block"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  Back to login
                </Link>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
}
