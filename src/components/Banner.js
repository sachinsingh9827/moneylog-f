import React from "react";
import "./css/Banner.css";

// Reusable Banner Component
const Banner = ({ heading, description }) => {
  const handleBack = () => {
    window.history.back(); // Navigates to the previous page
  };

  return (
    <div className="banner">
      {/* Back Button */}
      <button className="back-button" onClick={handleBack}>
        &lt; Back
      </button>

      <div className="banner-content">
        <h1>{heading}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Banner;
