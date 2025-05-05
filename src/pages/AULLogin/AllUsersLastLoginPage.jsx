import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Modal,
} from "@mui/material";
import Loader from "../../components/Loader";

const AllUsersLastLoginPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserLocation, setSelectedUserLocation] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [apiCalling, setApiCalling] = useState(false);

  // Fetch user login history data from the API
  const fetchUserLoginHistory = async () => {
    setApiCalling(true);
    try {
      const response = await axios.get(
        "https://moneylog-sachin-singhs-projects-df648d93.vercel.app/moneylog/admin/login-history"
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    } finally {
      setApiCalling(false);
    }
  };

  // Automatically refresh login history every 15 seconds
  useEffect(() => {
    fetchUserLoginHistory();
    const intervalId = setInterval(fetchUserLoginHistory, 15000);
    return () => clearInterval(intervalId);
  }, []);

  // Handle opening of the location details modal
  const handleOpenLocationDetails = (latitude, longitude) => {
    setSelectedUserLocation({ latitude, longitude });
    setOpenModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUserLocation(null);
  };

  // Get a color for each card based on its index
  const getColor = (index) => {
    const colors = ["#03a9f4", "#4caf50", "#f44336"];
    return colors[index % colors.length];
  };

  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#fff",
        position: "relative",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#00e5ff" }}>
        🛰️ Tracking Dashboard - User Login Locations
      </Typography>

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No user login data available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {users.map((user, index) => (
            <Grid
              item
              xs={12}
              md={4}
              key={user.userId}
              sx={{
                animation: `fadeIn 0.5s ease ${index * 0.2}s forwards`,
                opacity: 0,
              }}
            >
              <Card
                sx={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ color: getColor(index), fontWeight: "bold" }}
                  >
                    {`User ID: ${user.userId}`}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#4caf50" }}>
                    {`Email: ${user.userMail}`}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#f44336" }}>
                    {`Browser: ${user.browser}`}
                  </Typography>
                  <Typography variant="body1">{`OS: ${user.os}`}</Typography>
                  <Typography variant="body1">{`City: ${user.city}`}</Typography>
                  <Typography variant="body1">{`Last login: ${new Date(
                    user.loggedAt
                  ).toLocaleString()}`}</Typography>

                  <Button
                    variant="contained"
                    sx={{
                      marginTop: 2,
                      backgroundColor: "#00e5ff",
                      color: "#000",
                      "&:hover": { backgroundColor: "#00bcd4" },
                    }}
                    onClick={() =>
                      handleOpenLocationDetails(user.latitude, user.longitude)
                    }
                  >
                    Show Location
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal to show location details */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            width: "90%",
            height: "90%",
            margin: "auto",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {selectedUserLocation
              ? `Email: ${users.find((user) => user.latitude === selectedUserLocation.latitude && user.longitude === selectedUserLocation.longitude)?.userMail}`
              : "User Email not available"}
          </Typography>

          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            User Location Map
          </Typography>

          {/* Show the location map if coordinates are available */}
          {selectedUserLocation && (
            <iframe
              title="User Location"
              width="100%"
              height="100%"
              style={{
                backgroundColor: "#105183",
                borderRadius: "4px",
                flexGrow: 1,
              }}
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${selectedUserLocation.latitude},${selectedUserLocation.longitude}&z=15&output=embed`}
              allowFullScreen
            />
          )}

          <Button onClick={handleCloseModal} sx={{ marginTop: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>

      {/* User List Scroll Section */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          left: 0,
          minWidth: "30%",
          height: "300px",
          overflow: "hidden",
          backgroundColor: "rgba(16, 15, 15, 0.7)",
          display: "flex",
          flexDirection: "column",
          borderRadius: "10px",
          marginLeft: "10px",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            marginBottom: 10,
          }}
        >
          <Box className="blinking-light red" />
          <Box className="blinking-light green" />
          <Box className="blinking-light blue" />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            animation: "scroll-up 15s linear infinite",
            overflowY: "hidden",
          }}
        >
          {users.map((user, index) => (
            <Typography
              key={index}
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#00e5ff",
                gap: 2,
              }}
            >
              {`User_: ${user.userMail} - Last login: ${new Date(user.loggedAt).toLocaleString()}`}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* CSS Animations */}
      <style>{`
        .blinking-light {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-bottom: 8px;
          opacity: 0;
          animation: blink-cycle 3s infinite;
        }
        .blinking-light.red {
          background-color: red;
          animation-delay: 0s;
        }
        .blinking-light.green {
          background-color: limegreen;
          animation-delay: 1s;
        }
        .blinking-light.blue {
          background-color: deepskyblue;
          animation-delay: 2s;
        }

        @keyframes blink-cycle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll-up {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(-100%);
          }
        }
      `}</style>
    </Box>
  );
};

export default AllUsersLastLoginPage;
