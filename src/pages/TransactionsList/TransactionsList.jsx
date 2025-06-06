import React, { useEffect, useRef, useState } from "react";
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
import Toast, { showToast } from "../../components/Toast";
import Loader from "../../components/Loader";
import DeviceDetector from "device-detector-js";
import { toast } from "react-toastify";
const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "https://moneylog-sachin-singhs-projects-df648d93.vercel.app";

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
  const [loading, setLoading] = useState(false);
  // Modal states
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        console.error("No user data or id found in localStorage");
        return;
      }

      setUserName(userData.name);
      setUserSecName(userData.secName);
      setLoading(true);
      const userId = userData.id;

      const response = await axios.get(
        `${BASE_URL}/moneylog/customers/get/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer:", error);
      setLoading(false);

      if (error.response && error.response.status === 401) {
        // Invalid token - log out user
        toast.error("Session expired. Please log in again.");

        // Clear token and user data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login page (adjust according to your routing)
        navigate("/login");
      } else {
        toast.error("Failed to fetch customer data. Please try again.");
      }
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (id, name) => {
    // Encode the id and name to base64 using btoa (browser's base64 encoder)
    const encodedId = btoa(id); // btoa encodes a string to base64
    const encodedName = btoa(name); // Similarly, encode the name

    // Navigate with the encoded values
    navigate(`/dashboard/history/${encodedId}?name=${encodedName}`);
  };

  const handleAddCustomerClick = () => {
    navigate("/dashboard/add-customer");
  };

  const openDeleteModal = (id) => {
    setSelectedCustomerId(id);
    setOpenConfirmModal(true);
  };

  const confirmDeleteCustomer = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.delete(
        `${BASE_URL}/moneylog/customers/customers/${selectedCustomerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCustomerData((prev) =>
          prev.filter((customer) => customer._id !== selectedCustomerId)
        );
        showToast("Customer deleted successfully!", "success");
        fetchCustomer(); // Refresh the customer list after deletion
      } else {
        showToast("Failed to delete customer. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);

      if (error.response) {
        // If the error comes from the server
        const errorMessage =
          error.response.data?.message || "An error occurred.";
        showToast(errorMessage, "error");

        if (error.response.status === 401) {
          // Invalid token or session expired - log out user
          toast.error("Session expired. Please log in again.");

          // Clear token and user data
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Redirect to login page
          navigate("/login");
        } else {
          toast.error("Failed to delete customer. Please try again.");
        }
      } else {
        // Network error or other issues
        showToast(
          "Failed to delete customer. Please check your connection.",
          "error"
        );
      }
    } finally {
      setOpenConfirmModal(false); // Close the confirmation modal
      setSelectedCustomerId(null); // Clear the selected customer id
      setLoading(false); // Reset loading state
    }
  };

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#004080",
    "&:hover": {
      backgroundColor: "skyblue",
      color: "black",
    },
  }));

  const getDeviceInfo = async () => {
    const getDeviceNameFromUserAgent = (userAgent) => {
      const detector = new DeviceDetector();
      const result = detector.parse(userAgent);
      return result.device?.model || result.device?.type || "Unknown Device";
    };

    try {
      const userAgent = navigator.userAgent;
      const browser = userAgent;
      const os = navigator.platform;
      const isMobile = /Mobi|Android/i.test(userAgent);
      const deviceName = getDeviceNameFromUserAgent(userAgent);

      const ipResponse = await axios.get("https://api.ipify.org?format=json");
      const ip = ipResponse.data.ip;

      const locationResponse = await axios.get(`https://ipinfo.io/${ip}/json`);
      const { city, region, country, loc } = locationResponse.data;
      const [latitude, longitude] = loc ? loc.split(",") : [null, null];

      let geolocation = { latitude: null, longitude: null };
      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              geolocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              resolve();
            },
            (error) => {
              console.error("Geolocation error:", error);
              resolve();
            }
          );
        });
      }

      const finalLatitude = geolocation.latitude || latitude;
      const finalLongitude = geolocation.longitude || longitude;

      return {
        browser,
        os,
        isMobile,
        deviceName,
        ip,
        city,
        region,
        country,
        latitude: finalLatitude,
        longitude: finalLongitude,
        fullAddress: `${city}, ${region}, ${country}`,
      };
    } catch (error) {
      console.error("Error fetching device info:", error);

      return {
        browser: "Unknown",
        os: "Unknown",
        isMobile: false,
        deviceName: "Unknown Device",
        ip: "Unknown",
        city: "Unknown",
        region: "Unknown",
        country: "Unknown",
        latitude: null,
        longitude: null,
        fullAddress: "Unknown, Unknown, Unknown",
      };
    }
  };

  // Fetch device information
  const didRunRef = useRef(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.id;
    const userMail = userData?.email;

    if (userId && userMail && !didRunRef.current) {
      didRunRef.current = true;

      const fetchDeviceInfo = async () => {
        try {
          const deviceInfo = await getDeviceInfo();

          await axios.post(
            "https://moneylog-sachin-singhs-projects-df648d93.vercel.app/moneylog/add-login-history",
            {
              userId,
              userMail,
              deviceInfo,
            }
          );

          console.log("Device info sent successfully");
        } catch (error) {
          console.error("Error sending device info:", error);
        }
      };

      fetchDeviceInfo();
    }
  }, []);

  return (
    <div style={{ padding: 16 }} className="page">
      <Typography
        variant="h6"
        style={{
          fontWeight: "bold",
          marginBottom: "20px",
          height: "10vh",
          color: "#004080",
        }}
      >
        Welcome, {userSecName || userName}
      </Typography>
      <Toast />
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
        {" "}
        {loading && <Loader />}
        <Typography variant="body1">
          <strong style={{ color: "#004080" }}>Total Receive:</strong>{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>
            ₹ {totalCredit}
          </span>
        </Typography>
        <Typography variant="body1">
          <strong style={{ color: "#004080" }}>Total Send:</strong>{" "}
          <span style={{ color: "green", fontWeight: "bold" }}>
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
                      backgroundColor: "#004080",
                      color: "white",
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
                  .map((customer, i) => {
                    // Calculate total balance for the customer
                    const totalBalance = customer.transactions.reduce(
                      (total, transaction) => {
                        if (transaction.type === "credit") {
                          return total + transaction.amount;
                        } else if (transaction.type === "debit") {
                          return total - transaction.amount;
                        }
                        return total;
                      },
                      0
                    );

                    return (
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
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "ActiveBorder",
                            }}
                          >
                            {customer.name}
                          </span>
                          <br />
                          <span
                            style={{
                              fontSize: "15px",
                              color: "black",
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            {customer.mobile}
                          </span>
                        </TableCell>

                        <TableCell
                          align="right"
                          onClick={() =>
                            handleRowClick(customer._id, customer.name)
                          }
                          style={{
                            color:
                              totalBalance > 0
                                ? "red"
                                : totalBalance < 0
                                  ? "green"
                                  : "black",
                          }}
                        >
                          {totalBalance.toFixed(2)}
                          <br />
                          <span
                            style={{
                              fontSize: "10px",
                              color:
                                totalBalance > 0
                                  ? "red"
                                  : totalBalance < 0
                                    ? "green"
                                    : "gray",
                            }}
                          >
                            {totalBalance > 0
                              ? `Remaining: ₹${totalBalance}`
                              : totalBalance < 0
                                ? `Exceeded: ₹${Math.abs(totalBalance)}`
                                : "No Balance"}
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
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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
                      <span style={{ color: "#004080" }}>
                        Customer Not Found
                      </span>
                    </div>
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
