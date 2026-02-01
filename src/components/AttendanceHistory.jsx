import React, { useEffect, useState } from "react";
import { AiOutlineFileExcel } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { Styles, stylesButton, stylesForm, styleTable} from "./Styles";
import { ClipboardCheck} from "lucide-react";

const datePickerStyles = `
  .custom-date-input {
    color-scheme: dark; /* giúp icon trắng/sáng ở Firefox và một số trường hợp Chrome */
  }

  .custom-date-input::-webkit-calendar-picker-indicator {
    filter: brightness(0) invert(1); /* biến icon thành trắng hoàn toàn */
    opacity: 1 !important;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }

  .custom-date-input::-webkit-inner-spin-button,
  .custom-date-input::-webkit-clear-button {
    display: none; /* ẩn các nút spin nếu có */
  }
`;

const AttendanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
          <input placeholder="Tìm kiếm nhân viên..." style={stylesForm.searchInput} />
          <input type="date" 
            style={stylesForm.formInput} 
            className={"custom-date-input"} 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div style={Styles.rightActions}>
            <button style={stylesButton.btnExcel}><AiOutlineFileExcel /> Xuất Excel</button>
            <button style={stylesButton.btnPdf}><FiFileText /> Xuất PDF</button>
          </div>
        </div>
      </div>

      <div style={styleTable.tableWrapper}>
        <div style={styleTable.tableScroll} className="custom-scroll">
          <table style={styleTable.table}>
            <thead>
              <tr>
                {["STT","Nhân viên", "Giờ điểm danh", "Ghi chú"].map((h) => (
                  <th key={h} style={styleTable.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                return (
                  <tr key={r.id}>
                    <td style={styleTable.td}>{i + 1}</td>
                    <td style={styleTable.td}>{r.name}</td>
                    <td style={styleTable.td}>{r.time}</td>
                    <td
                      style={{
                        ...styleTable.td,
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