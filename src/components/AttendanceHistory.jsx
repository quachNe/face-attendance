import React, { useEffect, useState } from "react";
import { AiOutlineFileExcel } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { Styles, stylesButton, stylesForm, styleTable} from "./Styles";
import { ClipboardCheck} from "lucide-react";
import { getLogs } from "../services/AttendanceService";

const AttendanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // LẤY DANH SÁCH ĐIỂM DANH THEO NGÀY
  const fetchAttendanceRecords = async () => {
    try {
      const { data } = await getLogs({ date });
      setRecords(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, [date]);

  return (
    <>
      <div style={Styles.header}>
        <h1 style={Styles.title}><ClipboardCheck/> QUẢN LÝ ĐIỂM DANH</h1>
        <div style={Styles.actions}>
          <input placeholder="Tìm kiếm nhân viên..." style={stylesForm.searchInput} />
          <input type="date" 
            style={stylesForm.filterSelect} 
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
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      ...styleTable.td,
                      textAlign: "center",
                      color: "#94a3b8",
                      fontStyle: "italic",
                      padding: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr key={r.id || i}>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AttendanceHistory;