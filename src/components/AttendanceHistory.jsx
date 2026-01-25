import React, { useState } from "react";
import { AiOutlineFileExcel } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { Styles, DEFAULT_FACE } from "./Styles";

const AttendanceHistory = () => {
  const [records] = useState([
    { id: 1, name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/60?img=3", checkIn: "08:01", note: "Đúng giờ" },
    { id: 2, name: "Trần Thị B", avatar: null, checkIn: "08:15", note: "Đi trễ" },
    { id: 3, name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/60?img=3", checkIn: "—", note: "Quên check-in" },
  ]);

  return (
    <>
      <div style={Styles.header}>
        <h1 style={Styles.title}>ĐIỂM DANH NHÂN VIÊN</h1>
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
                {["STT", "Ảnh", "Nhân viên", "Giờ vào", "Trạng thái", "Ghi chú"].map((h) => (
                  <th key={h} style={Styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const hasAttendance = r.checkIn !== "—";
                return (
                  <tr key={r.id}>
                    <td style={Styles.td}>{i + 1}</td>
                    <td style={Styles.td}><img src={r.avatar || DEFAULT_FACE} alt="" style={Styles.faceImg} /></td>
                    <td style={Styles.td}>{r.name}</td>
                    <td style={Styles.td}>{r.checkIn}</td>
                    <td style={{ ...Styles.td, fontSize: 18, fontWeight: 700, color: hasAttendance ? "#22c55e" : "#ef4444" }}>
                      {hasAttendance ? "✓" : "✕"}
                    </td>
                    <td style={{ ...Styles.td, fontWeight: 600, color: r.note.includes("trễ") || r.note.includes("Quên") ? "#ef4444" : "#22c55e" }}>
                      {r.note}
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