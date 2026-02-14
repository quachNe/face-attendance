import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "/background.jpg";
import { useAuth } from "../../../context/AuthContext";
import { styleModel, stylesButton } from "../style/Styles";
import { Eye, EyeOff, User, Lock, LogIn, ArrowLeft } from "lucide-react";
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

    if (result.success) {
      setError("");
      navigate("/dashboard");
    } else {
      setError(result.message || "Đăng nhập thất bại");
    }
  };

  return (
  <div style={stylesLogin.wrapper}>
    <div
      style={{
        ...stylesLogin.background,
        backgroundImage: `url(${backgroundImg})`,
      }}
    />
      <div style={styleModel.modalOverlay}>
        <div style={{
          ...styleModel.modal,
          width: 450,
          padding: "40px 36px",
        }}>
          <div style={stylesLogin.logoBox}>
            <h2 style={stylesLogin.title}>NANO TECH</h2>
            <p style={stylesLogin.subtitle}>Attendance System</p>
          </div>

          <form onSubmit={handleLogin} style={stylesLogin.form}>
            <div style={stylesLogin.inputBox}>
              <span style={stylesLogin.icon}><User size={18} /></span>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={stylesLogin.input}
              />
            </div>

            <div style={stylesLogin.inputBox}>
              <span style={stylesLogin.icon}><Lock size={18} /></span>

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

            {error && (
              <p style={{ color: "red", fontSize: 14, marginTop: 6, fontWeight: "bold" }}>
                {error}
              </p>
            )}

            <button type="submit" style={{
              ...stylesButton.loginBtn,
              // width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <LogIn size={18} style={{ marginRight: 8 }} />
              Đăng nhập
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                ...stylesButton.backBtn,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
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
  background: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(2px) scale(1.05)",
  },

  logoBox: {
    marginBottom: 20,
    textAlign: "center",
  },

  title: {
    fontSize: 40,
    fontWeight: 800,
    letterSpacing: 4,
    background: "linear-gradient(135deg, #ffffff, #e5e7eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#67e8f9",
    letterSpacing: 1,
    marginTop: -10,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: "13px 16px",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s ease",
  },

  icon: {
    marginRight: 12,
    fontSize: 16,
    opacity: 0.6,
  },

  input: {
    border: "none",
    outline: "none",
    fontSize: 14,
    width: "100%",
    color: "#020617",
    background: "transparent",
  },

  eye: {
    marginLeft: 10,
    cursor: "pointer",
    fontSize: 16,
    opacity: 0.6,
    userSelect: "none",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};