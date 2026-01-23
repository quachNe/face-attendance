import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Rightbar from "../components/rightbar";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setActivePage={setActivePage} />
      <Rightbar activePage={activePage} />
    </div>
  );
};

export default Dashboard;
