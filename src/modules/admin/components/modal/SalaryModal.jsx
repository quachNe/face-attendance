import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { styleModel } from "../../style/Styles";

const SalaryModal = ({ show, salary, onClose }) => {

    const [animate, setAnimate] = useState(false);

    /* ESC CLOSE */
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" && show) handleClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [show]);

    /* OPEN ANIMATION */
    useEffect(() => {
        if (show) setTimeout(() => setAnimate(true), 10);
    }, [show]);

    const handleClose = () => {
        setAnimate(false);
        setTimeout(() => onClose(), 250);
    };

    if (!show || !salary) return null;

    const formatMoney = (v) =>
        new Intl.NumberFormat("vi-VN").format(v) + " ₫";

    return (
        <div style={styleModel.modalOverlay}>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    ...styleModel.modal,
                    width: 600,
                    padding: "28px",
                    transform: animate ? "translateY(0)" : "translateY(-50px)",
                    opacity: animate ? 1 : 0,
                    transition: "all 0.25s ease",
                }}
            >

                {/* CLOSE */}
                <button onClick={handleClose} style={styleModel.btnClose}>
                    <X size={20}/>
                </button>

                {/* TITLE */}
                <h2 style={styleModel.modalTitle}>
                    BẢNG LƯƠNG THÁNG {salary.month}/{salary.year}
                </h2>

                {/* ====== 1. THÔNG TIN NHÂN VIÊN ====== */}

                <Section title="1. Thông tin nhân viên">
                    <div style={styles.grid}>
                        <Info label="Mã nhân viên" value={salary.user_id}/>
                        <Info label="Họ và tên" value={salary.name}/>
                        <Info label="Mã tài khoản" value={salary.employee_code}/>
                        <Info label="Chức vụ" value={salary.role === "admin" ? "Quản trị viên" : "Nhân viên"}/>
                        <Info label="Email" value={salary.email || "---"}/>
                        <Info label="Số điện thoại" value={salary.phone || "---"}/>
                    </div>
                </Section>

                <hr style={styles.divider} />
                {/* ====== 2. CHẤM CÔNG ====== */}

                <Section title="2. Thông tin chấm công">
                    <div style={styles.grid}>
                        <Info label="Tổng số ngày làm việc" value={salary.total_working_days}/>
                        <Info label="Tổng số ngày nghỉ phép" value={salary.leave_days}/>
                        <Info label="Tổng số ngày vắng" value={salary.absent_days}/>
                        <Info label="Tổng số phút đi trễ" value={salary.total_late_minutes}/>
                        <Info label="Tổng số phút về sớm" value={salary.total_early_minutes}/>
                        <Info label="Tổng số phút tăng ca" value={salary.total_overtime_minutes}/>
                    </div>
                </Section>
                <hr style={styles.divider} />
                {/* ====== 3. CHI TIẾT LƯƠNG ====== */}

                <Section title="3. Chi tiết lương">
                    <div style={styles.grid}>
                        <Info label="Lương cơ bản" value={formatMoney(salary.base_salary)}/>
                        <Info label="Thưởng tăng ca" value={formatMoney(salary.overtime_bonus)}/>
                        <Info label="Khấu trừ" value={formatMoney(salary.deductions)}/>
                    </div>
                </Section>

                {/* ====== 4. THỰC LÃNH ====== */}

                <div style={styles.totalBox}>
                    <div style={styles.totalLabel}>Thực lãnh</div>
                    <div style={styles.totalMoney}>
                        {formatMoney(salary.net_salary)}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SalaryModal;


/* ===== COMPONENT PHỤ ===== */

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


/* ===== STYLE ===== */

const styles = {

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 18
    },

    label: {
        fontSize: 13,
        color: "#94a3b8",
        marginBottom: 2
    },

    value: {
        fontSize: 16,
        fontWeight: 600,
        color: "#e2e8f0"
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: 700,
        marginBottom: 10
    },

    totalBox: {
        marginTop: 28,
        padding: 20,
        borderRadius: 14,
        background: "#020617",
        border: "1px solid #1e293b",
        textAlign: "center"
    },

    totalLabel: {
        fontSize: 14,
        color: "#94a3b8",
        marginBottom: 6
    },

    totalMoney: {
        fontSize: 28,
        fontWeight: 800,
        color: "#22c55e"
    },
    divider: {
        border: "none",
        borderTop: "1px dashed #334155",
        margin: "20px 0"
    }
};