import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useLocation, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import PaymentsIcon from "@mui/icons-material/Payments";
const Footer = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to navigate to the home page and scroll to the top smoothly
  const handleLogoClick = () => {
    navigate("/"); // Navigate to the home page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token or user info exists in localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  const location = useLocation();

  return (
    <Box
      sx={{
        backgroundColor: "#063852",
        color: "#fff",
        py: 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <Container>
        <Grid container spacing={4} direction="column" sx={{ mt: 2 }}>
          {/* About Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                padding: "10px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Link
                  onClick={handleLogoClick}
                  sx={{
                    color: "#0077b6",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      color: "#f39c12",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <PaymentsIcon sx={{ marginRight: 1 }} />
                  MoneyLog
                </Link>
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap", // Wrap content on smaller screens
                }}
              >
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Contact Us", href: "/contact-us" },
                  { label: "Terms & Conditions", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Help", href: "/help" },
                  ...(isLoggedIn ? [] : [{ label: "Login", href: "/login" }]),
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color:
                        location.pathname === item.href ? "#f39c12" : "inherit",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                      "&:hover": {
                        color: "#f39c12",
                      },
                      fontSize: { xs: "0.875rem", sm: "1rem" }, // Responsive font size
                    }}
                  >
                    <SendIcon sx={{ marginRight: 1 }} />
                    {item.label}
                  </Link>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                padding: "10px",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <MailOutlineIcon sx={{ color: "#757575" }} />
                <Link
                  href="mailto:moneylog.team@gmail.com"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    transition: "color 0.3s ease",
                    "&:hover": { color: "#f39c12" },
                  }}
                >
                  moneylog.team@gmail.com
                </Link>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <PhoneIcon sx={{ color: "#757575" }} />
                <Typography variant="body2">+123 456 789</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Footer Text */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                backgroundColor: "skyblue",
                padding: "10px 20px",
                borderRadius: 2,
              }}
            >
              {/* Left Side Text */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: "#757575",
                  textAlign: { xs: "", sm: "left" }, // Center on mobile, left on larger
                  width: { xs: "100%", sm: "auto" }, // Full width on mobile, auto on larger
                  mb: { xs: 2, sm: 0 }, // Margin bottom on mobile for spacing
                }}
              >
                © 2025 MoneyLog. All rights reserved.
              </Typography>

              {/* Right Side Icons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: { xs: "center", sm: "flex-end" }, // Center icons on mobile, right on larger
                  width: { xs: "50%", sm: "auto" }, // Full width on mobile, auto on larger
                }}
              >
                <Link
                  href="https://wa.me/123456789"
                  target="_blank"
                  sx={{
                    color: "inherit",
                    transition: "color 0.3s ease",
                    "&:hover": { color: "#25D366" },
                  }}
                >
                  <WhatsAppIcon />
                </Link>

                <Link
                  href="https://instagram.com/yourprofile"
                  target="_blank"
                  sx={{
                    color: "inherit",
                    transition: "color 0.3s ease",
                    "&:hover": { color: "#E1306C" },
                  }}
                >
                  <InstagramIcon />
                </Link>

                <Link
                  href="https://twitter.com/yourprofile"
                  target="_blank"
                  sx={{
                    color: "inherit",
                    transition: "color 0.3s ease",
                    "&:hover": { color: "#1DA1F2" },
                  }}
                >
                  <TwitterIcon />
                </Link>

                <Link
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  sx={{
                    color: "inherit",
                    transition: "color 0.3s ease",
                    "&:hover": { color: "#0077B5" },
                  }}
                >
                  <LinkedInIcon />
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
