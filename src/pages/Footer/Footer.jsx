import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Button,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/moneylog.png";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) setIsLoggedIn(true);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => {
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  const navLinks = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact-us" },
    { label: "Privacy", path: "/privacy" },
    { label: "Terms", path: "/terms" },
    { label: "Help", path: "/help" },
    { label: "Budget", path: "/budget" },
    ...(isLoggedIn ? [] : [{ label: "Login", path: "/login" }]),
  ];

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
          {/* Branding & Links */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Link
                onClick={() => navigate("/")}
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
                  onClick={() =>
                    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                  }
                >
                  MoneyLog
                </Typography>
              </Link>
            </Box>
            <Typography variant="body2" sx={{ color: "#ccc", mb: 3 }}>
              Smart expense tracking and budgeting app to manage your finances
              with ease.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  underline="none"
                  sx={{
                    color: location.pathname === link.path ? "#f39c12" : "#ccc",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.2,
                    "& .hover-icon": {
                      opacity: 0,
                      transform: "translateX(-5px)",
                      transition: "all 0.3s ease",
                    },
                    "&:hover .hover-icon": {
                      opacity: 1,
                      transform: "translateX(0)",
                    },
                    "&:hover": {
                      color: "#f39c12",
                    },
                  }}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <Box component="span" className="hover-icon">
                    <SendIcon sx={{ mt: 1, fontSize: 16 }} />
                  </Box>
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact & Social */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <MailOutlineIcon sx={{ mr: 1, color: "#ccc" }} />
              <Link
                href="mailto:moneylog.team@gmail.com"
                sx={{ color: "#ccc", "&:hover": { color: "#f39c12" } }}
              >
                moneylog.team@gmail.com
              </Link>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <PhoneIcon sx={{ mr: 1, color: "#ccc" }} />
              <Typography sx={{ color: "#ff9800" }}>Coming Soon!</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                component="a"
                href="https://wa.me/123456789"
                target="_blank"
                sx={{ color: "#ccc", "&:hover": { color: "#25D366" } }}
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com/yourprofile"
                target="_blank"
                sx={{ color: "#ccc", "&:hover": { color: "#E1306C" } }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com/yourprofile"
                target="_blank"
                sx={{ color: "#ccc", "&:hover": { color: "#1DA1F2" } }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                sx={{ color: "#ccc", "&:hover": { color: "#0077B5" } }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Install App Button */}
        {showInstallButton && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<InstallMobileIcon />}
              onClick={handleInstallClick}
              sx={{
                backgroundColor: "#f39c12",
                color: "#fff",
                px: 3,
                "&:hover": { backgroundColor: "#e67e22" },
              }}
            >
              Install MoneyLog App
            </Button>
          </Box>
        )}

        {/* Footer Bottom */}
        <Box
          sx={{
            borderTop: "1px solid #444",
            mt: 5,
            pt: 3,
            textAlign: "center",
            fontSize: "0.85rem",
            color: "#aaa",
          }}
        >
          © 2025 MoneyLog. All rights reserved.
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
