import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Function to show toast notifications
export const showToast = (message, type = "error") => {
  toast[type](message, {
    position: "top-right", // Position at top-right
    className: "custom-toast", // Custom styling class
    closeButton: false, // Hide the close button
  });
};

const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000} // Auto close after 2 seconds
      closeButton={false} // Hide the close button
      newestOnTop={false}
      rtl={false}
      draggable
      pauseOnFocusLoss
      pauseOnHover
      theme="light"
      toastClassName="custom-toast" // Apply custom toast class for styling
    />
  );
};

export default Toast;
