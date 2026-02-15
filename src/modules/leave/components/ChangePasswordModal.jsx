import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Eye, EyeOff, X } from "lucide-react";
import { updateProfile } from "../../../services/EmployeeService.js";
import { stylesButton, stylesError } from "../../admin/style/Styles.js";
import { Styles, ButtonStyles } from "../style/Styles.js";

export default function ChangePasswordModal({ onClose }) {
    const { logout } = useAuth();

    const [error, setError] = useState("");
    const [animate, setAnimate] = useState(false);
    const [shake, setShake] = useState(false);

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

    /* ================= ESC CLOSE ================= */
    useEffect(() => {
        setTimeout(() => setAnimate(true), 10);

        const handleEsc = (e) => {
        if (e.key === "Escape") handleClose();
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    const handleClose = () => {
        setAnimate(false);
        setTimeout(() => {
        setPassword({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setError("");
        onClose();
        }, 200);
    };

    /* ================= SHAKE ================= */
    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 400);
    };

    /* ================= HANDLE CHANGE ================= */
    const handleChange = (e) => {
        setError("");
        setPassword((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    /* ================= PASSWORD STRENGTH ================= */
    const getStrength = () => {
        const pass = password.newPassword;
        let score = 0;
        if (pass.length >= 6) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const strength = getStrength();

    const strengthText = ["Rất yếu", "Yếu", "Trung bình", "Mạnh"][strength - 1] || "";

    const strengthColor = [
        "#e11d48",
        "#f97316",
        "#eab308",
        "#22c55e",
    ][strength - 1] || "#e5e7eb";

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
        if (!password.oldPassword || !password.newPassword || !password.confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin");
            triggerShake();
        return;
        }

        if (password.newPassword.length < 6) {
            setError("Mật khẩu mới phải ít nhất 6 ký tự");
            triggerShake();
        return;
        }

        if (password.newPassword !== password.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            triggerShake();
        return;
        }

        try {
        const res = await updateProfile({
            oldPassword: password.oldPassword,
            password: password.newPassword,
        });

        if (res.status === 200 || res.status === 204) {
            alert("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
            logout();
            window.location.reload();
        }
        } catch (err) {
            setError(err.response?.data?.message || "Mật khẩu cũ không đúng");
            triggerShake();
        }
    };

    return (
        <div style={Styles.overlay} onClick={handleClose}>
            <div
                style={{
                ...modal.content,
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(-20px)",
                animation: shake ? "shake 0.4s" : "",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* CLOSE BUTTON */}
                <div style={ButtonStyles.closeBtn} onClick={handleClose}>
                    <X size={18} />
                </div>

                <h2 style={modal.title}>Đổi mật khẩu</h2>

                {/* OLD PASSWORD */}
                <div style={modal.field}>
                    <label style={modal.label}>Mật khẩu cũ</label>
                    <div style={modal.inputWrapper}>
                        <input
                            type={show.old ? "text" : "password"}
                            name="oldPassword"
                            value={password.oldPassword}
                            onChange={handleChange}
                            style={modal.input}
                        />
                        <span
                            style={modal.icon}
                            onClick={() => setShow((prev) => ({ ...prev, old: !prev.old }))}
                        >
                            {show.old ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                    </div>
                </div>

                {/* NEW PASSWORD */}
                <div style={modal.field}>
                    <label style={modal.label}>Mật khẩu mới</label>
                    <div style={modal.inputWrapper}>
                        <input
                            type={show.new ? "text" : "password"}
                            name="newPassword"
                            value={password.newPassword}
                            onChange={handleChange}
                            style={modal.input}
                        />
                        <span
                            style={modal.icon}
                            onClick={() => setShow((prev) => ({ ...prev, new: !prev.new }))}
                        >
                            {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                    </div>
                </div>

                {/* STRENGTH */}
                {password.newPassword && (
                <>
                    <div style={modal.strengthWrapper}>
                    <div
                        style={{
                        ...modal.strengthBar,
                        width: `${strength * 25}%`,
                        background: strengthColor,
                        }}
                    />
                    </div>
                    <span style={{ fontSize: "12px", color: strengthColor }}>
                        Độ mạnh: {strengthText}
                    </span>
                </>
                )}

                {/* CONFIRM PASSWORD */}
                <div style={modal.field}>
                <label style={modal.label}>Xác nhận mật khẩu</label>
                    <div style={modal.inputWrapper}>
                        <input
                            type={show.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={password.confirmPassword}
                            onChange={handleChange}
                            style={modal.input}
                        />
                        <span
                            style={modal.icon}
                            onClick={() =>
                                setShow((prev) => ({ ...prev, confirm: !prev.confirm }))
                            }
                        >
                            {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                    </div>
                </div>

                {error && <p style={stylesError.message}>{error}</p>}

                <div style={ButtonStyles.actions}>
                    <button onClick={handleClose} style={ButtonStyles.cancelBtn}>
                        Huỷ
                    </button>
                    <button onClick={handleSubmit} style={ButtonStyles.saveBtn}>
                        Lưu thay đổi
                    </button>
                </div>
            </div>

            <style>
                {`
                @keyframes shake {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(-6px); }
                    50% { transform: translateX(6px); }
                    75% { transform: translateX(-6px); }
                    100% { transform: translateX(0); }
                }
                `}
            </style>
        </div>
    );
}

/* ================= STYLE ================= */

const modal = {
    content: {
        position: "relative",
        background: "#fff",
        padding: "35px 30px",
        borderRadius: "18px",
        width: "420px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        transition: "all 0.2s ease",
    },

    title: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "600",
        textAlign: "center",
        color: "#0f172a",
    },

    field: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    label: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#334155",
    },

    inputWrapper: {
        position: "relative",
    },

    input: {
        width: "100%",
        padding: "12px 40px 12px 14px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        fontSize: "14px",
        outline: "none",
    },

    icon: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#64748b",
    },

    strengthWrapper: {
        height: "6px",
        width: "100%",
        background: "#e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
    },

    strengthBar: {
        height: "100%",
        transition: "0.3s",
    },
};
