import React, { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [amount, setAmount] = useState(1000); // Default amount in rupees

  const loadRazorpay = async () => {
    try {
      // Call the backend to create Razorpay order
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount }
      );

      const options = {
        key: data.key, // Razorpay key_id
        amount: data.order.amount,
        currency: "INR",
        name: "My App",
        description: "Test Payment",
        order_id: data.order.id,
        handler: async function (response) {
          // Send the payment details to the backend for verification
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verifyRes.data.success) {
            alert("Payment Successful!");
          } else {
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment Failed");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Make Payment</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount (INR)"
      />

      <button onClick={loadRazorpay}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;
