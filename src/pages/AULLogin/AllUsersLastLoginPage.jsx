import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const AllUsersLastLoginPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserLoginHistory = async () => {
      try {
        const response = await axios.get(
          "https://moneylog-sachin-singhs-projects-df648d93.vercel.app/moneylog/admin/login-history"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserLoginHistory();
  }, []);

  const renderMap = (latitude, longitude) => (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: "200px", width: "100%", zIndex: 0 }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[latitude, longitude]}>
        <Popup>
          Location: {latitude}, {longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        All Users' Last Login Locations
      </Typography>

      {users.length === 0 ? (
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
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}
                  >{`Email: ${user.userMail}`}</Typography>
                  <Typography variant="body1">{`Browser: ${user.browser}`}</Typography>
                  <Typography variant="body1">{`OS: ${user.os}`}</Typography>
                  <Typography variant="body1">{`City: ${user.city}`}</Typography>
                  <Typography variant="body1">{`Last login: ${new Date(
                    user.loggedAt
                  ).toLocaleString()}`}</Typography>

                  {user.latitude &&
                  user.longitude &&
                  typeof window !== "undefined" ? (
                    <div style={{ marginTop: "10px" }}>
                      {renderMap(user.latitude, user.longitude)}
                    </div>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Location not available.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AllUsersLastLoginPage;
