import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "/background.jpg";
import { useAuth } from "../context/AuthContext";
import { stylesButton, stylesLogin } from "../components/Styles";
import { Eye, EyeOff, User, Lock } from "lucide-react";
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
      {/* BACKGROUND */}
      <div
        style={{
          ...stylesLogin.background,
          backgroundImage: `url(${backgroundImg})`,
        }}
      />

      {/* OVERLAY */}
      <div style={stylesLogin.overlay} />

      {/* LOGIN CARD */}
      <div style={stylesLogin.card}>
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

            {/* EYE ICON */}
            <span
              style={stylesLogin.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <p style={{ color: "red", fontSize: 14, marginTop: 6, fontWeight: "bold" }}>
              {error}
            </p>
          )}

          <button type="submit" style={stylesButton.loginBtn}>
            Đăng Nhập
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={stylesButton.backBtn}
          >
            ← Quay lại trang điểm danh
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;