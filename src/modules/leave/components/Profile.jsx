import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { updateProfile } from "../../../services/EmployeeService.js";
import { stylesError } from "../../admin/style/Styles.js";
export default function Profile() {
    const { user } = useAuth();
    const [error, setError] = useState("");

    /* ================= INITIAL DATA ================= */

    const initialProfile = {
        fullName: user?.name || "",
        dob: user?.dob || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role:
        user?.role === "admin"
            ? "Quản trị viên"
            : user?.role
            ? "Nhân viên"
            : "",
        username: user?.username || "",
    };

    const [profile, setProfile] = useState(initialProfile);

    const initialPassword = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const [password, setPassword] = useState(initialPassword);

    const [show, setShow] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    /* ================= HANDLERS ================= */

    const handleProfileChange = (e) => {
        setProfile((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handlePasswordChange = (e) => {
        setError("");   // thêm dòng này
        setPassword((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleUpdateProfile = () => {
        console.log("Update profile:", profile);
    };
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    // XỬ LÝ ĐỔI MẬT KHẨU
    const handleSubmit = async () => {
        setError(""); // reset lỗi trước

        if (!password.oldPassword || !password.newPassword || !password.confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (password.newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (password.oldPassword === password.newPassword) {
            setError("Mật khẩu mới phải khác mật khẩu hiện tại");
            return;
        }

        if (password.newPassword !== password.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            const payload = {
                oldPassword: password.oldPassword,
                password: password.newPassword,
            };

            const res = await updateProfile(payload);

            if (res.status === 200 || res.status === 204) {
                alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
                handleLogout();
                return;
            }

            setError(res.data?.message || "Đổi mật khẩu thất bại!");
        } catch (err) {
            if (err.response?.status === 400) {
                setError(err.response.data?.message || "Mật khẩu cũ không đúng");
                return;
            }

            console.error(err);
            setError("Lỗi kết nối server");
        }
    };


  const handleCancelProfile = () => {
    setProfile(initialProfile);
  };

  const handleCancelPassword = () => {
    setPassword(initialPassword);
    setShow({
      old: false,
      new: false,
      confirm: false,
    });
  };

  /* ================= STYLE ================= */

    const styles = {
        container: {
            display: "flex",
            gap: "50px",
            padding: "10px",
            minHeight: "70vh",
        },
        card: {
            flex: 1,
            background: "#fff",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
        },

        title: {
            fontSize: "22px",
            fontWeight: "700",
            marginBottom: "30px",
            color: "#1f2937",
            textAlign: "center",
        },

        formGroup: {
            display: "flex",
            flexDirection: "column",
            marginBottom: "18px",
            width: "100%",
        },

        label: {
            fontSize: "14px",
            marginBottom: "6px",
            color: "#6b7280",
        },

        input: {
            width: "100%",
            padding: "10px 10px 15px 10px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            fontSize: "14px",
            outline: "none",
        },

        disabledInput: {
            padding: "10px 12px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            fontSize: "14px",
            backgroundColor: "#f3f4f6",
            cursor: "not-allowed",
        },

        buttonGroup: {
            display: "flex",
            gap: "10px",
            marginTop: "15px",
        },

        primaryButton: {
            flex: 1,
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
        },

        cancelButton: {
            flex: 1,
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            background: "#fff",
            color: "#374151",
            fontWeight: "600",
            cursor: "pointer",
        },

        divider: {
            width: "1px",
            backgroundColor: "#e5e7eb",
        },

        inputWrapper: {
            position: "relative",
            width: "100%",
        },

        eyeIcon: {
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: "translateY(-50%)",   // CĂN GIỮA CHUẨN
            cursor: "pointer",
            color: "#6b7280",
        },
    };

  /* ================= JSX ================= */

    return (
        <div style={styles.container}>
            {/* LEFT */}
            <div style={styles.card}>
                <h2 style={styles.title}>THÔNG TIN CÁ NHÂN</h2>

                {["fullName", "dob", "email", "phone"].map((field) => (
                <div key={field} style={styles.formGroup}>
                    <label style={styles.label}>
                    {field === "fullName" && "Họ và tên"}
                    {field === "dob" && "Ngày sinh"}
                    {field === "email" && "Email"}
                    {field === "phone" && "Số điện thoại"}{" "}
                    <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                    style={styles.input}
                    type={field === "dob" ? "date" : field === "email" ? "email" : "text"}
                    name={field}
                    value={profile[field]}
                    onChange={handleProfileChange}
                    />
                </div>
                ))}

                <div style={styles.formGroup}>
                    <label style={styles.label}>Chức vụ</label>
                    <input style={styles.disabledInput} value={profile.role} disabled />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Tên đăng nhập</label>
                    <input style={styles.disabledInput} value={profile.username} disabled />
                </div>

                <div style={styles.buttonGroup}>
                    <button style={styles.cancelButton} onClick={handleCancelProfile}>
                        Huỷ
                    </button>
                    <button style={styles.primaryButton} onClick={handleUpdateProfile}>
                        Cập nhật
                    </button>
                </div>
            </div>

            <div style={styles.divider}></div>

            {/* RIGHT */}
            <div style={styles.card}>
                <h2 style={styles.title}>ĐỔI MẬT KHẨU</h2>

                {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
                    <div key={field} style={styles.formGroup}>
                        <label style={styles.label}>
                        {field === "oldPassword" && "Mật khẩu cũ"}
                        {field === "newPassword" && "Mật khẩu mới"}
                        {field === "confirmPassword" && "Xác nhận mật khẩu"}{" "}
                        <span style={{ color: "red" }}>*</span>
                        </label>

                        <div style={styles.inputWrapper}>
                            <input
                                style={{ ...styles.input, paddingRight: "40px" }}
                                type={show[field.split("Password")[0]] ? "text" : "password"}
                                name={field}
                                value={password[field]}
                                onChange={handlePasswordChange}
                            />
                            <span
                                style={styles.eyeIcon}
                                onClick={() =>
                                setShow((prev) => ({
                                    ...prev,
                                    [field.split("Password")[0]]: !prev[field.split("Password")[0]],
                                }))
                                }
                            >
                                {show[field.split("Password")[0]] ? (
                                <EyeOff size={18} />
                                ) : (
                                <Eye size={18} />
                                )}
                            </span>
                        </div>
                    </div>
                ))}
                {error && <p style={stylesError.message}>{error}</p>}
                <div style={styles.buttonGroup}>
                    <button style={styles.cancelButton} onClick={handleCancelPassword}>
                        Huỷ
                    </button>
                    <button style={styles.primaryButton} onClick={handleSubmit}>
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
}