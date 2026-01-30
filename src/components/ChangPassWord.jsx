import React, { useState } from "react";
import { Eye, EyeOff, Save, X} from "lucide-react";

const ChangePassword = ({ onClose }) => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (key, value) =>
    setForm({ ...form, [key]: value });

  const handleSubmit = () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    // TODO: call API
    alert("Đổi mật khẩu thành công!");
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Title center */}
        <div style={styles.title}>
          ĐỔI MẬT KHẨU
        </div>

        {/* Body */}
        <div style={styles.body}>
          {[
            ["oldPassword", "Mật khẩu hiện tại", "old"],
            ["newPassword", "Mật khẩu mới", "new"],
            ["confirmPassword", "Xác nhận mật khẩu mới", "confirm"],
          ].map(([key, label, type]) => (
            <div style={styles.field} key={key}>
              <label style={styles.label}>{label}</label>
              <div style={styles.inputBox}>
                <input
                  type={show[type] ? "text" : "password"}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={styles.input}
                />
                <span
                  style={styles.eye}
                  onClick={() =>
                    setShow({ ...show, [type]: !show[type] })
                  }
                >
                  {show[type] ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
          ))}

          {/* Actions */}
          <div style={styles.actions}>
            <button style={styles.btnCancel} onClick={onClose}>
              <X size={18} /> Hủy
            </button>

            <button style={styles.btnSave} onClick={handleSubmit}>
              <Save size={18} /> Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

/* ================= STYLES ================= */

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.7)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  modal: {
    width: 420,
    padding: 26,
    borderRadius: 20,
    background: "rgba(2,6,23,0.9)",
    border: "1px solid rgba(148,163,184,0.15)",
    boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
  },

  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 26,
    color: "#ffffff",
    letterSpacing: 0.5,
    },

  body: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    fontSize: 13,
    color: "#94a3b8",
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(15,23,42,0.85)",
    border: "1px solid #334155",
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e5e7eb",
    fontSize: 14,
  },

  eye: {
    cursor: "pointer",
    color: "#94a3b8",
  },

  actions: {
    display: "flex",
    gap: 12,
    marginTop: 12,
  },

  btnCancel: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    border: "1px solid #334155",
    background: "#dc2626",
    color: "#e5e7eb",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  btnSave: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    border: "none",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    color: "white",
    background: "linear-gradient(135deg,#22d3ee,#06b6d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 12px 30px rgba(34,211,238,0.5)",
  },
};
