import React from "react";
import Sidebar from "../../components/sidebar";
import Rightbar from "../../components/rightbar";

const Dashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Rightbar />
    </div>
  );
};

export default Dashboard;
