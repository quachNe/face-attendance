import React, { useState } from "react";
import { Styles } from "../style/Styles.js";
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
                    <label style={Styles.label}>Loại nghỉ phép <span style={Styles.required}>*</span></label>
                    <select
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        style={Styles.input}
                    >
                        <option>Nghỉ phép năm</option>
                        <option>Nghỉ ốm</option>
                        <option>Việc riêng không lương</option>
                        <option>Nghỉ chế độ</option>
                    </select>
                </div>

                <div style={styles.row}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={Styles.label}>Từ ngày <span style={Styles.required}>*</span></label>
                        <input
                        type="date"
                        name="startDate"
                        required
                        onChange={handleChange}
                        style={Styles.input}
                        />
                    </div>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={Styles.label}>Đến ngày <span style={Styles.required}>*</span></label>
                        <input
                        type="date"
                        name="endDate"
                        required
                        onChange={handleChange}
                        style={Styles.input}
                        />
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={Styles.label}>Lý do nghỉ phép <span style={Styles.required}>*</span></label>
                    <textarea
                        name="reason"
                        placeholder="Nhập lý do chi tiết..."
                        required
                        onChange={handleChange}
                        style={{ ...Styles.input, height: "120px", resize: "none" }}
                    />
                </div>

                <div style={Styles.actions}>
                    <button type="button" onClick={onCancel} style={Styles.cancelBtn}>
                        Hủy bỏ
                    </button>
                    <button type="submit" style={Styles.saveBtn}>
                        Gửi đơn
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveRequest;

const styles = {
    // container: { maxWidth: "100%" },
    form: { display: "flex", flexDirection: "column", gap: "30px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "15px" },
    row: { display: "flex", gap: "20px" },
};