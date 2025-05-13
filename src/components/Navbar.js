import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./css/Navbar.css";
import { HiOutlineLogout, HiOutlineUser } from "react-icons/hi"; // Import profile icon
import { IoHomeOutline } from "react-icons/io5";
import { Typography } from "@mui/material";
import { showToast } from "./Toast";
import logo from "../assets/moneylog.png";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState(""); // <-- State for username

  const handleLogout = () => {
    showToast("You have been logged out successfully.", "info");
    logout();
    setMenuOpen(false);
  };

  // Fetching username from localStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.name) {
      setUserName(userData.name);
    }
  }, []);

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
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
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          Moneylog
        </Link>
      </div>

      {/* <Typography variant="h6" style={{}}>
        {userName}
      </Typography> */}
      {/* Toggle button for mobile view */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {!menuOpen ? (
          <div className="menu-icon">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        ) : (
          <div className="close-icon">
            <span className="line1"></span>
            <span className="line2"></span>
          </div>
        )}
      </div>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        {!user ? (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="profile-link"
            >
              Home
            </Link>
            <Link
              to="/dashboard/profile"
              onClick={() => setMenuOpen(false)}
              className="profile-link"
            >
              Profile
            </Link>

            <div
              className="logout-btn-wrapper"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button onClick={handleLogout} className="logout-btn">
                <HiOutlineLogout size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
