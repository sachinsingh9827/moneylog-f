import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Drawer,
  Modal,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import ResolvedMessagesPage from "./ResolvedMessagesPage";

const BASE_URL = "https://moneylog-sachin-singhs-projects-df648d93.vercel.app";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          setOriginalUserData(parsedUser);
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
    const { name, value } = e.target;

    // Prevent email from changing
    if (name === "email") {
      toast.info("Email cannot be changed");
      return;
    }

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setEditing(true);
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);

    const isDataChanged =
      userData.name !== originalUserData.name ||
      userData.secName !== originalUserData.secName ||
      userData.mobile !== originalUserData.mobile;

    if (!isDataChanged) {
      toast.info("No changes made to the profile.");
      setLoading(false);
      setEditing(false);
      setDrawerOpen(false);
      return;
    }

    const updatedData = {
      id: userData.id,
      name: userData.name,
      secName: userData.secName,
      mobile: userData.mobile,
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Profile updated!");
        setUserData(result.user || userData);
        setOriginalUserData(result.user || userData);
        setEditing(false);
        setDrawerOpen(false);
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
  const handleDeactivate = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/moneylog/users/deactivate`, {
        method: "PATCH", // PATCH as per your route
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Account deactivated successfully.");
        // Optional: logout user, clear localStorage, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error(result.message || "Failed to deactivate account.");
      }
    } catch (err) {
      console.error("Deactivate error:", err);
      toast.error("Something went wrong while deactivating the account!");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="profile-wrapper">
        <Loader />
      </div>
    );
  }

  return (
    <div className="page">
      <Container sx={{ padding: "10px" }}>
        <ToastContainer />

        {/* Profile Header */}
        <Box
          sx={{
            backgroundColor: "white",
            color: "#004080",
            padding: 2,
            borderRadius: 2,
            marginBottom: 3,
            textAlign: "center",
          }}
        >
          {/* <Avatar
            sx={{ width: 80, height: 80, margin: "0 auto", marginBottom: 2 }}
            src={userData.profileImage || "https://via.placeholder.com/150"}
          /> */}
          <Typography variant="h5">{userData.name}</Typography>
          <Typography variant="body1">{userData.email}</Typography>
        </Box>

        {/* Profile Info */}
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Secondary Name"
                  name="secName"
                  value={userData.secName}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile"
                  name="mobile"
                  value={userData.mobile}
                  onChange={handleChange}
                  fullWidth
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={userData.email}
                  fullWidth
                  disabled
                  onFocus={() => toast.info("Email cannot be changed")}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
            >
              {!editing ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              )}

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setOpenConfirmModal(true)}
              >
                Delete Account
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Edit Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 300, padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Edit Profile
            </Typography>
            <TextField
              label="Full Name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Secondary Name"
              name="secName"
              value={userData.secName}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={userData.mobile}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={userData.email}
              fullWidth
              disabled
              onFocus={() => toast.info("Email cannot be changed")}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              fullWidth
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Drawer>

        <ResolvedMessagesPage />

        {/* Confirm Delete Modal */}
        <Modal
          open={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Are you sure you want to delete your account?
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeactivate();
                setOpenConfirmModal(false);
              }}
              sx={{ mr: 2 }}
            >
              Yes, Delete
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenConfirmModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default Profile;
