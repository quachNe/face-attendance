import React, { useEffect, useState } from "react";
import { Save, X, User, Mail, Phone, Briefcase, Calendar, } from "lucide-react";

const UserProfile = ({ onClose, user }) => {
  const fetchUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      setForm({
        name: data.name || "",
        dob: data.dob || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        role: data.role?.toUpperCase() || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const [form, setForm] = useState({
    name: user?.name || "",
    dob: user?.dob || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    role: user.role?.toUpperCase() || "",
  });

  const handleChange = (key, value) =>
    setForm({ ...form, [key]: value });

  const handleSubmit = async() => {
    if (!form.name || !form.email || !form.phone || !form.dob) {
      alert("Không được để trống thông tin");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      alert("Cập nhật thông tin thành công");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Title */}
        <div style={styles.title}>
          THÔNG TIN NGƯỜI DÙNG
        </div>

        {/* Body */}
        <div style={styles.body}>
          {[
            ["name", "Họ và tên", <User size={18} />],
            ["dob", "Ngày sinh", <Calendar size={18} />],
            ["email", "Email", <Mail size={18} />],
            ["phone", "Số điện thoại", <Phone size={18} />],
            ["role", "Chức vụ", <Briefcase size={18} />],
          ].map(([key, label, icon]) => (
            <div style={styles.field} key={key}>
              <label style={styles.label}>{label}</label>
              <div style={styles.inputBox}>
                <span style={styles.icon}>{icon}</span>

                <input
                  type={key === "dob" ? "date" : "text"}
                  disabled={key === "role"}   
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{
                    ...styles.input,
                    color: "#e5e7eb",
                  }}
                />
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

export default UserProfile;
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
    width: 460,
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
  },

  body: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
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

  icon: {
    color: "#94a3b8",
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e5e7eb",
    fontSize: 14,
  },

  actions: {
    display: "flex",
    gap: 12,
    marginTop: 18,
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