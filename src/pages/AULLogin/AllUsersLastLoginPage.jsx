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
    const intervalId = setInterval(fetchUserLoginHistory, 5000);

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
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2603.6447793129446!2d${selectedUserLocation.longitude}!3d${selectedUserLocation.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39846342c48bfa0b%3A0x3d376405cd191bb8!2sSanskaar%20Valley%20School!5e1!3m2!1sen!2sin!4v1731905162582!5m2!1sen!2sin`}
                  width="100%"
                  height="480"
                  frameBorder="0"
                  style={{
                    backgroundColor: "#105183",
                    borderRadius: "4px",
                  }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
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
