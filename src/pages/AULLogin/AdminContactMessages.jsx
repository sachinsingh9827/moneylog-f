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
      <Toast />
      <Typography variant="h4" gutterBottom>
        Contact Messages
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
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
                  <TableCell>{msg.message}</TableCell>
                  <TableCell>{msg.resolve ? "Resolved" : "Pending"}</TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: "8px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* Resolve button */}
                      {!msg.resolve && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setSelectedMessage(msg)}
                          style={{ minWidth: "120px", flex: "1 1 auto" }}
                        >
                          Resolve
                        </Button>
                      )}

                      {/* Activate Account button */}
                      {!msg.resolve && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleActivateAccount(msg.userId)}
                          disabled={activating}
                          style={{ minWidth: "150px", flex: "1 1 auto" }}
                        >
                          {activating ? (
                            <CircularProgress size={20} color="inherit" />
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
      )}

      {/* Resolve Dialog */}
      <Dialog open={!!selectedMessage} onClose={() => setSelectedMessage(null)}>
        <DialogTitle>Resolve Message</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>Name:</strong> {selectedMessage?.name}
          </Typography>
          <Typography>
            <strong>Email:</strong> {selectedMessage?.email}
          </Typography>
          <Typography>
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
