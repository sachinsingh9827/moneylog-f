import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./css/Navbar.css";
import { HiOutlineLogout } from "react-icons/hi"; // Import profile icon
import { showToast } from "./Toast";
import logo from "../assets/moneylog.png";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    showToast("You have been logged out successfully.", "info");
    logout();
    setMenuOpen(false);
    window.location.reload(); // This will reload the page
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            to="/"
            style={{
              height: "30px",
              width: "30px",
              objectFit: "contain",
              background: "transparent",
            }}
          />
        </Link>
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
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact-us" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link to="/help" onClick={() => setMenuOpen(false)}>
              Help
            </Link>
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
            <div className="logout-btn-wrapper">
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
