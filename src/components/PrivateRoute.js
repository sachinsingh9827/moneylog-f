// components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return null; // You can display a loading spinner here if needed
  }

  // If there's no token, redirect to login
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
