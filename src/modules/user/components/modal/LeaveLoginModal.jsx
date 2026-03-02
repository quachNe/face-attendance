import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { stylesError } from "../../../admin/style/Styles.js";
import { User, Lock, X, Eye, EyeOff } from "lucide-react";
import { changePassword } from "../../../../services/EmployeeService.js";
import { toast } from "react-toastify";
export default function LeaveLoginModal({ onClose, onForgot }) {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [forceChangePassword, setForceChangePassword] = useState(false);

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const result = await login(username, password);

      if (!result.success) {
        setError(result.message || "Tên đăng nhập hoặc mật khẩu không đúng");
        return;
      }

      // ÉP ĐỔI MẬT KHẨU
      if (result.user.must_change_password) {
        setForceChangePassword(true);
        return;
      }

      // Login bình thường
      onClose();

    } catch (err) {
      setError("Lỗi kết nối server");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu mới!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    try {
      // const response = await fetch("http://localhost:5000/api/change-password", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      //   body: JSON.stringify({ new_password: newPassword }),
      // });

      // 🔥 Đọc text trước
      // const text = await response.text();

      // Nếu rỗng → tránh crash
      // const data = text ? JSON.parse(text) : {};
      const {data} = await changePassword({ new_password: newPassword });
      if (!data.success) {
        setError(data.message || "Có lỗi xảy ra");
        return;
      }

      toast.success("Đổi mật khẩu thành công!");

      onClose();

    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {!forceChangePassword && (
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        )}

        <h2 style={styles.title}>
          {forceChangePassword ? "ĐỔI MẬT KHẨU MỚI" : "ĐĂNG NHẬP HỆ THỐNG"}
        </h2>

        {!forceChangePassword ? (
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

            {error && (
              <p style={{ ...stylesError.message, marginBottom: "-5px", marginTop: "-5px" }}>
                {error}
              </p>
            )}

            <p style={styles.forgot} onClick={onForgot}>
              Quên mật khẩu?
            </p>

            <button type="submit" style={styles.button}>
              Đăng nhập
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} style={styles.form}>
            <div style={styles.inputGroup}>
              <Lock size={18} />
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <Lock size={18} />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            {error && (
              <p style={{ ...stylesError.message }}>
                {error}
              </p>
            )}

            <button type="submit" style={styles.button}>
              Đổi mật khẩu
            </button>
          </form>
        )}
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
  forgot: {
    textAlign: "right",
    fontSize: "14px",
    color: "#2563eb",
    cursor: "pointer",
    marginBottom: "-10px",
  },
};