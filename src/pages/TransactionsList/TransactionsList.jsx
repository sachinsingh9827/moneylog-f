import React, { useEffect, useState } from "react";
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
  Button,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { purple, red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { showToast } from "../../components/Toast";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const columns = [
  { id: "#", label: "#", minWidth: 5, align: "left" },
  { id: "name", label: "Name", minWidth: 100 },
  { id: "amount", label: "Amount (₹)", minWidth: 100, align: "right" },
  { id: "actions", label: "Actions", minWidth: 50, align: "right" },
];

export default function TransactionsList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customerData, setCustomerData] = useState([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [userName, setUserName] = useState("");
  const [userSecName, setUserSecName] = useState("");

  // Modal states
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        console.error("No user data or id found in localStorage");
        return;
      }

      setUserName(userData.name);
      setUserSecName(userData.secName);
      const userId = userData.id;
      const response = await axios.get(
        `${BASE_URL}/moneylog/customers/get/${userId}`
      );

      setCustomerData(response.data.customer);

      const allTransactions = response.data.customer.flatMap(
        (customer) => customer.transactions
      );

      const credit = allTransactions
        .filter((txn) => txn.type === "credit")
        .reduce((acc, txn) => acc + txn.amount, 0);

      const debit = allTransactions
        .filter((txn) => txn.type === "debit")
        .reduce((acc, txn) => acc + txn.amount, 0);

      setTotalCredit(credit);
      setTotalDebit(debit);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (id, name) => {
    navigate(`/dashboard/history/${id}?name=${name}`);
  };

  const handleAddCustomerClick = () => {
    navigate("/dashboard/add-customer");
  };

  const openDeleteModal = (id) => {
    setSelectedCustomerId(id);
    setOpenConfirmModal(true);
  };

  const confirmDeleteCustomer = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/moneylog/customers/customers/${selectedCustomerId}`
      );
      setCustomerData((prev) =>
        prev.filter((customer) => customer._id !== selectedCustomerId)
      );
      showToast("Customers deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting customer:", error);
      showToast("Failed to delete customer. Try again.");
    } finally {
      setOpenConfirmModal(false);
      setSelectedCustomerId(null);
    }
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  }));

  return (
    <div style={{ padding: 16 }} className="page">
      <Typography variant="h6" style={{ marginBottom: "20px", height: "10vh" }}>
        Welcome, {userSecName || userName}
      </Typography>

      <div
        style={{
          margin: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Typography variant="body1">
          <strong>Total Credit:</strong>{" "}
          <span style={{ color: "green", fontWeight: "bold" }}>
            ₹ {totalCredit}
          </span>{" "}
        </Typography>
        <Typography variant="body1">
          <strong>Total Debit:</strong>{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            ₹ {totalDebit}
          </span>
        </Typography>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="transactions table">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align}
                    style={{
                      minWidth: col.minWidth,
                      backgroundColor: "skyblue",
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {customerData && customerData.length > 0 ? (
                customerData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer, i) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={customer._id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell align="left">
                        {page * rowsPerPage + i + 1}.
                      </TableCell>
                      <TableCell
                        align="left"
                        onClick={() =>
                          handleRowClick(customer._id, customer.name)
                        }
                      >
                        {customer.name}
                      </TableCell>
                      <TableCell
                        align="right"
                        onClick={() =>
                          handleRowClick(customer._id, customer.name)
                        }
                        style={{
                          color:
                            customer.transactions.length > 0 &&
                            customer.transactions[
                              customer.transactions.length - 1
                            ]?.type === "credit"
                              ? "green"
                              : "red",
                        }}
                      >
                        {customer.transactions.length > 0
                          ? customer.transactions[
                              customer.transactions.length - 1
                            ]?.amount
                          : 0}
                        <br />
                        <span style={{ fontSize: "12px", color: "gray" }}>
                          {customer.transactions.length > 0 &&
                          customer.transactions[
                            customer.transactions.length - 1
                          ]?.type === "credit"
                            ? "You will send"
                            : "Remaining"}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => openDeleteModal(customer._id)}
                          sx={{ color: red[500] }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={customerData ? customerData.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage=""
        />
      </Paper>

      <ColorButton
        variant="contained"
        style={{
          position: "fixed",
          bottom: "80px",
          right: "40px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        onClick={handleAddCustomerClick}
      >
        Add Customer
      </ColorButton>

      {/* DELETE CONFIRMATION MODAL */}
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

          <Typography
            id="confirm-delete-title"
            variant="h6"
            component="h2"
            mt={4}
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              fontSize: "24px",
            }}
          >
            Are you sure?
          </Typography>

          <Typography
            id="confirm-delete-description"
            sx={{
              mt: 2,
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            Do you really want to delete this customer? This action cannot be
            undone.
          </Typography>

          <Box mt={4} display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              color="error"
              onClick={confirmDeleteCustomer}
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
    </div>
  );
}
