import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/background.jpg";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard"); // demo
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
        <h2 style={styles.title}>Đăng Nhập</h2>
        <p style={styles.subtitle}>{/* Face Attendance System */}</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputBox}>
            <span style={styles.icon}>👤</span>
            <input
              type="text"
              placeholder="Username"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputBox}>
            <span style={styles.icon}>🔒</span>
            <input
              type="password"
              placeholder="Password"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.loginBtn}>
            Đăng Nhập
          </button>

          <button
            type="button"
            onClick={() => navigate("/scan")}
            style={styles.backBtn}
          >
            ← Quay lại trang Scan
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
    fontFamily: "Segoe UI, sans-serif",
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
      "linear-gradient(120deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: 360,
    padding: "36px 32px",
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    boxShadow: "0 30px 70px rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 28,
    letterSpacing: 0.5,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: 14,
    padding: "10px 14px",
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
  },

  loginBtn: {
    marginTop: 8,
    padding: "12px",
    borderRadius: 30,
    border: "none",
    background:
      "linear-gradient(135deg, #2563eb, #06b6d4)",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(37,99,235,0.4)",
  },

  backBtn: {
    marginTop: 4,
    background: "transparent",
    border: "none",
    color: "#374151",
    fontSize: 14,
    cursor: "pointer",
    opacity: 0.8,
  },
};

export default Login;
