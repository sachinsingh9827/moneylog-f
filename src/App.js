import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import NotFound from "./components/NotFound";
import Navbar from "./components/Navbar";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import Toast from "./components/Toast";
import Profile from "./pages/Profile/Profile";
import TransactionsList from "./pages/TransactionsList/TransactionsList";
import AddCustomer from "./pages/AddCustomer/AddCustomer";
import AddTransaction from "./pages/AddTransaction/AddTransaction";
import AboutPage from "./pages/AboutPage/AboutPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import "./App.css";
import ContactUsPage from "./pages/ContactUsPage/ContactUsPage";
import TermsAndConditions from "./pages/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import HelpCenter from "./pages/HelpCenter/HelpCenter";
import AllUsersLastLoginPage from "./pages/AULLogin/AllUsersLastLoginPage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import BudgetPage from "./pages/BudgetPage/BudgetPage";

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Navbar />
        <Toast />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/budget" element={<BudgetPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<TransactionsList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-customer" element={<AddCustomer />} />
            <Route path="add-transaction" element={<AddTransaction />} />
            <Route path="history/:id" element={<HistoryPage />} />
            <Route
              path="all-users-last-login/admin"
              element={<AllUsersLastLoginPage />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
