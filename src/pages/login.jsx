import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/background.jpg";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ STATE
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ HANDLE LOGIN
  const handleLogin = async (e) => {
    e.preventDefault(); // ⭐ rất quan trọng

    if (!userName || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const result = await login(userName, password);

    if (result.success) {
      setError("");
      navigate("/dashboard");
    } else {
      setError(result.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* BACKGROUND */}
      <div
        style={{
          ...styles.background,
          backgroundImage: `url(${backgroundImg})`,
        }}
      />

      {/* OVERLAY */}
      <div style={styles.overlay} />

      {/* LOGIN CARD */}
      <div style={styles.card}>
        <div style={styles.logoBox}>
          <h2 style={styles.title}>NANO TECH</h2>
          <p style={styles.subtitle}>Attendance System</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputBox}>
            <span style={styles.icon}>👤</span>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputBox}>
            <span style={styles.icon}>🔒</span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            {/* EYE ICON */}
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <p style={{ color: "red", fontSize: 13, marginTop: 6 }}>
              {error}
            </p>
          )}

          <button type="submit" style={styles.loginBtn}>
            Đăng Nhập
          </button>

          <button
            type="button"
            onClick={() => navigate("/scan")}
            style={styles.backBtn}
          >
            ← Quay lại trang điểm danh
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "100vh",
    width: "100%",
    position: "relative",
    fontFamily: "Segoe UI, system-ui, sans-serif",
  },

  background: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(120deg, rgba(2,6,23,0.85), rgba(2,6,23,0.65))",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: 380,
    padding: "40px 34px",
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.92)",
    borderRadius: 22,
    boxShadow: "0 40px 90px rgba(0,0,0,0.45)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
  },

  logoBox: {
    marginBottom: 28,
  },

  title: {
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: 2,
    color: "#020617",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: "#475569",
    letterSpacing: 0.6,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "#ffffff",
    borderRadius: 14,
    padding: "12px 14px",
    border: "1px solid #e5e7eb",
  },

  icon: {
    marginRight: 10,
    fontSize: 16,
    opacity: 0.6,
  },

  input: {
    border: "none",
    outline: "none",
    fontSize: 14,
    width: "100%",
    color: "#020617",
  },

  loginBtn: {
    marginTop: 10,
    padding: "13px",
    borderRadius: 30,
    border: "none",
    background:
      "linear-gradient(135deg, #0ca1a1 0%, #22d3ee 100%)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(12,161,161,0.45)",
  },

  backBtn: {
    marginTop: 6,
    background: "transparent",
    border: "none",
    color: "#475569",
    fontSize: 14,
    cursor: "pointer",
    opacity: 0.85,
  },
  eye: {
    marginLeft: 8,
    cursor: "pointer",
    fontSize: 16,
    opacity: 0.6,
    userSelect: "none",
  },
};

export default Login;