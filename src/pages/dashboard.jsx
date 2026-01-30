import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Rightbar from "../components/Rightbar";
import backgroundImg from "/background.jpg";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("employee");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar setActivePage={setActivePage} />

      {/* RIGHT COLUMN – BACKGROUND CHUNG */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <Navbar />
        <Rightbar activePage={activePage} />
      </div>
    </div>
  );
};

export default Dashboard;