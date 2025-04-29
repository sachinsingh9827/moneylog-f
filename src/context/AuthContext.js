// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
  });
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setAuth({
        user: JSON.parse(storedUser),
        token: storedToken,
      });
    }
    setLoading(false); // Set loading to false once authentication state is initialized
  }, []); // Run only on component mount

  const login = ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setAuth({ user, token });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuth({ user: null, token: null });
  };

  if (loading) {
    return null; // Optionally, return a loading spinner or null while waiting for the state
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
