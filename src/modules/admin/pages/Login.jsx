import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "/background.jpg";
import { useAuth } from "../../../context/AuthContext";
import { stylesButton } from "../style/Styles";
import { Eye, EyeOff, User, Lock, LogIn, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // HANDLE LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userName || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const result = await login(userName, password);
    
    if (!result.success) {
      setError(result.message || "Đăng nhập thất bại");
      return;
    }
    
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (loggedUser.role !== "admin") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setError("Bạn không có quyền truy cập vào trang dành cho quản trị viên");
      return;
    }
    toast.success("Đăng nhập thành công");
    navigate("/admin/dashboard");
  };

  return (
    <div style={stylesLogin.wrapper}>
      {/* BACKGROUND */}
      <div
        style={{
          ...stylesLogin.background,
          backgroundImage: `url(${backgroundImg})`,
        }}
      />

      {/* DARK OVERLAY */}
      <div style={stylesLogin.overlay} />

      {/* CENTER CONTAINER */}
      <div style={stylesLogin.modalContainer}>
        <div style={stylesLogin.modal}>
          {/* TITLE */}
          <div style={stylesLogin.logoBox}>
            <h2 style={stylesLogin.title}>ĐĂNG NHẬP</h2>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} style={stylesLogin.form}>
            {/* USERNAME */}
            <div style={stylesLogin.inputBox}>
              <span style={stylesLogin.icon}>
                <User size={18} />
              </span>

              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={stylesLogin.input}
              />
            </div>

            {/* PASSWORD */}
            <div style={stylesLogin.inputBox}>
              <span style={stylesLogin.icon}>
                <Lock size={18} />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={stylesLogin.input}
              />

              <span
                style={stylesLogin.eye}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* ERROR */}
            {error && <p style={stylesLogin.error}>{error}</p>}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              style={{
                ...stylesButton.loginBtn,
                ...stylesLogin.loginBtn,
              }}
            >
              <LogIn size={18} />
              Đăng nhập
            </button>

            {/* BACK BUTTON */}
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                ...stylesButton.backBtn,
                ...stylesLogin.backBtn,
              }}
            >
              <ArrowLeft size={18} />
              Quay lại trang điểm danh
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

const stylesLogin = {
  wrapper: {
    height: "100vh",
    width: "100%",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Segoe UI, sans-serif",
  },

  background: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(6px) brightness(0.5) scale(1.1)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(0,0,0,0.25), rgba(0,0,0,0.8))",
  },

  modalContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    width: 450,
    padding: "42px 38px",
    borderRadius: 26,
    background: "rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 60px 140px rgba(0,0,0,0.85)",
  },

  logoBox: {
    marginBottom: 30,
    textAlign: "center",
  },

  title: {
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: 6,
    background: "linear-gradient(135deg, #ffffff, #cbd5f5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 8px 25px rgba(0,0,0,0.6)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.96)",
    borderRadius: 18,
    padding: "15px 18px",
    border: "1px solid rgba(255,255,255,0.4)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
  },

  icon: {
    marginRight: 12,
    opacity: 0.7,
    color: "#475569",
    display: "flex",
    alignItems: "center",
  },

  input: {
    border: "none",
    outline: "none",
    fontSize: 15,
    width: "100%",
    color: "#020617",
    background: "transparent",
    fontWeight: 500,
  },

  eye: {
    marginLeft: 10,
    cursor: "pointer",
    opacity: 0.7,
    color: "#475569",
    display: "flex",
    alignItems: "center",
  },

  error: {
    color: "#f87171",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  loginBtn: {
    padding: "15px 0",
    borderRadius: 16,
    border: "none",
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: 1,
    color: "#fff",
    background: "linear-gradient(135deg, #22d3ee, #38bdf8)",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(34,211,238,0.4)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  backBtn: {
    padding: "13px 0",
    borderRadius: 14,
    fontWeight: 600,
    fontSize: 14,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
};