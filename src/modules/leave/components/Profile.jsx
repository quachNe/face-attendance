import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { updateProfile } from "../../../services/EmployeeService.js";
import { stylesError } from "../../admin/style/Styles.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [error, setError] = useState("");

  const initialProfile = {
    name: user?.name || "",
    dob: user?.dob || "",
    email: user?.email || "",
    phone: user?.phone || "",
    username: user?.username || "",
    role:
      user?.role === "admin"
        ? "Quản trị viên"
        : user?.role
        ? "Nhân viên"
        : "",
  };

  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    setProfile(initialProfile);
  }, [user]);

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
    setError("");
    setPassword((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= UPDATE PROFILE ================= */

  const handleUpdateProfile = async () => {
    setError("");

    if (!profile.name || !profile.dob || !profile.email || !profile.phone) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const payload = {
        name: profile.name,
        dob: profile.dob,
        email: profile.email,
        phone: profile.phone,
      };

      const res = await updateProfile(payload);

      if (res.status === 200 || res.status === 204) {
        const updatedUser = { ...user, ...payload };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert("Cập nhật thông tin thành công");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi kết nối server");
    }
  };

  /* ================= UPDATE PASSWORD ================= */

  const handleSubmit = async () => {
    setError("");

    if (!password.oldPassword || !password.newPassword || !password.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
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
        localStorage.clear();
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Mật khẩu cũ không đúng");
    }
  };

  /* ================= STYLE ================= */

  const styles = {
    wrapper: {
      width: "100%",
      padding: "20px",
      boxSizing: "border-box",
    },

    container: {
      display: "flex",
      flexWrap: "wrap",
      gap: "30px",
      alignItems: "flex-start",
    },

    card: {
      flex: "1 1 480px",
      background: "#fff",
      padding: "30px",
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
    },

    title: {
      fontSize: "25px",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "center",
    },

    row: {
      display: "flex",
      gap: "15px",
      flexWrap: "wrap",
      marginBottom: "15px",
    },

    half: {
      flex: "1 1 48%",
    },

    formGroup: {
      marginBottom: "15px",
    },

    label: {
      fontSize: "13px",
      color: "#6b7280",
      marginBottom: "5px",
      display: "block",
    },

    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      fontSize: "14px",
    },

    disabledInput: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      backgroundColor: "#f3f4f6",
      fontSize: "14px",
      cursor: "not-allowed",
    },

    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "10px",
    },

    primaryButton: {
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
    },

    cancelButton: {
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      background: "#fff",
      cursor: "pointer",
      fontWeight: "600",
    },

    inputWrapper: {
      position: "relative",
    },

    eyeIcon: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
    },
  };

  /* ================= JSX ================= */

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                {/* LEFT CARD */}
                <div style={styles.card}>
                    <h2 style={styles.title}>Thông tin cá nhân</h2>

                    {/* Full Name */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Họ và tên <span style={{ color: "red" }}> *</span></label>
                        <input
                        style={styles.input}
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        />
                    </div>

                    {/* DOB + PHONE */}
                    <div style={styles.row}>
                        <div style={styles.half}>
                        <label style={styles.label}>Ngày sinh <span style={{ color: "red" }}> *</span></label>
                        <input
                            style={styles.input}
                            type="date"
                            name="dob"
                            value={profile.dob}
                            onChange={handleProfileChange}
                        />
                        </div>

                        <div style={styles.half}>
                        <label style={styles.label}>Số điện thoại <span style={{ color: "red" }}> *</span></label>
                        <input
                            style={styles.input}
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                        />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email <span style={{ color: "red" }}> *</span></label>
                        <input
                        style={styles.input}
                        type="text"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        />
                    </div>

                    {/* Username + Role */}
                    <div style={styles.row}>
                        <div style={styles.half}>
                        <label style={styles.label}>Tên đăng nhập</label>
                        <input style={styles.disabledInput} value={profile.username} disabled />
                        </div>

                        <div style={styles.half}>
                        <label style={styles.label}>Chức vụ</label>
                        <input style={styles.disabledInput} value={profile.role} disabled />
                        </div>
                    </div>
                    {error && <p style={stylesError.message}>{error}</p>}
                    <div style={styles.buttonGroup}>
                        <button style={styles.cancelButton}>Huỷ</button>
                        <button style={styles.primaryButton} onClick={handleUpdateProfile}>
                        Cập nhật
                        </button>
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div style={styles.card}>
                    <h2 style={styles.title}>Đổi mật khẩu</h2>

                    {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
                        <div key={field} style={styles.formGroup}>
                        <label style={styles.label}>
                            {field === "oldPassword" && "Mật khẩu cũ"}
                            {field === "newPassword" && "Mật khẩu mới"}
                            {field === "confirmPassword" && "Xác nhận mật khẩu"} <span style={{ color: "red" }}> *</span>
                        </label>

                        <div style={styles.inputWrapper}>
                            <input
                            style={{ ...styles.input, paddingRight: "35px" }}
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
                                [field.split("Password")[0]]:
                                    !prev[field.split("Password")[0]],
                                }))
                            }
                            >
                            {show[field.split("Password")[0]] ? (
                                <EyeOff size={16} />
                            ) : (
                                <Eye size={16} />
                            )}
                            </span>
                        </div>
                        </div>
                    ))}

                    <div style={styles.buttonGroup}>
                        <button style={styles.cancelButton}>Huỷ</button>
                        <button style={styles.primaryButton} onClick={handleSubmit}>
                        Cập nhật
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}