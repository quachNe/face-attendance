import React from "react";
import EmployeeManagement from "./EmployeeManagement";
import AttendanceHistory from "./AttendanceHistory";
import ShiftManagement from "./ShiftManagement";
import backgroundImg from "/background.jpg";

const Rightbar = ({ activePage }) => {
  return (
    <div style={styles.container}>
      <div style={styles.overlay} className="custom-scroll">
        {activePage === "employee" ? (
          <EmployeeManagement />
        ) : activePage === "history" ? (
          <AttendanceHistory />
        ) : activePage === "shift" ? (
          <ShiftManagement />
        ) : (<div>Chưa có trang này</div>)}
      </div>

      <style>
        {`
          .custom-scroll {
            overflow-y: auto;
          }
          .custom-scroll::-webkit-scrollbar { width: 8px; }
          .custom-scroll::-webkit-scrollbar-track { background: #020617; }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #0ca1a1;
            border-radius: 10px;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    height: "calc(100vh - 60px)", // ❗ trừ navbar
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
  },

  overlay: {
    height: "100%",
    padding: 32,
    background: "rgba(1,1,5,0.85)",
    color: "#e5e7eb",
  },
};

export default Rightbar;
