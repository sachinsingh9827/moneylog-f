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
  Stack,
  Menu,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RiAddLargeFill } from "react-icons/ri";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { purple } from "@mui/material/colors";
import Loader from "../../components/Loader";
import Toast, { showToast } from "../../components/Toast";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import * as Yup from "yup";
const BASE_URL = "https://moneylog-sachin-singhs-projects-df648d93.vercel.app";

const columns = [
  { id: "#", label: "#", minWidth: 2, align: "left" },
  { id: "date", label: "Date", minWidth: 5, align: "left" },
  { id: "time", label: "Time", minWidth: 5, align: "left" },
  { id: "amount", label: "Amount", minWidth: 5, align: "right" },
  { id: "type", label: "Type", minWidth: 5, align: "right" },
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
    bgcolor: "white",
    p: 4,
    boxShadow: 24,
    borderRadius: 2,
  };
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#004080",
    "&:hover": {
      backgroundColor: "skyblue",
      color: "black",
    },
  }));

  const fetchTransactionHistory = async (id, setTransactions, setUser) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

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

        if (response.data.customer) {
          setUser(response.data.customer);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      setLoading(false);

      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      } else {
        toast.error("Failed to fetch transaction history. Please try again.");
      }
    }
  };
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

  const transactionSchema = Yup.object().shape({
    date: Yup.string().required("Date is required"),
    time: Yup.string().required("Time is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required"),
    type: Yup.string().required("Transaction type is required"),
  });

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setPage(0);
  };

  const toggleSort = () => {
    setSortRecent((prev) => !prev);
  };

  const handleSubmitTransaction = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("You are not logged in. Please log in again.", "error");
      return;
    }

    if (
      !newTransaction.date ||
      !newTransaction.time ||
      !newTransaction.amount ||
      !newTransaction.type
    ) {
      showToast("Please fill all the fields before submitting.", "error");
      return;
    }

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
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        showToast(
          response.data.message || "Transaction added successfully!",
          "success"
        );
        fetchTransactionHistory(id, setTransactions, setUser);
        setShowForm(false);
        setNewTransaction({ date: "", time: "", amount: "", type: "credit" });
      }
    } catch (error) {
      console.error("Error adding new transaction:", error);
      if (error.response && error.response.status === 401) {
        showToast("Session expired. Please log in again.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        showToast(
          error.response?.data?.message ||
            "Failed to add transaction. Please try again.",
          "error"
        );
      }
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
  const handleDownloadTransaction = () => {
    if (!transactions || transactions.length === 0) {
      showToast("No transaction data to Download.");
      return;
    }
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return `${String(date.getDate()).padStart(2, "0")}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${date.getFullYear()}`;
    };

    const formatTime = (timeStr) => {
      if (!timeStr) return "-";
      if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
      const date = new Date(timeStr);
      return `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
    };
    const itemsPerPage = 20;
    const pages = [];

    for (let i = 0; i < transactions.length; i += itemsPerPage) {
      const chunk = transactions.slice(i, i + itemsPerPage);
      pages.push(chunk);
    }
    // Generate the full HTML with multiple pages
    const pagesHTML = pages
      .map((pageData, pageIndex) => {
        const startIndex = pageIndex * itemsPerPage;
        return `
        <div class="page">
          <h2 style="color: #004080;">Moneylog Transaction History Report</h2>
          <h3> <span style="color: #004080;">${name}</span></h3>
          <table>
            <thead>
              <tr>
                <th>SN.</th>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${pageData
                .map(
                  (item, index) => `
                <tr>
                  <td>${startIndex + index + 1}.</td>
                  <td>${formatDate(item.date)}</td>
                  <td>${formatTime(item.time)}</td>
                  <td>${item.amount || "-"}</td>
                  <td style="color: ${
                    item.type?.toLowerCase() === "credit" ? "red" : "green"
                  };">
                    ${item.type || "-"}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        <div style="page-break-after: always;"></div>
      `;
      })
      .join("");

    const tableHTML = `
      <html>
        <head>
          <title>Moneylog Transaction History</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #004080; padding: 8px; text-align: center; }
            th { background-color: #004080; color: white; }
            .page { page-break-after: always; }
            /* Remove page-break-after on last page */
            .page:last-child { page-break-after: auto; }
          </style>
        </head>
        <body>
          ${pagesHTML}
        </body>
      </html>
    `;

    const blob = new Blob([tableHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Moneylog Transaction_History.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const isSortEnabled = () => {
    if (!paginatedTransactions || paginatedTransactions.length <= 1)
      return false;

    // Extract all unique dates in string format
    const uniqueDates = new Set(
      paginatedTransactions.map((tx) => new Date(tx.date).toLocaleDateString())
    );

    // Enable only if more than one unique date exists
    return uniqueDates.size > 1;
  };
  const handleShareTransactionWhatsApp = () => {
    if (!transactions || transactions.length === 0) {
      showToast("No transaction data to share.");
      return;
    }

    // Header for the table
    let message = `*Moneylog Transaction Summary for ${name}*\n\n`;
    message += `SN  | Date       | Time  | Amount  | Type\n`;
    message += `----|------------|-------|---------|------\n`;

    transactions.forEach((item, index) => {
      const date = formatDate(item.date);
      const time = formatTime(item.time);
      const amount = item.amount || "-";
      const type = item.type || "-";

      // Pad and align using string functions
      const sn = String(index + 1).padEnd(3, " ");
      const dateStr = date.padEnd(10, " ");
      const timeStr = time.padEnd(5, " ");
      const amountStr = String(amount).padEnd(7, " ");
      const typeStr = type.padEnd(6, " ");

      message += `${sn} | ${dateStr} | ${timeStr} | ₹${amountStr} | ${typeStr}\n`;
    });

    message += `\n---\nGenerated by Moneylog App`;

    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
  };

  // Helpers same as before
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    const date = new Date(timeStr);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div style={{ padding: 10 }} className="page">
      <Toast />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          spacing={1}
          sx={{ width: "100%" }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#004080",
              textTransform: "uppercase",
              fontSize: { xs: "14px", sm: "18px", md: "20px" },
            }}
          >
            {name}'s
          </Typography>{" "}
          {!showForm && (
            <ColorButton
              variant="outlined"
              size="small"
              onClick={() => navigate(-1)}
              style={{
                height: 36,
                minWidth: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Back
            </ColorButton>
          )}
        </Stack>
        {!showForm && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
          >
            <Typography
              variant={{ xs: "body2", sm: "body1" }}
              sx={{ color: "#004080", fontWeight: 500 }}
            >
              TC:
            </Typography>
            <Typography
              variant={{ xs: "body2", sm: "body1" }}
              sx={{ color: "red", fontWeight: "bold" }}
            >
              ₹ {totalCredit.toFixed(2)}
            </Typography>
            <Typography
              variant={{ xs: "body2", sm: "body1" }}
              sx={{ color: "#004080", fontWeight: 500, ml: 2 }}
            >
              TD:
            </Typography>
            <Typography
              variant={{ xs: "body2", sm: "body1" }}
              sx={{ color: "green", fontWeight: "bold" }}
            >
              ₹ {totalDebit.toFixed(2)}
            </Typography>
          </Stack>
        )}
      </Box>
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

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <Button variant="outlined" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <ColorButton
              variant="contained"
              size="small"
              style={{
                height: 36,
                minWidth: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleSubmitTransaction}
            >
              Submit
            </ColorButton>
          </div>
        </div>
      )}
      {!showForm && (
        <>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            {/* Filter Dropdown */}
            {transactions.length === 0 ? (
              <div />
            ) : (
              <FormControl size="small" style={{ minWidth: 150 }}>
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
            )}

            <IconButton
              aria-label="more"
              aria-controls="menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  setShowForm(true);
                  handleMenuClose();
                }}
              >
                <span style={{ color: "#004080", fontWeight: "bold" }}>
                  Add New
                </span>{" "}
              </MenuItem>
              <MenuItem onClick={toggleSort} disabled={!isSortEnabled()}>
                <span style={{ color: "#004080", fontWeight: "bold" }}>
                  Sort by {sortRecent ? "Oldest" : "Recent"}
                </span>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleShareTransactionWhatsApp();
                  handleMenuClose();
                }}
                disabled={transactions.length === 0}
              >
                <span style={{ color: "#004080", fontWeight: "bold" }}>
                  Share on WhatsApp
                </span>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleDownloadTransaction();
                  handleMenuClose();
                }}
                disabled={transactions.length === 0}
              >
                <span style={{ color: "#004080", fontWeight: "bold" }}>
                  Download
                </span>
              </MenuItem>
            </Menu>
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
                        backgroundColor: "#004080",
                        color: "white",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions && paginatedTransactions.length > 0 ? (
                  paginatedTransactions
                    .slice()
                    .reverse()
                    .map((transaction, i) => (
                      <TableRow
                        hover
                        key={transaction._id}
                        onClick={() => handleRowClick(transaction)}
                      >
                        <TableCell align="left">{i + 1}.</TableCell>
                        <TableCell align="left">
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="left">{transaction.time}</TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color:
                              transaction.type === "credit" ? "red" : "green",
                          }}
                        >
                          {transaction.amount}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color:
                              transaction.type === "credit" ? "red" : "green",
                          }}
                        >
                          {transaction.type === "credit" ? "receive" : "send"}
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <div
                        style={{
                          width: "100%",
                          minHeight: "200px",
                          backgroundColor: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "black",
                          fontSize: "18px",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          boxShadow: "0 0 10px #004080",
                        }}
                      >
                        <div style={{ color: "#004080" }}>
                          No data, please add transaction first.
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
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
            <Box mt={2} style={{ color: "#004080" }}>
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
                            `${BASE_URL}/moneylog/customers/customers/${id}/transactions/${selectedTransaction._id}`,
                            {
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                            }
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
                          } else {
                            showToast(
                              "Failed to delete transaction. Please try again.",
                              "error"
                            );
                          }
                        } catch (error) {
                          console.error("Error deleting transaction:", error);

                          if (error.response) {
                            const errorMessage =
                              error.response.data?.message ||
                              "An error occurred.";
                            showToast(errorMessage, "error");

                            if (error.response.status === 401) {
                              // Session expired or invalid token - log out user
                              toast.error(
                                "Session expired. Please log in again."
                              );

                              // Clear token and user data from localStorage
                              localStorage.removeItem("token");
                              localStorage.removeItem("user");

                              // Redirect to login page
                              navigate("/login");
                            } else {
                              showToast(
                                "Failed to delete transaction. Please try again.",
                                "error"
                              );
                            }
                          } else {
                            // Handle network errors or other issues
                            showToast(
                              "Failed to delete transaction. Please check your connection.",
                              "error"
                            );
                          }
                        } finally {
                          setOpenConfirmModal(false); // Close confirmation modal
                        }
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
