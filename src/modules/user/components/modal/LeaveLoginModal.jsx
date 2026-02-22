import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { stylesError } from "../../../admin/style/Styles.js";
import { User, Lock, X, Eye, EyeOff } from "lucide-react";

export default function LeaveLoginModal({ onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const result = await login(username, password);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || "Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        {/* Close button */}
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={styles.title}>ĐĂNG NHẬP HỆ THỐNG</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <User size={18} />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {error && <p style={{...stylesError.message, marginBottom:"-5px", marginTop:"-5px"}}>{error}</p>}
          <button type="submit" style={styles.button}>
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    width: "380px",
    background: "#fff",
    padding: "35px",
    borderRadius: "14px",
    position: "relative",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },

  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#1e3a8a",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
  },

  input: {
    border: "none",
    outline: "none",
    flex: 1,
  },

  button: {
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  eyeIcon: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

};