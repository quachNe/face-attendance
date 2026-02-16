import React, { useEffect, useState } from "react";
import { Styles } from "../style/Styles";
import { X } from "lucide-react";

const LeaveDetailModal = ({ leave, onClose }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 200);
  };

  const isApproved = leave.status === "Đã duyệt";

  return (
    <div style={Styles.overlay} onClick={handleClose}>
      <div
        style={{
          ...Styles.content,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(-30px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <div style={Styles.closeBtn} onClick={handleClose}>
          <X size={18} />
        </div>

        {/* HEADER */}
        <h2 style={Styles.title}>Chi tiết đơn nghỉ phép</h2>

        <div style={modal.divider} />

        {/* CONTENT */}
        <div style={modal.grid}>
          <div style={modal.item}>
            <span style={modal.label}>Loại nghỉ</span>
            <span style={modal.value}>{leave.type}</span>
          </div>

          <div style={modal.item}>
            <span style={modal.label}>Trạng thái</span>
            <span
              style={{
                ...modal.badge,
                background: isApproved
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(251,191,36,0.15)",
                color: isApproved ? "#15803d" : "#b45309",
              }}
            >
              {leave.status}
            </span>
          </div>

          <div style={modal.item}>
            <span style={modal.label}>Từ ngày</span>
            <span style={modal.value}>{leave.startDate}</span>
          </div>

          <div style={modal.item}>
            <span style={modal.label}>Đến ngày</span>
            <span style={modal.value}>{leave.endDate}</span>
          </div>

          <div style={{ ...modal.item, gridColumn: "1 / -1" }}>
            <span style={modal.label}>Lý do</span>
            <div style={modal.reasonBox}>{leave.reason}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetailModal;

const modal = {

    header: {
        textAlign: "center",
    },

    divider: {
        height: "1px",
        background: "#e2e8f0",
        margin: "8px 0 4px 0",
    },


    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },

    item: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    label: {
        fontSize: "12px",
        fontWeight: "500",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },

    value: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#0f172a",
    },

    badge: {
        width: "fit-content",
        padding: "6px 14px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
    },

    reasonBox: {
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "14px",
        fontSize: "14px",
        color: "#334155",
        lineHeight: "1.6",
    },
};
