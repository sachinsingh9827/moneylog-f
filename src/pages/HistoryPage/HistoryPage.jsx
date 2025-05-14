import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RiAddLargeFill } from "react-icons/ri";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import axios from "axios";
import { purple } from "@mui/material/colors";
import { MdRefresh } from "react-icons/md";
import Loader from "../../components/Loader";
import Toast, { showToast } from "../../components/Toast";
import { toast } from "react-toastify";

const BASE_URL = "https://moneylog-sachin-singhs-projects-df648d93.vercel.app";

const columns = [
  { id: "#", label: "#", minWidth: 5, align: "left" },
  { id: "date", label: "Date", minWidth: 10, align: "left" },
  { id: "time", label: "Time", minWidth: 10, align: "left" },
  { id: "amount", label: "Amount", minWidth: 10, align: "right" },
  { id: "type", label: "Type", minWidth: 10, align: "right" },
];

const HistoryPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterType, setFilterType] = useState("all");
  const [sortRecent, setSortRecent] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    time: "",
    amount: "",
    type: "credit",
  });

  // Modal styling

  const { id: encodedId } = useParams();
  const [searchParams] = useSearchParams();
  const encodedName = searchParams.get("name");

  // Decode the values using atob
  const id = atob(encodedId); // atob decodes a base64 string back to its original value
  const name = atob(encodedName); // Similarly, decode the name

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "skyblue",
    p: 4,
    boxShadow: 24,
    borderRadius: 2,
  };
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  }));
  // Fetch user and transactions
  const fetchTransactionHistory = async (id, setTransactions, setUser) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/moneylog/customers/transaction-history/${id}`
      );
      if (response.data) {
        if (Array.isArray(response.data.transactions)) {
          setTransactions(response.data.transactions);
        } else {
          setTransactions([]);
        }
        if (response.data.customer) {
          setUser(response.data.customer);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  // Inside your component
  useEffect(() => {
    fetchTransactionHistory(id, setTransactions, setUser);
  }, [id]);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (txn) => {
    setSelectedTransaction(txn);
    setOpenModal(true);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  const toggleSort = () => {
    setSortRecent((prev) => !prev);
  };

  const handleSubmitTransaction = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.id;

      if (!userId) {
        showToast("User not found. Please login again.", "error");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/moneylog/customers/customers/${id}/transactions`,
        {
          ...newTransaction,
          userId,
          customerId: id,
          amount: Number(newTransaction.amount),
        }
      );

      if (response.status === 200) {
        showToast("Transaction added successfully!", "success");

        // Re-fetch updated transaction history
        fetchTransactionHistory(id, setTransactions, setUser);

        // Reset form and close modal
        setShowForm(false);
        setNewTransaction({ date: "", time: "", amount: "", type: "credit" });
      }
    } catch (error) {
      console.error("Error adding new transaction:", error);
      showToast("Something went wrong while adding the transaction.", "error");
    }
  };

  useEffect(() => {
    if (showForm) {
      const now = new Date();
      setNewTransaction((prev) => ({
        ...prev,
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
      }));
    }
  }, [showForm]);

  // Filter and sort
  const filteredTransactions =
    filterType === "all"
      ? transactions
      : transactions.filter((txn) => txn.type === filterType);

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortRecent ? dateB - dateA : dateA - dateB;
  });

  const paginatedTransactions = sortedTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const [loading, setLoading] = useState(false);

  const refreshTransactions = async () => {
    setLoading(true); // Show loader when fetching data

    const timeout = setTimeout(() => {
      setLoading(false); // Hide loader after 5 seconds if it hasn't already been hidden
    }, 2000); // Set timeout to 5 seconds
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      return;
    }
    try {
      // Wait for a minimum of 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Make the API call after the delay
      const response = await axios.get(
        `${BASE_URL}/moneylog/customers/transaction-history/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        if (Array.isArray(response.data.transactions)) {
          setTransactions(response.data.transactions);
        } else {
          setTransactions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);

      if (error.response && error.response.status === 401) {
        // Invalid token - log out user
        toast.error("Session expired. Please log in again.");

        // Clear token and user data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login page
        navigate("/login");
      } else {
        toast.error("Failed to fetch transaction history. Please try again.");
      }
    }
  };
  const [rotating, setRotating] = useState(false); // Track rotation state

  const handleMouseEnter = () => {
    setRotating(true); // Start rotation on hover
  };

  const handleMouseLeave = () => {
    setRotating(false); // Reset rotation when hover ends
  };

  // Calculate total credit and debit amounts
  const calculateTotals = () => {
    const totalCredit = transactions
      .filter((txn) => txn.type === "credit")
      .reduce((acc, txn) => acc + txn.amount, 0);
    const totalDebit = transactions
      .filter((txn) => txn.type === "debit")
      .reduce((acc, txn) => acc + txn.amount, 0);

    return { totalCredit, totalDebit };
  };

  const { totalCredit, totalDebit } = calculateTotals();
  return (
    <div style={{ padding: 10 }} className="page">
      {" "}
      <Toast />
      <div style={{ display: "flex", alignItems: "center", margin: 16 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          style={{ marginRight: 16 }}
        >
          Back
        </Button>
        <Typography variant="h5">
          <strong
            style={{
              fontWeight: "bold",
              marginBottom: "20px",
              height: "10vh",
              color: "#004080",
            }}
          >
            {name.toUpperCase()}'S
          </strong>
        </Typography>
      </div>
      {/* Display total credit and debit amounts */}
      <div
        variant="body1"
        style={{
          margin: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Typography variant="h6">
          <strong>TC: </strong>{" "}
          <span
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >
            ₹ {totalCredit.toFixed(2)}
          </span>
        </Typography>
        <Typography variant="h6">
          <strong>TD: </strong>{" "}
          <span
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            ₹ {totalDebit.toFixed(2)}
          </span>
        </Typography>
      </div>
      {loading && <Loader />}
      {showForm && (
        <div
          style={{
            marginTop: "10%",
            maxWidth: "95%",
            border: "1px solid #ccc", // light gray border
            backgroundColor: "#fff", // transparent background
            margin: "0 auto", // center the form horizontally
            padding: "1rem", // add some padding inside
            borderRadius: "8px", // smooth rounded corners
            display: "block", // make margin auto work
          }}
        >
          <Typography
            variant="h5"
            style={{
              fontWeight: "bold",
              marginBottom: "20px",
              height: "10vh",
              color: "#004080",
            }}
          >
            Add New Transaction
          </Typography>
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Time"
            type="time"
            fullWidth
            value={newTransaction.time}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, time: e.target.value })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            margin="normal"
          />
          <FormControl fullWidth size="small" style={{ marginTop: "1rem" }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value })
              }
              label="Type" // <-- Important: Add this label prop
            >
              <MenuItem value="credit">Recive</MenuItem>
              <MenuItem value="debit">Send</MenuItem>
            </Select>
          </FormControl>

          <div style={{ marginTop: 16 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitTransaction}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowForm(false)}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {!showForm && (
        <>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <FormControl size="small" style={{ minWidth: 120, flex: 1 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterType}
                onChange={handleFilterChange}
                label="Filter"
                fullWidth
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="credit">Receive</MenuItem>
                <MenuItem value="debit">Send</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={toggleSort}
              style={{
                marginBottom: 16,
                height: "100%", // Same height as the above button
                minWidth: 200, // Consistent width
                display: "flex", // Ensures proper height alignment
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Sort by {sortRecent ? "Oldest" : "Recent"}
            </Button>
            <ColorButton
              variant="contained"
              color="primary"
              onClick={() => setShowForm(true)}
              style={{
                marginBottom: 16,
                height: "100%", // Ensures same height for the buttons
                minWidth: 100, // Set a minimum width for consistency
                display: "flex", // Ensure it's flexed to match the height of other elements
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <RiAddLargeFill size={18} />{" "}
              <span style={{ marginLeft: "4px" }}> Add New</span>
            </ColorButton>
            <ColorButton
              variant="contained"
              onClick={() => refreshTransactions()}
              style={{
                marginBottom: 16,
                height: "100%",
                minWidth: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MdRefresh
                size={25}
                style={{
                  transition: "transform 1s ease", // Slower transition for the rotation
                  transform: rotating ? "rotate(90deg)" : "rotate(0deg)", // Apply rotation on hover
                }}
                onMouseEnter={handleMouseEnter} // Start rotation on hover
                onMouseLeave={handleMouseLeave} // Reset rotation when hover ends
              />
            </ColorButton>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: "skyblue",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.reverse().map((transaction, i) => (
                  <TableRow
                    hover
                    key={transaction._id}
                    onClick={() => handleRowClick(transaction)}
                  >
                    {" "}
                    <TableCell align="left">{i + 1}.</TableCell>
                    <TableCell align="left">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="left">{transaction.time}</TableCell>
                    <TableCell
                      align="right"
                      style={{
                        color: transaction.type === "credit" ? "red" : "green",
                      }}
                    >
                      {transaction.amount}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        color: transaction.type === "credit" ? "red" : "green",
                      }}
                    >
                      {transaction.type === "credit" ? "recive " : "send"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sortedTransactions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
      {/* Transaction Details Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Transaction Details</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          {selectedTransaction && (
            <Box mt={2}>
              {/* Transaction Details */}
              <Typography>
                <strong>Date:</strong>{" "}
                {new Date(selectedTransaction.date).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Time:</strong> {selectedTransaction.time}
              </Typography>
              <Typography>
                <strong>Amount:</strong> {selectedTransaction.amount}
              </Typography>
              <Typography>
                <strong>Type:</strong> {selectedTransaction.type}
              </Typography>

              {/* Delete Button */}
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenConfirmModal(true)}
                style={{ marginTop: 16 }}
              >
                Delete Transaction
              </Button>

              {/* Confirm Deletion Modal */}
              <Modal
                open={openConfirmModal}
                onClose={() => setOpenConfirmModal(false)}
                aria-labelledby="confirm-delete-title"
                aria-describedby="confirm-delete-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: 300, md: 400 },
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: "center",
                    overflow: "visible",
                  }}
                >
                  {/* Icon Circle */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-30px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 60,
                      height: 60,
                      bgcolor: "error.main",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 3,
                    }}
                  >
                    <DeleteIcon sx={{ color: "white", fontSize: 30 }} />
                  </Box>

                  {/* Modal Content */}
                  <Typography
                    id="confirm-delete-title"
                    variant="h6"
                    component="h2"
                    mt={4}
                  >
                    Are you sure?
                  </Typography>
                  <Typography id="confirm-delete-description" sx={{ mt: 2 }}>
                    Do you really want to delete this transaction? This action
                    cannot be undone.
                  </Typography>

                  {/* Buttons */}
                  <Box mt={4} display="flex" justifyContent="space-around">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={async () => {
                        try {
                          const response = await axios.delete(
                            `${BASE_URL}/moneylog/customers/customers/${id}/transactions/${selectedTransaction._id}`
                          );
                          if (response.status === 200) {
                            showToast(
                              "Transaction deleted successfully!",
                              "success"
                            );
                            setTransactions((prev) =>
                              prev.filter(
                                (txn) => txn._id !== selectedTransaction._id
                              )
                            );
                            setOpenModal(false); // Close detail modal
                            setSelectedTransaction(null);
                          }
                        } catch (error) {
                          console.error("Error deleting transaction:", error);
                          showToast("Failed to delete transaction.");
                        }
                        setOpenConfirmModal(false); // Close confirm modal
                      }}
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
                </Box>
              </Modal>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default HistoryPage;
