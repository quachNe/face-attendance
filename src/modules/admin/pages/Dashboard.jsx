import { Outlet } from "react-router-dom";
import SideBar from "../components/layout/SideBar";
import NavBar from "../components/layout/NavBar";
import backgroundImg from "/background.jpg";
import { useState } from "react";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* NAVBAR */}
      <NavBar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* BODY */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        
        {/* SIDEBAR */}
        <SideBar collapsed={collapsed} />

        {/* RIGHT CONTENT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: 32,
              background: "rgba(1,1,5,0.85)",
              color: "#e5e7eb",
              overflowY: "hidden",
            }}
          >
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;