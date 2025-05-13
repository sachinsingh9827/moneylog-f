import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import logo from "../../assets/moneylog.png";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

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
        py: 4,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              About MoneyLog
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc" }}>
              MoneyLog is a smart financial tracking app that helps you manage
              expenses, monitor budgets, and reach your financial goals with
              ease. We aim to simplify money management for individuals and
              businesses.
            </Typography>
          </Grid>

          {/* Branding & Links */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {/* Logo */}
              <Link
                onClick={handleLogoClick}
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#0077b6",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#f39c12",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    height: "30px",
                    width: "30px",
                    objectFit: "contain",
                    background: "transparent",
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                  style={{ marginLeft: "5px" }}
                >
                  MoneyLog
                </Typography>
              </Link>

              {/* Navigation Links */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Contact Us", href: "/contact-us" },
                  { label: "Terms & Conditions", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Help", href: "/help" },
                  { label: "Budget", href: "/budget" },
                  ...(isLoggedIn ? [] : [{ label: "Login", href: "/login" }]),
                ].map((item) => (
                  <MuiLink
                    component={RouterLink}
                    to={item.href}
                    key={item.href}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color:
                        location.pathname === item.href ? "#f39c12" : "inherit",
                      transition: "color 0.3s ease",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      "&:hover": { color: "#f39c12" },
                    }}
                    onClick={handleLogoClick}
                  >
                    <SendIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    {item.label}
                  </MuiLink>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                px: 2,
                py: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MailOutlineIcon sx={{ color: "#ccc" }} />
                <Link
                  href="mailto:moneylog.team@gmail.com"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": { color: "#f39c12" },
                  }}
                >
                  moneylog.team@gmail.com
                </Link>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ color: "#ccc" }} />
                <Typography variant="body2" sx={{ color: "#ff9800" }}>
                  Coming Soon!
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Social & Copyright */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#272d30",
                px: 2,
                py: 2,
                borderRadius: 2,
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  color: "#",
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                © 2025 MoneyLog. All rights reserved.
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Link
                  href="https://wa.me/123456789"
                  target="_blank"
                  sx={{ color: "inherit", "&:hover": { color: "#25D366" } }}
                >
                  <WhatsAppIcon />
                </Link>
                <Link
                  href="https://instagram.com/yourprofile"
                  target="_blank"
                  sx={{ color: "inherit", "&:hover": { color: "#E1306C" } }}
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href="https://twitter.com/yourprofile"
                  target="_blank"
                  sx={{ color: "inherit", "&:hover": { color: "#1DA1F2" } }}
                >
                  <TwitterIcon />
                </Link>
                <Link
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  sx={{ color: "inherit", "&:hover": { color: "#0077B5" } }}
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
