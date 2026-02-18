import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Styles } from "../style/Styles";

const LeaveDetailModal = ({ leave, onClose }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 200);
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "-";

  const formatDateTimeVN = (dateString) => {
    if (!dateString) return "-";

    const utcString = dateString.replace(" ", "T") + "Z";

    return new Date(utcString).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  const leaveTypeMap = {
    annual_leave: "Nghỉ phép hằng năm",
    sick_leave: "Nghỉ phép bệnh",
    personal_leave: "Nghỉ phép cá nhân",
  };

  const statusMap = {
    approved: {
      text: "Đã duyệt",
      bg: "#dcfce7",
      color: "#166534",
    },
    rejected: {
      text: "Từ chối",
      bg: "#fee2e2",
      color: "#991b1b",
    },
    pending: {
      text: "Chờ duyệt",
      bg: "#fef3c7",
      color: "#92400e",
    },
  };

  const currentStatus = statusMap[leave.status] || statusMap.pending;

  return (
    <div style={Styles.overlay} onClick={handleClose}>
      <div
        style={{
          ...modal.container,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(-20px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={Styles.header}>
          <h2 style={Styles.title}>Chi tiết đơn nghỉ phép</h2>
          <X
            size={14}
            strokeWidth={1.5}
            style={{
              ...Styles.closeBtn,
              width: "26px",
              height: "26px",
              top:15,
            }}
            onClick={handleClose}
          />

        </div>

        <div style={modal.divider} />

        {/* GRID */}
        <div style={modal.grid}>
          {/* HÀNG 1 - 3 CỘT */}
          <div style={modal.card}>
            <span style={modal.label}>Loại nghỉ phép</span>
            <span style={modal.value}>
              {leaveTypeMap[leave.leave_type] || "Không xác định"}
            </span>
          </div>

          <div style={modal.card}>
            <span style={modal.label}>Ngày gửi đơn</span>
            <span style={modal.value}>
              {formatDateTimeVN(leave.created_at)}
            </span>
          </div>

          <div style={modal.card}>
            <span style={modal.label}>Trạng thái</span>
            <span
              style={{
                ...modal.badge,
                background: currentStatus.bg,
                color: currentStatus.color,
              }}
            >
              {currentStatus.text}
            </span>
          </div>

         
          {/* HÀNG 2 - FULL WIDTH */}
          <div style={{ ...modal.card, gridColumn: "1 / -1" }}>
            <span style={modal.label}>Thời gian nghỉ</span>

            <div style={modal.dateRow}>
              <div>
                <div style={modal.subLabel}>Từ ngày</div>
                <div style={modal.value}>
                  {formatDate(leave.start_date)}
                </div>
              </div>

              <div style={modal.arrow}>→</div>

              <div>
                <div style={modal.subLabel}>Đến ngày</div>
                <div style={modal.value}>
                  {formatDate(leave.end_date)}
                </div>
              </div>
            </div>
          </div>

          {/* HÀNG 3 */}
          <div style={{ ...modal.card, gridColumn: "1 / -1" }}>
            <span style={modal.label}>Lý do nghỉ</span>
            <div style={modal.box}>
              {leave.reason || "Không có nội dung"}
            </div>
          </div>

          {/* HÀNG 4 */}
          <div style={{ ...modal.card, gridColumn: "1 / -1" }}>
            <span style={modal.label}>Phản hồi từ Admin</span>
            <div style={modal.box}>
              {leave.admin_response
                ? leave.admin_response
                : leave.status === "pending"
                ? "Đang chờ phản hồi từ quản lý..."
                : "Không có phản hồi"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailModal;

const modal = {
  container: {
    width: "700px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "32px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    transition: "all 0.2s ease",
  },

  divider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "20px 0",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 🔥 3 CỘT ĐỀU
    gap: "20px",
  },

  card: {
    padding: "18px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },

  label: {
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  subLabel: {
    fontSize: "11px",
    color: "#94a3b8",
    marginBottom: "4px",
  },

  value: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
  },

  badge: {
    width: "fit-content",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  dateRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  arrow: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#6366f1",
  },

  box: {
    background: "#ffffff",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.6",
  },
};