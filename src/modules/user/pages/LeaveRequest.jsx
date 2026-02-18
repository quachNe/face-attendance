import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Styles } from "../style/Styles.js";
import { createLeave } from "../../../services/LeaveService.js";

const LeaveRequest = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        leaveType: "annual_leave",
        startDate: "",
        endDate: "",
        reason: "",
    });

    const today = new Date().toISOString().split("T")[0];
    const { leaveType, startDate, endDate, reason } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(""); // clear error khi nhập lại
    };

    const resetForm = () => {
        setFormData({
            leaveType: "annual_leave",
            startDate: "",
            endDate: "",
            reason: "",
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startDate || !endDate || !reason) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            setError("Ngày bắt đầu phải trước ngày kết thúc");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                leave_type: leaveType,
                start_date: startDate,
                end_date: endDate,
                reason: reason,
            };

            const { data } = await createLeave(payload);

            if (data.success) {
                toast.success("Đã gửi đơn nghỉ phép");
                resetForm();
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gửi đơn thất bại"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                
                <div style={styles.formGroup}>
                    <label style={Styles.label}>
                        Loại nghỉ phép <span style={Styles.required}>*</span>
                    </label>
                    <select
                        name="leaveType"
                        value={leaveType}
                        onChange={handleChange}
                        style={Styles.input}
                    >
                        <option value="annual_leave">Nghỉ phép năm</option>
                        <option value="sick_leave">Nghỉ ốm</option>
                        <option value="personal_leave">Việc riêng</option>
                    </select>
                </div>

                <div style={styles.row}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={Styles.label}>
                            Từ ngày <span style={Styles.required}>*</span>
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={startDate}
                            onChange={handleChange}
                            style={Styles.input}
                            min={today}
                        />
                    </div>

                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={Styles.label}>
                            Đến ngày <span style={Styles.required}>*</span>
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={endDate}
                            onChange={handleChange}
                            style={Styles.input}
                            min={startDate || today}
                        />
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={Styles.label}>
                        Lý do nghỉ phép <span style={Styles.required}>*</span>
                    </label>
                    <textarea
                        name="reason"
                        placeholder="Nhập lý do chi tiết..."
                        value={reason}
                        onChange={handleChange}
                        style={{ ...Styles.input, height: "120px", resize: "none" }}
                    />
                </div>

                {error && <span style={Styles.message}>{error}</span>}

                <div style={Styles.actions}>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={Styles.cancelBtn}
                        disabled={loading}
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="submit"
                        style={Styles.saveBtn}
                        disabled={loading}
                    >
                        {loading ? "Đang gửi..." : "Gửi đơn"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveRequest;

const styles = {
    container: {},
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "30px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    row: {
        display: "flex",
        gap: "20px",
    },
};