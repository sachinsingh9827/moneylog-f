import React from "react";
import "./AboutPage.css";
import Banner from "../../components/Banner";

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Banner Section */}
      <Banner
        heading="Track Your Transactions with MoneyLog"
        description="Manage your finances easily. Keep track of all your payments and transactions."
      />

      {/* Main Content Section */}
      <section className="about-container">
        <h2>Transaction Record</h2>

        {/* Transaction List */}
        <ul className="transaction-list">
          <li>
            <strong>Transaction ID:</strong> #001 <br />
            <strong>Date:</strong> 2025-04-24 <br />
            <strong>Payee:</strong> John Doe <br />
            <strong>Amount:</strong> ₹500 <br />
            <strong>Status:</strong> Paid
          </li>
          {/* Add more transaction records here */}
        </ul>

        <h2>How It Works</h2>
        <p>
          MoneyLog helps you track your financial transactions in a simple and
          organized manner. Record each transaction and monitor its status,
          whether it's paid or pending.
        </p>

        <h2>Manage Your Transactions</h2>
        <p>
          You can add, update, or delete transactions anytime. Each transaction
          is identified by a unique transaction ID for easy tracking.
        </p>

        <h2>Stay Updated</h2>
        <p>
          Receive notifications for pending payments, so you never miss an
          update on your finances.
        </p>
      </section>

      {/* Footer Section */}
      <div className="about-footer" />
    </div>
  );
};

export default AboutPage;
