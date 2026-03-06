import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "/background.jpg";
import { useAuth } from "../../../context/AuthContext";
import { Eye, EyeOff, User, Lock, LogIn, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      setError("Bạn không có quyền truy cập vào trang quản trị");
      return;
    }

    toast.success("Đăng nhập thành công");
    navigate("/admin/dashboard");
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.background,
          backgroundImage: `url(${backgroundImg})`,
        }}
      />

      <div style={styles.overlay} />

      <div style={styles.center}>
        <div style={styles.modal}>
          <h2 style={styles.title}>ĐĂNG NHẬP HỆ THỐNG</h2>

          <form onSubmit={handleLogin} style={styles.form}>
            
            {/* USERNAME */}
            <div style={styles.inputBox}>
              <User size={18} style={styles.icon} />

              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div style={styles.inputBox}>
                <Lock size={18} style={styles.icon} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />

                <span
                  style={styles.eye}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              {/* FORGOT PASSWORD */}
              <div style={styles.forgotBox}>
                <span
                  style={styles.forgot}
                  onClick={() => toast.info("Chức năng đang phát triển")}
                >
                  Quên mật khẩu?
                </span>
              </div>
            </div>

            {/* ERROR */}
            {error && <p style={styles.error}>{error}</p>}

            {/* BUTTONS */}
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate("/")}
                style={styles.backBtn}
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>

              <button type="submit" style={styles.loginBtn}>
                <LogIn size={18} />
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

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
    filter: "blur(10px) brightness(0.45) scale(1.1)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(0,0,0,0.35), rgba(0,0,0,0.85))",
  },

  center: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    width: 380,
    padding: "38px 34px",
    borderRadius: 20,
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(30px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 40px 120px rgba(0,0,0,0.9)",
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#f1f5f9",
    textAlign: "center",
    marginBottom: 28,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    background: "#ffffff",
    borderRadius: 12,
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
  },

  icon: {
    color: "#64748b",
    marginRight: 8,
  },

  input: {
    border: "none",
    outline: "none",
    fontSize: 14,
    width: "100%",
    color: "#0f172a",
    background: "transparent",
  },

  eye: {
    cursor: "pointer",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
  },

  forgotBox: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 6,
  },

  forgot: {
    fontSize: 12.5,
    color: "#38bdf8",
    cursor: "pointer",
    fontWeight: 500,
  },

  error: {
    color: "#ef4444",
    fontSize: 13,
    textAlign: "center",
    fontWeight: 600,
  },

  buttonGroup: {
    display: "flex",
    gap: 10,
    marginTop: 4,
  },

  loginBtn: {
    flex: 1,
    padding: "13px 0",
    borderRadius: 12,
    border: "none",
    fontWeight: 600,
    fontSize: 14,
    color: "#fff",
    background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  backBtn: {
    flex: 1,
    padding: "13px 0",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#e2e8f0",
    background: "transparent",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
};