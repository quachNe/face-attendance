import React, { useState } from "react";
import { Styles, ButtonStyles } from "../style/Styles.js";
const LeaveRequest = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        leaveType: "Nghỉ phép năm",
        startDate: "",
        endDate: "",
        reason: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu gửi đi:", formData);
        alert("Đơn xin nghỉ phép của bạn đã được gửi thành công!");
        onCancel(); // Quay về màn hình chờ sau khi gửi
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Loại nghỉ phép</label>
                    <select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        style={styles.input}
                    >
                        <option>Nghỉ phép năm</option>
                        <option>Nghỉ ốm</option>
                        <option>Việc riêng không lương</option>
                        <option>Nghỉ chế độ</option>
                    </select>
                </div>

                <div style={styles.row}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Từ ngày</label>
                        <input
                        type="date"
                        name="startDate"
                        required
                        onChange={handleChange}
                        style={styles.input}
                        />
                    </div>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Đến ngày</label>
                        <input
                        type="date"
                        name="endDate"
                        required
                        onChange={handleChange}
                        style={styles.input}
                        />
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Lý do nghỉ phép</label>
                    <textarea
                        name="reason"
                        placeholder="Nhập lý do chi tiết..."
                        required
                        onChange={handleChange}
                        style={{ ...styles.input, height: "120px", resize: "none" }}
                    />
                </div>

                <div style={ButtonStyles.actions}>
                    <button type="button" onClick={onCancel} style={ButtonStyles.cancelBtn}>
                        Hủy bỏ
                    </button>
                    <button type="submit" style={ButtonStyles.saveBtn}>
                        Gửi đơn
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveRequest;

const styles = {
    container: { maxWidth: "100%" },
    contentTitle: {
        margin: 0,
        fontSize: "22px",
        fontWeight: "600",
        color: "#0f172a",
        borderBottom: "2px solid #e2e8f0",
        paddingBottom: "10px",
        marginBottom: "20px",
    },
    form: { display: "flex", flexDirection: "column", gap: "20px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    row: { display: "flex", gap: "20px" },
    label: { fontSize: "14px", fontWeight: "600", color: "#475569" },
    input: {
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        fontSize: "15px",
        background: "#f8fafc",
    },
};