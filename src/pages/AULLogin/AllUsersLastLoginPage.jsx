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

  const fetchUserLoginHistory = async () => {
    try {
      const response = await axios.get(
        "https://moneylog-sachin-singhs-projects-df648d93.vercel.app/moneylog/admin/login-history"
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLoginHistory();
    const intervalId = setInterval(fetchUserLoginHistory, 15000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const handleOpenMap = (latitude, longitude) => {
    setSelectedUserLocation({ latitude, longitude });
    setOpenModal(true);
  };

  const handleCloseMap = () => {
    setOpenModal(false);
    setSelectedUserLocation(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        All Users' Last Login Locations
      </Typography>

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No user login data available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} md={4} key={user.userId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{`User ID: ${user.userId}`}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {`Email: ${user.userMail}`}
                  </Typography>
                  <Typography variant="body1">{`Browser: ${user.browser}`}</Typography>
                  <Typography variant="body1">{`OS: ${user.os}`}</Typography>
                  <Typography variant="body1">{`City: ${user.city}`}</Typography>
                  <Typography variant="body1">{`Last login: ${new Date(
                    user.loggedAt
                  ).toLocaleString()}`}</Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenMap(user.latitude, user.longitude)}
                    sx={{ marginTop: 2 }}
                  >
                    Show Location on Map
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal to show map */}
      <Modal open={openModal} onClose={handleCloseMap}>
        <Box
          sx={{
            width: "80%",
            height: "80%",
            margin: "auto",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: 3,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            User Location
          </Typography>
          {selectedUserLocation && (
            <div className="w-full md:w-1/3 md:h-screen">
              <div className="h-full w-full mt-8">
                <iframe
                  title="User Location"
                  width="100%"
                  height="480"
                  style={{
                    backgroundColor: "#105183",
                    borderRadius: "4px",
                  }}
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${selectedUserLocation.latitude},${selectedUserLocation.longitude}&z=15&output=embed`}
                  allowFullScreen
                />
              </div>
            </div>
          )}
          <Button onClick={handleCloseMap} sx={{ marginTop: 2 }}>
            Close Map
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllUsersLastLoginPage;
