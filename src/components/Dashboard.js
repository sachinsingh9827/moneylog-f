import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Outlet } from "react-router-dom"; // ✅ Important

const Dashboard = () => {
  const { user } = useAuth();
  const [moneylogData, setMoneylogData] = useState({
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
    transactions: [],
  });

  // useEffect(() => {
  //   const fetchMoneylogData = async () => {
  //     try {
  //       const response = await axios.get(`/api/moneylog/${user?.id}`);
  //       setMoneylogData({
  //         totalCredit: response.data.totalCredit,
  //         totalDebit: response.data.totalDebit,
  //         balance: response.data.balance,
  //         transactions: response.data.transactions,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching moneylog data:", error);
  //     }
  //   };

  //   if (user?.id) {
  //     fetchMoneylogData();
  //   }
  // }, [user?.id]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded shadow-md p-6">
        <Outlet context={{ moneylogData }} />
      </div>
    </div>
  );
};

export default Dashboard;
