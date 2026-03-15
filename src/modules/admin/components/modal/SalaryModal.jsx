import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { styleModel } from "../../style/Styles";
import {formatMoney} from "../../../../utils/formatMoney"


const SalaryModal = ({ show, salary, onClose }) => {

    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" && show) handleClose();
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [show]);

    useEffect(() => {
        if (show) setTimeout(() => setAnimate(true), 10);
    }, [show]);

    const handleClose = () => {
        setAnimate(false);
        setTimeout(() => onClose(), 250);
    };

    if (!show || !salary) return null;

    /* ======================
       CÔNG THỨC TÍNH LƯƠNG
    ====================== */

    const STANDARD_WORKING_DAYS = 26;
    const MINUTES_IN_WORKDAY = 8 * 60;

    const baseSalary = salary.base_salary || 0;

    const dailySalary =
        baseSalary / STANDARD_WORKING_DAYS;

    const salaryFromDays =
        dailySalary * (salary.total_working_days || 0);

    const totalLateEarly =
        (salary.total_late_minutes || 0) +
        (salary.total_early_minutes || 0);

    const minutePenalty =
        dailySalary / MINUTES_IN_WORKDAY;

    const otBonusPerMinute =
        minutePenalty * 1.5;

    /* lấy trực tiếp từ backend */

    const overtimeBonus = salary.overtime_bonus || 0;
    const deductions = salary.deductions || 0;

    const totalSalary =
        salaryFromDays + overtimeBonus;

    const netSalary =
        salary.net_salary || 0;

    return (

        <div
            style={styleModel.modalOverlay}
        >

            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    ...styleModel.modal,
                    width: 920,
                    padding: "34px",
                    transform: animate ? "translateY(0)" : "translateY(-40px)",
                    opacity: animate ? 1 : 0,
                    transition: "all 0.25s ease"
                }}
            >

                {/* CLOSE */}
                <button
                    onClick={handleClose}
                    style={styleModel.btnClose}
                >
                    <X size={20}/>
                </button>

                {/* HEADER */}
                <div style={styles.header}>

                    <h2 style={styles.title}>
                        BẢNG LƯƠNG THÁNG {salary.month}/{salary.year}
                    </h2>

                    <div style={styles.titleLine}/>

                    <div style={{
                        ...styles.status,
                        color: salary.is_paid ? "#22c55e" : "#facc15"
                    }}>
                        {salary.is_paid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </div>

                </div>

                <div style={styles.layout}>

                    {/* LEFT */}
                    <div>

                        <Section title="1. Thông tin nhân viên">

                            <div style={styles.infoGrid}>

                                <Info label="Mã nhân viên:" value={salary.employee_id}/>
                                <Info label="Họ và tên:" value={salary.name}/>

                                <Info label="Mã tài khoản:" value={salary.employee_code}/>

                                <Info
                                    label="Chức vụ:"
                                    value={
                                        salary.role === "admin"
                                            ? "Quản trị viên"
                                            : "Nhân viên"
                                    }
                                />

                                <Info label="Email:" value={salary.email || "---"}/>
                                <Info label="Số điện thoại:" value={salary.phone || "---"}/>

                            </div>

                        </Section>

                        <Divider/>

                        <Section title="2. Thông tin chấm công">

                            <div style={styles.infoGrid}>

                                <Info
                                    label="Ngày công tính lương:"
                                    value={`${salary.total_working_days} / ${STANDARD_WORKING_DAYS}`}
                                />

                                <Info label="Ngày đi làm:" value={salary.actual_work_days}/>
                                <Info label="Nghỉ phép:" value={salary.leave_days}/>
                                <Info label="Vắng không phép:" value={salary.absent_days}/>

                                <Info label="Phút đi trễ:" value={salary.total_late_minutes}/>
                                <Info label="Phút về sớm:" value={salary.total_early_minutes}/>

                                <Info label="Phút tăng ca:" value={salary.overtime_minutes}/>

                            </div>

                        </Section>

                    </div>


                    {/* RIGHT */}
                    <div>

                        <Section title="3. Chi tiết tính lương">

                            <SalaryRow
                                title="Lương cơ bản"
                                result={formatMoney(baseSalary)}
                            />

                            <SalaryRow
                                title="Lương 1 ngày"
                                result={formatMoney(dailySalary)}
                            />

                            <SalaryRow
                                title="Lương ngày"
                                formula={`${salary.total_working_days} ngày × ${formatMoney(dailySalary)}`}
                                result={formatMoney(salaryFromDays)}
                            />

                            <SalaryRow
                                title="Thưởng tăng ca"
                                formula={
                                    salary.overtime_minutes > 0
                                        ? `${salary.overtime_minutes} phút × ${formatMoney(otBonusPerMinute)}`
                                        : "-"
                                }
                                result={formatMoney(overtimeBonus)}
                            />

                            <SalaryRow
                                title="Khấu trừ đi trễ / về sớm"
                                formula={
                                    totalLateEarly > 0
                                        ? `${totalLateEarly} phút × ${formatMoney(minutePenalty)}`
                                        : "-"
                                }
                                result={`- ${formatMoney(deductions)}`}
                            />

                            <Divider/>

                            <div style={styles.totalRow}>
                                <span>Tổng lương</span>
                                <span>{formatMoney(totalSalary)}</span>
                            </div>

                            <div style={styles.totalRow}>
                                <span>Tổng khấu trừ</span>
                                <span>{formatMoney(deductions)}</span>
                            </div>

                        </Section>


                        {/* THỰC LÃNH */}
                        <div style={styles.finalBox}>

                            <div style={styles.finalLabel}>
                                Thực lãnh
                            </div>

                            <div style={styles.finalMoney}>
                                {formatMoney(netSalary)}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default SalaryModal;


/* ======================
   COMPONENT PHỤ
====================== */

const Info = ({ label, value }) => (
    <div>
        <div style={styles.label}>{label}</div>
        <div style={styles.value}>{value}</div>
    </div>
);

const Section = ({ title, children }) => (
    <div style={{marginTop: 16}}>
        <div style={styles.sectionTitle}>{title}</div>
        {children}
    </div>
);

const SalaryRow = ({ title, formula, result }) => (
    <div style={styles.salaryRow}>
        <span>{title}</span>
        <span>{formula}</span>
        <span style={styles.salaryResult}>{result}</span>
    </div>
);

const Divider = () => <hr style={styles.divider}/>;


/* ======================
   STYLE
====================== */

const styles = {

    header: {
        textAlign: "center",
        marginBottom: 18
    },

    title: {
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: 1,
        color: "#e2f0e7"
    },

    titleLine: {
        width: 120,
        height: 3,
        background: "#3b82f6",
        margin: "10px auto 0",
        borderRadius: 3
    },

    status: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: 600
    },

    layout: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 42,
        marginTop: 10
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 18
    },

    label: {
        fontSize: 16,
        color: "#94a3b8"
    },

    value: {
        fontSize: 15,
        fontWeight: 600,
        color: "#e2f0e7"
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 12,
        color: "#1cdb0b"
    },

    salaryRow: {
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 0.8fr",
        padding: "10px 0",
        fontSize: 14,
        alignItems: "center"
    },

    salaryResult: {
        textAlign: "right",
        fontWeight: 600
    },

    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 16,
        fontWeight: 700,
        marginTop: 6
    },

    finalBox: {
        marginTop: 28,
        padding: 24,
        borderRadius: 14,
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.3)",
        textAlign: "center"
    },

    finalLabel: {
        fontSize: 14,
        color: "#94a3b8",
        marginBottom: 6
    },

    finalMoney: {
        fontSize: 36,
        fontWeight: 800,
        color: "#22c55e"
    },

    divider: {
        border: "none",
        borderTop: "1px dashed #334155",
        margin: "18px 0"
    }
};