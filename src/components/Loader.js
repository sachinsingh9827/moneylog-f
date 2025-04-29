import React from "react";
import "./css/Loader.css"; // Make sure to create the CSS file for styling

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="scratched"></div>
      </div>
    </div>
  );
};

export default Loader;
