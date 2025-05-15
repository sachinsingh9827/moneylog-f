import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Container,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const ResolvedMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setEmail(user.email);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!email) return;

    const fetchResolvedMessages = async () => {
      try {
        const response = await axios.get(
          `https://moneylog-sachin-singhs-projects-df648d93.vercel.app/moneylog/messages/${email}/resolved`
        );
        if (response.data.success) {
          setMessages(response.data.data);
          if (response.data.data.length > 0) {
            setName(response.data.data[0].name);
          }
        } else {
          setError(response.data.message || "No resolved messages found.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch resolved messages.";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedMessages();
  }, [email]);

  const formatDate = (isoString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(isoString).toLocaleString("en-US", options);
  };

  return (
    <Container maxWidth="xl" sx={{ paddingY: 2 }}>
      <Typography
        variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
        gutterBottom
      >
        Resolved Messages :
        <span
          style={{
            color: "#004080",
            textAlign: "start",
            fontWeight: 600,
            paddingX: isMobile ? 1 : 2,
          }}
        >
          {name}
        </span>
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography
          align="center"
          sx={{
            marginTop: 3,
            border: "1px solid #ccc", // light gray border
            backgroundColor: "#f0f0f0", // light gray background
            padding: 2, // some padding inside
            borderRadius: 2, // rounded corners
          }}
        >
          No Messages
        </Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          }}
          gap={3}
        >
          {messages.length === 0 ? (
            <Typography align="center" color="textSecondary">
              No resolved messages found.
            </Typography>
          ) : (
            messages.map((message) => (
              <Paper
                key={message._id}
                elevation={3}
                sx={{
                  padding: 2,
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  backgroundColor: "#f9f9f9",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#004080", fontWeight: 500, mb: 1 }}
                >
                  Message:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ wordWrap: "break-word", mb: 2 }}
                >
                  {message.message}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="caption" color="textSecondary">
                  Date: {formatDate(message.createdAt)}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
      )}
    </Container>
  );
};

export default ResolvedMessagesPage;
