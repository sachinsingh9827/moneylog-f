import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null); // Track original data
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch authenticated user data
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          setOriginalUserData(parsedUser); // Set original data
        } else {
          toast.error("No user found in local storage");
        }
      } catch (err) {
        toast.error("Failed to load user data");
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);

    const isDataChanged =
      userData.name !== originalUserData.name ||
      userData.secName !== originalUserData.secName ||
      userData.mobile !== originalUserData.mobile ||
      userData.email !== originalUserData.email;

    if (!isDataChanged) {
      toast.info("No changes made to the profile.");
      setLoading(false);
      setEditing(false);
      return;
    }

    const updatedData = {
      id: userData.id,
      name: userData.name,
      secName: userData.secName,
      mobile: userData.mobile,
      email: userData.email,
    };

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/moneylog/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Proper format
        },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Profile updated!");
        setUserData(result.user || userData);
        setOriginalUserData(result.user || userData);
        setEditing(false);
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!userData)
    return (
      <div className="profile-wrapper">
        <Loader />
      </div>
    );

  return (
    <div className="page">
      <Container maxWidth="md">
        <ToastContainer />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              marginTop: "16px",
            }}
          >
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            {/* <img
            src={userData.profileImage || "default-image-path.jpg"}
            alt="Profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          /> */}
            <Box sx={{ my: 2 }}>
              <Typography variant="h6">{userData.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {userData.secName || "Nickname not provided"}
              </Typography>
              <Typography variant="body2">{userData.email}</Typography>
              <Typography variant="body2">
                {userData.mobile || "Mobile not added"}
              </Typography>
            </Box>
          </Box>
          {!editing && (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
          {editing && (
            <Box sx={{ mt: 3, width: "100%" }}>
              <Typography variant="h6" mb={2}>
                Edit Profile
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Second Name"
                    name="secName"
                    value={userData.secName}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={userData.email}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    name="mobile"
                    value={userData.mobile}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Profile;
