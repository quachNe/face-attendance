import React, { useEffect, useState } from "react";
import { X, CheckCircle, XCircle } from "lucide-react";
import { styleModel } from "../../style/Styles";

const LeaveModal = ({ show, leave, onClose, onUpdateStatus }) => {
    const [animate, setAnimate] = useState(false);
    const [response, setResponse] = useState("");

    /* ========= ESC CLOSE ========= */
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" && show) handleClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [show]);

    /* ========= OPEN ANIMATION ========= */
    useEffect(() => {
        if (show) setTimeout(() => setAnimate(true), 10);
    }, [show]);

    /* ========= CLOSE ========= */
    const handleClose = () => {
        setAnimate(false);
        setTimeout(() => onClose(), 250);
    };

    if (!show || !leave) return null;

    /* ================= FORMAT ================= */

    const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");
    const formatDateTime = (d) => new Date(d).toLocaleString("vi-VN");

    const leaveTypeMap = {
        annual_leave: "Nghỉ phép năm",
        sick_leave: "Nghỉ ốm",
        unpaid_leave: "Nghỉ không lương",
    };

    const statusMap = {
        pending: { text: "Chờ duyệt", color: "#f59e0b" },
        approved: { text: "Đã duyệt", color: "#22c55e" },
        rejected: { text: "Từ chối", color: "#ef4444" },
    };

    const days =
        Math.ceil(
        (new Date(leave.end_date) - new Date(leave.start_date)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

    /* ================= UI ================= */

    return (
        <div style={styleModel.modalOverlay}>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    ...styleModel.modal,
                    width: 560,
                    padding: "28px 26px",
                    transform: animate ? "translateY(0)" : "translateY(-50px)",
                    opacity: animate ? 1 : 0,
                    transition: "all 0.25s ease",
                }}
            >
                {/* CLOSE BUTTON */}
                <button onClick={handleClose} style={styleModel.btnClose}>
                    <X size={20} />
                </button>

                {/* TITLE */}
                <h2 style={styleModel.modalTitle}>CHI TIẾT ĐƠN NGHỈ PHÉP</h2>

                {/* ================= THÔNG TIN ================= */}
                <div style={styles.infoGrid}>
                    <Info label="Nhân viên" value={leave.user_name} />
                    <Info label="Loại nghỉ" value={leaveTypeMap[leave.leave_type]} />

                <Info label="Ngày gửi" value={formatDateTime(leave.created_at)} />
                <div>
                    <div style={styles.label}>Trạng thái</div>
                    <div
                    style={{
                        ...styles.statusBadge,
                        background: statusMap[leave.status].color,
                    }}
                    >
                    {statusMap[leave.status].text}
                    </div>
                </div>

                    <div style={styles.dateRow}>
                        <Info label="Từ ngày" value={formatDate(leave.start_date)} />
                        <Info label="Đến ngày" value={formatDate(leave.end_date)} />
                        <Info label="Tổng ngày nghỉ" value={`${days} ngày`} />
                    </div>
                </div>

                {/* ================= LÝ DO ================= */}
                <Section title="Lý do nghỉ">
                <div style={styles.box}>{leave.reason}</div>
                </Section>

                {/* ================= PHẢN HỒI ================= */}
                <Section title="Phản hồi của quản lý">
                    <textarea
                        style={styles.textarea}
                        placeholder="Nhập phản hồi..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                    />
                </Section>

                {/* ================= ACTION ================= */}
                {leave.status === "pending" && (
                    <div style={styles.actions}>
                        <button
                            style={styles.btnReject}
                            onClick={() => onUpdateStatus(leave.id, "REJECTED", response) }
                        >
                            <XCircle size={18} /> Từ chối
                        </button>

                        <button
                            style={styles.btnApprove}
                            onClick={() => onUpdateStatus(leave.id, "APPROVED", response) }
                        >
                        <CheckCircle size={18} /> Duyệt
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ================= COMPONENT PHỤ ================= */

const Info = ({ label, value }) => (
  <div>
    <div style={styles.label}>{label}</div>
    <div style={styles.value}>{value}</div>
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ marginTop: 20 }}>
    <div style={styles.sectionTitle}>{title}</div>
    {children}
  </div>
);

export default LeaveModal;

/* ================= STYLE ================= */

const styles = {
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 18,
    },

    label: {
        fontSize: 13,
        color: "#94a3b8",
        marginBottom: 2,
    },

    value: {
        fontSize: 16,
        fontWeight: 600,
        color: "#e2e8f0",
    },

    statusBadge: {
        display: "inline-block",
        padding: "6px 14px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 14,
        color: "#fff",
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: 700,
        marginBottom: 8,
    },

    box: {
        background: "#020617",
        border: "1px solid #1e293b",
        padding: 14,
        borderRadius: 12,
        color: "#e2e8f0",
    },

    textarea: {
        width: "100%",
        height: 140,            // 👈 chiều cao cố định
        background: "#020617",
        border: "1px solid #1e293b",
        borderRadius: 12,
        padding: 14,
        color: "#fff",
        resize: "none",         // 👈 không cho kéo
        overflowY: "auto",      // 👈 có scroll khi dài
        lineHeight: 1.5,
        fontSize: 14,
        },

    dateRow: {
        gridColumn: "1 / -1",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 18,
    },

    btnReject: {
        padding: "12px 20px",
        borderRadius: 12,
        background: "#ef4444",
        border: "none",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
    },

    btnApprove: {
        padding: "12px 20px",
        borderRadius: 12,
        background: "#22c55e",
        border: "none",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 14,
        marginTop: 5,
        paddingTop: 18,
    },
};