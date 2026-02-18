import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import backgroundImg from "/background.jpg";

const Dashboard = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Navbar />

        {/* 🔥 PHẦN QUAN TRỌNG */}
        <div
          style={{
            flex: 1,
            height: "calc(100vh - 60px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              padding: 32,
              background: "rgba(1,1,5,0.85)",
              color: "#e5e7eb",
              overflowY: "auto",
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
