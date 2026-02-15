import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import LeaveDetailModal from "./LeaveDetailModal.jsx";

const LeaveStatus = () => {
  const [selectedLeave, setSelectedLeave] = useState(null);

  const leaves = [
    {
      id: 1,
      type: "Nghỉ phép năm",
      startDate: "2025-02-20",
      endDate: "2025-02-22",
      reason: "Việc gia đình",
      status: "Chờ duyệt",
    },
    {
      id: 2,
      type: "Nghỉ ốm",
      startDate: "2025-01-10",
      endDate: "2025-01-10",
      reason: "Khám bệnh",
      status: "Đã duyệt",
    },
    // demo nhiều dòng
    ...Array(10).fill({
      id: 3,
      type: "Nghỉ phép năm",
      startDate: "2025-02-20",
      endDate: "2025-02-22",
      reason: "Việc gia đình",
      status: "Chờ duyệt",
    }),
  ];

  const handleDelete = (id) => {
    alert("Xóa đơn nghỉ ID: " + id);
  };

  return (
    <>
      {/* SCROLLBAR STYLE */}
      <style>
        {`
          .leave-scroll::-webkit-scrollbar {
            width: 6px;
          }

          .leave-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .leave-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 999px;
          }

          .leave-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          /* Firefox */
          .leave-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
        `}
      </style>

      <div style={styles.card}>
        {/* SCROLL AREA */}
        <div style={styles.tableWrapper} className="leave-scroll">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>STT</th>
                <th style={styles.th}>Loại nghỉ</th>
                <th style={styles.th}>Từ ngày</th>
                <th style={styles.th}>Đến ngày</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{leave.type}</td>
                  <td style={styles.td}>{leave.startDate}</td>
                  <td style={styles.td}>{leave.endDate}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        background:
                          leave.status === "Đã duyệt" ? "#dcfce7" : "#fef3c7",
                        color:
                          leave.status === "Đã duyệt" ? "#166534" : "#92400e",
                      }}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <Eye
                      size={18}
                      style={styles.eye}
                      onClick={() => setSelectedLeave(leave)}
                    />
                    <Trash2
                      size={18}
                      style={styles.delete}
                      onClick={() => handleDelete(leave.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedLeave && (
        <LeaveDetailModal
          leave={selectedLeave}
          onClose={() => setSelectedLeave(null)}
        />
      )}
    </>
  );
};

export default LeaveStatus;

const styles = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  tableWrapper: {
    maxHeight: "500px",
    overflowY: "auto",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    padding: "12px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },

  tr: {
    transition: "background 0.15s ease",
  },

  td: {
    padding: "14px 12px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #e5e7eb",
  },

  status: {
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  eye: {
    cursor: "pointer",
    color: "#2563eb",
    marginRight: "12px",
  },

  delete: {
    cursor: "pointer",
    color: "#ef4444",
  },
};