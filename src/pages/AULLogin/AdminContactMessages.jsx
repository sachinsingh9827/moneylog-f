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

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);

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
      alert(res.data.message);
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error resolving message:", error);
      alert("Failed to resolve message.");
    } finally {
      setResolving(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
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
                    {!msg.resolve && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setSelectedMessage(msg)}
                      >
                        Resolve
                      </Button>
                    )}
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
