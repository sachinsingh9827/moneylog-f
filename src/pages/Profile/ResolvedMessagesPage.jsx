import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Container,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const ResolvedMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Container maxWidth="full" style={{ marginTop: "20px" }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
        style={{ color: "#004080", textAlign: "start" }}
      >
        Resolved Messages for {email}
      </Typography>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <CircularProgress />
        </div>
      ) : error ? (
        <Typography color="error" align="center">
          <Typography align="center" color="textSecondary">
            No resolved messages found.
          </Typography>
        </Typography>
      ) : (
        <>
          {messages.length === 0 ? (
            <Typography align="center" color="textSecondary">
              No resolved messages found.
            </Typography>
          ) : (
            messages.map((message) => (
              <Paper
                key={message._id}
                elevation={2}
                style={{
                  padding: isMobile ? "12px" : "16px",
                  marginBottom: "15px",
                  borderRadius: "12px",
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Message:
                </Typography>
                <Typography variant="body1" style={{ wordWrap: "break-word" }}>
                  {message.message}
                </Typography>

                <Divider style={{ margin: "10px 0" }} />

                <Typography variant="caption" color="textSecondary">
                  Created At: {formatDate(message.createdAt)}
                </Typography>
              </Paper>
            ))
          )}
        </>
      )}
    </Container>
  );
};

export default ResolvedMessagesPage;
