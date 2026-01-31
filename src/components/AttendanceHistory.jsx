import React, { useEffect, useState } from "react";
import { AiOutlineFileExcel } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { Styles} from "./Styles";
import { ClipboardCheck} from "lucide-react";
const AttendanceHistory = () => {
  const [records, setRecords] = useState([]);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setRecords(data);
      console.log("Fetched attendance records:", data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  return (
    <>
      <div style={Styles.header}>
        <h1 style={Styles.title}><ClipboardCheck/> QUẢN LÝ ĐIỂM DANH</h1>
        <div style={Styles.actions}>
          <input placeholder="Tìm kiếm nhân viên..." style={Styles.search} />
          <input type="date" style={Styles.formInput} />
          <div style={Styles.rightActions}>
            <button style={Styles.btnExcel}><AiOutlineFileExcel /> Xuất Excel</button>
            <button style={Styles.btnPdf}><FiFileText /> Xuất PDF</button>
          </div>
        </div>
      </div>

      <div style={Styles.tableWrapper}>
        <div style={Styles.tableScroll} className="custom-scroll">
          <table style={Styles.table}>
            <thead>
              <tr>
                {["STT","Nhân viên", "Giờ điểm danh", "Ghi chú"].map((h) => (
                  <th key={h} style={Styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                return (
                  <tr key={r.id}>
                    <td style={Styles.td}>{i + 1}</td>
                    <td style={Styles.td}>{r.name}</td>
                    <td style={Styles.td}>{r.time}</td>
                    <td
                      style={{
                        ...Styles.td,
                        fontWeight: 600,
                        color:
                          r.status?.includes("muộn") || r.status?.includes("Quên")
                            ? "#ef4444"
                            : "#22c55e",
                      }}
                    >
                      {r.status}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AttendanceHistory;