import React from "react";
import "./CardHeroSection.css"; // Import the CSS file

const CardHeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Manage Your Business Finances Smartly</h1>
        <p className="hero-description">
          Manage finances with{" "}
          <span className="moneylog-highlight">MoneyLog</span> — effortless
          tracking and reporting.
        </p>
      </div>
    </div>
  );
};

export default CardHeroSection;
