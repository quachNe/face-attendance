import { Outlet } from "react-router-dom";
import SideBar from "../components/layout/SideBar"
import NavBar from "../components/layout/NavBar";
import backgroundImg from "/background.jpg";

const Dashboard = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sibar */}
      <SideBar />

      {/* Navbar && Rightbar*/}
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
        <NavBar />
        <div
          style={{
            flex: 1,
            height: "calc(100vh - 60px)",
            overflow: "hidden",
            minHeight: 0,  
          }}
        >
          <div
            style={{
              height: "100%",
              padding: 32,
              background: "rgba(1,1,5,0.85)",
              color: "#e5e7eb",
              // overflowY: "auto",
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
