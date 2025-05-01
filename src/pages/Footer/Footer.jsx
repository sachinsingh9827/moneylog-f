import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

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

  return (
    <Box
      sx={{
        backgroundColor: "#282c34",
        color: "#fff",
        py: 3,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              About{" "}
              <Link
                onClick={handleLogoClick} // Add onClick to trigger the function
                sx={{
                  color: "#0077b6",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease", // Adjust transition for smoothness
                  "&:hover": {
                    color: "#f39c12",
                    transform: "scale(1.05)", // Hover scaling
                  },
                }}
              >
                MoneyLog
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              MoneyLog is dedicated to simplifying your business finances. With
              powerful tools for managing transactions, generating reports, and
              streamlining invoicing, we help you stay on top of your financial
              health.
            </Typography>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Quick Links
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Link
                href="/about"
                sx={{
                  display: "block",
                  color: "inherit",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#f39c12",
                  },
                }}
              >
                About Us
              </Link>
              <Link
                href="/contact-us"
                sx={{
                  display: "block",
                  color: "inherit",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#f39c12",
                  },
                }}
              >
                Contact Us
              </Link>
              <Link
                href="/terms"
                sx={{
                  display: "block",
                  color: "inherit",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#f39c12",
                  },
                }}
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                sx={{
                  display: "block",
                  color: "inherit",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#f39c12",
                  },
                }}
              >
                Privacy Policy
              </Link>{" "}
              <Link
                href="/help"
                sx={{
                  display: "block",
                  color: "inherit",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#f39c12",
                  },
                }}
              >
                Help
              </Link>
            </Typography>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Email:&nbsp;
              <Box
                component="a"
                href="mailto:moneylog.team@gmail.com"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "#f39c12",
                  },
                }}
              >
                moneylog.team@gmail.com
              </Box>
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Phone: +123 456 789
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
          </Grid>
        </Grid>

        {/* Footer Text */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography
            variant="body2"
            align="center"
            sx={{
              backgroundColor: "#f1f1f1",
              padding: "10px 20px",
              borderRadius: 2,
              fontSize: "0.875rem",
              color: "#757575",
              mt: 4, // Added margin-top for spacing
            }}
          >
            © 2025 MoneyLog. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
