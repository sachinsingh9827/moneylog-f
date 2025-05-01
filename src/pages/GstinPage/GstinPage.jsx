import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Typography, Paper } from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const MoneyLogPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const features = [
    {
      title: "Track Transactions in Real-time",
      description:
        "Monitor all your business transactions seamlessly. Track income, expenses, and outstanding balances — all in one place.",
    },
    {
      title: "Financial Reports at Your Fingertips",
      description:
        "Generate accurate financial reports with just a few clicks. From profit and loss to balance sheets, we make reporting easy.",
    },
    {
      title: "Customer and Supplier Management",
      description:
        "Keep track of customer and supplier details, their transactions, and compliance status for accurate financial reporting.",
    },
    {
      title: "Invoicing Made Simple",
      description:
        "Easily generate and send professional invoices. Track paid and outstanding invoices in real-time for better financial control.",
    },
    {
      title: "Cashflow Monitoring",
      description:
        "Track your incoming and outgoing transactions in real-time, helping you optimize your business's cash flow and make informed financial decisions.",
    },
  ];

  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", checkMobile); // Clean up listener on component unmount
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#cbd5db",
        borderRadius: "10px",
        padding: "20px",
        marginTop: "10px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        style={{ color: "#004080", fontSize: "40px", fontWeight: "bold" }}
      >
        MoneyLog - Simplifying Your Business Finances
      </Typography>

      <Typography variant="body1" paragraph>
        Manage your business finances effortlessly with MoneyLog. Track
        transactions, generate reports, and streamline your financial workflows
        in one place.
      </Typography>

      <Typography variant="body1" paragraph>
        With MoneyLog, automate tracking and invoicing to grow your business
        efficiently.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
          position: "relative",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            backgroundColor: "#f4f4f4",
            borderRadius: "10px",
            boxShadow: 2,
            width: "100%",
            maxWidth: isMobile ? "80%" : "100%",
            flexDirection: "column", // Stack content vertically
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", color: "#004080", fontWeight: "bold" }}
          >
            {features[currentSlide].title}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {features[currentSlide].description}
          </Typography>
        </Box>

        {/* Mobile Navigation */}
        {isMobile && (
          <Box
            sx={{
              width: "100%",
              maxHeight: "100px",
              textAlign: "center",
              marginTop: "10px", // Add space between content and buttons
              display: "flex",
              justifyContent: "space-between",
              gap: "auto",
            }}
          >
            <Button
              variant="contained"
              sx={{
                padding: "",
              }}
              onClick={prevSlide}
            >
              <IoIosArrowBack />
            </Button>
            <Button
              variant="contained"
              sx={{
                padding: "",
              }}
              onClick={nextSlide}
            >
              <IoIosArrowForward />
            </Button>
          </Box>
        )}
        {/* Static features for Desktop */}
        {!isMobile && (
          <Grid container spacing={3} sx={{ marginTop: "20px" }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: "20px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e0f7fa", // light blue on hover
                      boxShadow: "0 6px 20px rgba(0,0,0,0.2)", // deeper shadow on hover
                      transform: "scale(1.03)", // slight zoom effect
                      cursor: "pointer",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ color: "#004080", fontWeight: "bold" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">{feature.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MoneyLogPage;
