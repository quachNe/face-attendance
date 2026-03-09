import React, { useState } from "react";
import { X, User, Mail} from "lucide-react";
import { stylesError } from "../../../admin/style/Styles.js";
import { toast } from "react-toastify";
import { requestPasswordReset } from "../../../../services/EmployeeService.js";
export default function ForgotPasswordModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username.trim() || !email.trim()) {
      setMessage("Vui lòng nhập đầy đủ tên đăng nhập và email!");
      return;
    }

    try {
      const {data} = await requestPasswordReset({ username, email });
      if (data.success) {
        toast.success("Yêu cầu cấp lại mật khẩu đã được gửi!");
        onClose();
      }
    }catch (err) {
      if (err.response?.status === 404) {
        toast.error("Tên đăng nhập hoặc email không đúng");
      }

      else if (err.response?.status === 400) {
        toast.error(err.response.data.message);
      }

      else {
        toast.error("Lỗi kết nối server");
      }

    }
  };
  return (
    <div style={styles.overlay}>
        <div style={styles.modal}>
            <button style={styles.closeBtn} onClick={onClose}>
                <X size={18} />
            </button>

            <h2 style={styles.title}>QUÊN MẬT KHẨU</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
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
                    <Mail size={18} />
                    <input
                        type="email"
                        placeholder="Email đã đăng ký"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                </div>
                {message && (
                    <p style={stylesError.message}>
                    {message}
                    </p>
                )}

                <button type="submit" style={styles.button}>
                    Gửi yêu cầu
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
    zIndex: 1000,
  },

  modal: {
    width: "360px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    position: "relative",
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
    marginBottom: "20px",
    color: "#1e3a8a",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
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
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};