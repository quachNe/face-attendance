import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>

      <p>✔ Tổng nhân viên: 25</p>
      <p>✔ Điểm danh hôm nay: 18</p>

      <button onClick={() => navigate("/login")}>Logout</button>
    </div>
  );
};

export default Dashboard;
