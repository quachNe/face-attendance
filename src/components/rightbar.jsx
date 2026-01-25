import React from "react";
import EmployeeManagement from "./EmployeeManagement";
import AttendanceHistory from "./AttendanceHistory";
import { Styles } from "./Styles";
import "../App.css";

const Rightbar = ({ activePage }) => {
  return (
    <div style={Styles.container}>
      <div style={Styles.overlay}>
        
        {activePage === "employee" ? <EmployeeManagement /> : <AttendanceHistory />}

        <style>
          {`
            .custom-scroll::-webkit-scrollbar { width: 8px; }
            .custom-scroll::-webkit-scrollbar-track { background: #020617; border-radius: 10px; }
            .custom-scroll::-webkit-scrollbar-thumb { background: #0ca1a1; border-radius: 10px; }
            .custom-scroll::-webkit-scrollbar-thumb:hover { background: #22d3ee; }
            .custom-scroll { scrollbar-width: thin; scrollbar-color: #0ca1a1 #020617; }
          `}
        </style>
      </div>
    </div>
  );
};

export default Rightbar;