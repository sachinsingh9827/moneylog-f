import React from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./WelcomePage.css";

const transactions = [
  { date: "2024-05-15", time: "09:30", amount: "500", type: "Credit" },
  { date: "2024-05-16", time: "11:00", amount: "1500", type: "Debit" },
  { date: "2024-05-17", time: "14:45", amount: "300", type: "Credit" },
  { date: "2024-05-18", time: "16:30", amount: "1000", type: "Debit" },
  { date: "2024-05-19", time: "08:15", amount: "250", type: "Credit" },
  { date: "2024-05-20", time: "12:00", amount: "2000", type: "Debit" },
  { date: "2024-05-21", time: "10:20", amount: "750", type: "Credit" },
  { date: "2024-05-22", time: "13:00", amount: "1800", type: "Debit" },
  { date: "2024-05-23", time: "15:10", amount: "600", type: "Credit" },
  { date: "2024-05-24", time: "17:45", amount: "900", type: "Debit" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
};

const DemoTransactionPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: { xs: 2, sm: 4, md: 6 },
        minHeight: "100vh",
        flexWrap: "wrap",
        gap: { xs: 4, md: 6 },
      }}
      className="welcome-container"
    >
      {/* Left Side Heading */}
      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "0 0 300px" },
          textAlign: { xs: "center", md: "left" },
          maxWidth: { xs: "100%", md: "300px" },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#004080",
            textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
            transform: "perspective(500px) rotateY(-10deg)",
            fontSize: { xs: "28px", sm: "36px", md: "50px" },
            lineHeight: 1.2,
          }}
        >
          MoneyLog+
        </Typography>
        <Typography
          sx={{
            marginTop: 2,
            color: "#333",
            fontSize: { xs: "12px", sm: "14px" },
          }}
        >
          Download, Share & Track all your transactions.
        </Typography>

        <Typography
          sx={{
            marginTop: 3,
            color: "#555",
            fontSize: { xs: "12px", sm: "14px" },
            lineHeight: 1.5,
          }}
        >
          Manage your finances effortlessly with MoneyLog+. Keep an eye on your
          spending, receive instant transaction alerts, and easily share reports
          with your family or accountant. Secure, intuitive, and designed for
          your daily financial health.
        </Typography>

        <Typography
          sx={{
            marginTop: 2,
            color: "#004080",
            fontWeight: "600",
            fontSize: { xs: "14px", sm: "16px" },
          }}
        >
          Features Include:
        </Typography>
        <ul
          style={{
            paddingLeft: 20,
            marginTop: 8,
            color: "#444",
            fontSize: "12px",
            textAlign: { xs: "left", md: "left" },
          }}
        >
          <li>Real-time transaction tracking and notifications</li>
          <li>Secure data with encrypted backups</li>
          <li>Easy sharing options via email or messaging apps</li>
          <li>Detailed reports and charts for spending habits</li>
          <li>Multi-device sync for access anywhere</li>
        </ul>
      </Box>

      {/* Phone Body */}
      <Paper
        elevation={8}
        sx={{
          flex: { xs: "1 1 350px", md: "0 0 350px" },
          height: { xs: "550px", md: "600px" },
          borderRadius: "40px",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          border: "8px solid black",
          mx: "auto",
          maxWidth: "100%",
        }}
      >
        {/* Speaker */}
        <Box
          sx={{
            position: "absolute",
            top: "6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "50px",
            height: "5px",
            backgroundColor: "#000",
            borderRadius: "3px",
            zIndex: 15,
          }}
        />

        {/* Camera Notch */}
        <Box
          sx={{
            position: "absolute",
            top: 15,
            left: "50%",
            transform: "translateX(-50%)",
            width: "120px",
            height: "20px",
            backgroundColor: "#333",
            borderRadius: "10px",
            zIndex: 10,
          }}
        />

        {/* Header */}
        <Box
          sx={{
            paddingY: 1.5,
            paddingX: 1,
            backgroundColor: "#004080",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          <IconButton size="small" sx={{ color: "#fff" }}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "12px", md: "14px" },
              flexGrow: 1,
              textAlign: "center",
            }}
          >
            Moneylog
          </Typography>
          <Box>
            <IconButton size="small" sx={{ color: "#fff" }}>
              <HomeIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: "#fff" }}>
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Table */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 1,
            minWidth: 0, // Fix for table overflow on small screens
          }}
        >
          <Table size="small" sx={{ minWidth: "300px" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={thStyle}>SN.</TableCell>
                <TableCell sx={thStyle}>Date</TableCell>
                <TableCell sx={thStyle}>Time</TableCell>
                <TableCell sx={thStyle}>Amount</TableCell>
                <TableCell sx={thStyle}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={tdStyle}>{index + 1}.</TableCell>
                  <TableCell sx={tdStyle}>{formatDate(item.date)}</TableCell>
                  <TableCell sx={tdStyle}>{item.time}</TableCell>
                  <TableCell sx={tdStyle}>{item.amount}</TableCell>
                  <TableCell
                    sx={{
                      ...tdStyle,
                      color:
                        item.type?.toLowerCase() === "credit" ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {item.type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            margin: 1,
          }}
        >
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: "#004080",
              borderRadius: "20px",
              fontSize: { xs: "10px", md: "14px" },
            }}
          >
            Download PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<ShareIcon />}
            sx={{
              backgroundColor: "#004080",
              borderRadius: "20px",
              fontSize: { xs: "10px", md: "14px" },
            }}
          >
            Share
          </Button>
          <Button
            variant="contained"
            startIcon={<MoreVertIcon />}
            sx={{
              backgroundColor: "#004080",
              borderRadius: "20px",
              fontSize: { xs: "10px", md: "14px" },
            }}
          >
            More
          </Button>
        </Box>
        {/* Bottom Bar */}
        <Box
          sx={{
            backgroundColor: "#e0e0e0",
            height: "40px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            borderTop: "1px solid #ccc",
            marginTop: "5px",
          }}
        >
          <IconButton size="small">
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              width: "24px",
              height: "24px",
              backgroundColor: "#000",
              borderRadius: "50%",
            }}
          ></Box>
          <IconButton size="small">
            <MenuIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

const thStyle = {
  backgroundColor: "#004080",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "10px",
  padding: "4px",
  whiteSpace: "nowrap",
};

const tdStyle = {
  textAlign: "center",
  fontSize: "10px",
  padding: "4px",
  whiteSpace: "nowrap",
};

export default DemoTransactionPage;
