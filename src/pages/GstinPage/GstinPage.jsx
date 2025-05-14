import React, { useState, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  FaMoneyBillWave,
  FaChartBar,
  FaUsers,
  FaFileInvoiceDollar,
  FaWallet,
} from "react-icons/fa";

const features = [
  {
    title: "Real-Time Transaction Tracking",
    description:
      "Easily monitor income, expenses, and balances with instant updates to keep your finances transparent and up-to-date.",
    icon: <FaMoneyBillWave size={36} />,
  },
  {
    title: "Instant Financial Reports",
    description:
      "Generate detailed profit & loss, balance sheets, and cash flow statements with a single click — financial clarity, simplified.",
    icon: <FaChartBar size={36} />,
  },
  {
    title: "Customer & Vendor Management",
    description:
      "Maintain comprehensive records of customers and suppliers to streamline transactions and stay compliant effortlessly.",
    icon: <FaUsers size={36} />,
  },
  {
    title: "Seamless Invoicing",
    description:
      "Create, send, and manage professional invoices, tracking payments and outstanding amounts—all in one place.",
    icon: <FaFileInvoiceDollar size={36} />,
  },
  {
    title: "Cash Flow Optimization",
    description:
      "Visualize your cash flow in real-time to make strategic decisions that keep your business financially healthy.",
    icon: <FaWallet size={36} />,
  },
];

const MoneyLogPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md ~ 960px

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const nextIndex = (prev + 1) % features.length;
      scrollToIndex(nextIndex);
      return nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const prevIndex = (prev - 1 + features.length) % features.length;
      scrollToIndex(prevIndex);
      return prevIndex;
    });
  };

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const width = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: index * width,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setCurrentSlide(index);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 5, md: 7 },
        fontFamily: "'Roboto', sans-serif",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "500",
          mb: 1,
          letterSpacing: 2,
          textAlign: "center",
          color: "#004080",
          textTransform: "uppercase",
        }}
      >
        MoneyLog
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          mb: 5,
          fontWeight: "400",
          color: "#004080",
          userSelect: "text",
          fontSize: { xs: "0.95rem", sm: "1.1rem" },
          maxWidth: { xs: "90%", sm: "70%", md: 700 },
          lineHeight: 1.4,
          mx: "auto",
        }}
      >
        Your ultimate solution for effortless business finance management.
      </Typography>

      {/* Mobile Carousel */}
      {isMobile ? (
        <>
          <Box
            ref={carouselRef}
            onScroll={handleScroll}
            sx={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              gap: 2,
              pb: 2,
              width: "100%",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {features.map((feature, i) => (
              <Box
                key={i}
                sx={{
                  scrollSnapAlign: "start",
                  flexShrink: 0,
                  width: "100%",
                  bgcolor: "#1e1e1e",
                  borderRadius: 1,
                  p: 4,
                  boxShadow:
                    i === currentSlide
                      ? "0 0 20px 4px #004080"
                      : "0 2px 10px rgba(0,0,0,0.8)",
                  transition: "box-shadow 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  maxHeight: "500px",
                }}
              >
                <Box sx={{ color: "#6ab7ff", mb: 3 }}>{feature.icon}</Box>
                <Typography
                  component="h3"
                  sx={{
                    fontWeight: "700",
                    fontSize: "1.4rem",
                    mb: 2,
                    color: "#81d4fa",
                    textTransform: "uppercase",
                    userSelect: "text",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "1.05rem",
                    color: "#c0c0c0",
                    userSelect: "text",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
              width: "100%",
              maxWidth: 1200,
            }}
          >
            <IconButton
              onClick={prevSlide}
              aria-label="Previous feature"
              sx={{
                bgcolor: "#1e1e1e",
                borderRadius: "50%",
                color: "#6ab7ff",
                boxShadow: "0 0 10px #6ab7ff",
                "&:hover": {
                  bgcolor: "#81d4fa",
                  color: "#121212",
                  boxShadow: "0 0 15px #81d4fa",
                },
                transition: "all 0.3s ease",
                width: 48,
                height: 48,
              }}
            >
              <IoIosArrowBack size={24} />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              aria-label="Next feature"
              sx={{
                bgcolor: "#1e1e1e",
                borderRadius: "50%",
                color: "#6ab7ff",
                boxShadow: "0 0 10px #6ab7ff",
                "&:hover": {
                  bgcolor: "#81d4fa",
                  color: "#121212",
                  boxShadow: "0 0 15px #81d4fa",
                },
                transition: "all 0.3s ease",
                width: 48,
                height: 48,
              }}
            >
              <IoIosArrowForward size={24} />
            </IconButton>
          </Box>
        </>
      ) : (
        // Desktop Grid
        <Grid
          container
          spacing={4}
          sx={{
            width: "100%",
            maxWidth: 1200,
            px: 0,
            mx: "auto",
          }}
        >
          {features.map((feature, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                sx={{
                  bgcolor: "#1e1e1e",
                  borderRadius: 4,
                  p: 5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: "0 0 12px rgba(42, 161, 255, 0.35)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "default",
                  userSelect: "text",
                  "&:hover": {
                    boxShadow: "0 0 30px rgba(42, 161, 255, 0.8)",
                    transform: "translateY(-8px)",
                    cursor: "pointer",
                  },
                }}
              >
                <Box sx={{ color: "#6ab7ff", mb: 3 }}>{feature.icon}</Box>
                <Typography
                  component="h3"
                  sx={{
                    fontWeight: "700",
                    fontSize: "1.4rem",
                    mb: 2,
                    color: "#81d4fa",
                    textTransform: "uppercase",
                    userSelect: "text",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "1.05rem",
                    color: "#c0c0c0",
                    userSelect: "text",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Box
        sx={{
          mt: 6,
          maxWidth: 900,
          px: { xs: 1, sm: 4 },
          userSelect: "text",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#004080",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            lineHeight: 1.5,
          }}
        >
          Empower your business with MoneyLog — smart, intuitive, and designed
          for your financial success.
        </Typography>
      </Box>
      <Box sx={{ height: { xs: "20px", sm: "40px" } }} />
    </Box>
  );
};

export default MoneyLogPage;
