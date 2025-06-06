import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Toast, { showToast } from "../../components/Toast";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [activating, setActivating] = useState(false); // State to handle account activation

  // Fetch All Contact Messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://moneylog-sachin-singhs-projects-df648d93.vercel.app/moneylog/messages"
      );
      setMessages(res.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle Resolve Contact Message
  const handleResolve = async () => {
    if (!selectedMessage) return;
    setResolving(true);
    try {
      const res = await axios.put(
        `https://moneylog-sachin-singhs-projects-df648d93.vercel.app/moneylog/resolve/${selectedMessage._id}`
      );
      showToast(res.data.message, "success");
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error resolving message:", error);
      showToast("Failed to resolve message.");
    } finally {
      setResolving(false);
    }
  };

  // Handle Activate User Account
  const handleActivateAccount = async (userId) => {
    setActivating(true);
    try {
      const res = await axios.put(
        `https://moneylog-sachin-singhs-projects-df648d93.vercel.app/moneylog/activate/${userId}`
      );
      showToast(res.data.message, "success");
      fetchMessages(); // Re-fetch messages after activation
    } catch (error) {
      console.error("Error activating account:", error);
      showToast("Failed to activate account.");
    } finally {
      setActivating(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h4"
        gutterBottom
        style={{ color: "#004080", textAlign: "start" }}
      >
        Contact Messages
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ width: "100%", overflowX: "auto" }}>
          <TableContainer component={Paper} style={{ minWidth: "600px" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Resolve Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg._id}>
                    <TableCell>{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell style={{ whiteSpace: "pre-wrap" }}>
                      {msg.message}
                    </TableCell>
                    <TableCell
                      style={{
                        color: msg.resolve ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {msg.resolve ? "Resolved" : "Pending"}
                    </TableCell>

                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {!msg.resolve && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setSelectedMessage(msg)}
                            fullWidth
                            size="small"
                          >
                            Resolve
                          </Button>
                        )}

                        {!msg.resolve && (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleActivateAccount(msg.userId)}
                            disabled={activating}
                            fullWidth
                            size="small"
                          >
                            {activating ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              "Activate Account"
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Resolve Dialog */}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
      >
        <DialogTitle>Resolve Message</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            <strong>Name:</strong> {selectedMessage?.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> {selectedMessage?.email}
          </Typography>
          <Typography variant="body1">
            <strong>Message:</strong> {selectedMessage?.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedMessage(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleResolve}
            disabled={resolving}
          >
            {resolving ? <CircularProgress size={20} /> : "Mark as Resolved"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminContactMessages;
