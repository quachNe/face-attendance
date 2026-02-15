import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { updateProfile } from "../../../services/EmployeeService.js";
import { stylesError } from "../../admin/style/Styles.js";
import { Styles, ButtonStyles } from "../style/Styles.js";
import { X } from "lucide-react";

export default function ProfileModal({ onClose }) {
  const { user, setUser } = useAuth();
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);
  const [shake, setShake] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    username: "",
    role: "",
  });

  /* ================= INIT DATA ================= */
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        dob: user.dob || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.username || "",
        role:
          user.role === "admin"
            ? "Quản trị viên"
            : user.role
            ? "Nhân viên"
            : "",
      });
    }

    setTimeout(() => setAnimate(true), 10);

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [user]);

  /* ================= CLOSE ================= */
  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setError("");
      onClose();
    }, 200);
  };

  /* ================= SHAKE ================= */
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setError("");
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= VALIDATE ================= */
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone) =>
    /^[0-9]{9,11}$/.test(phone);

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    setError("");

    if (!profile.name || !profile.dob || !profile.email || !profile.phone) {
      setError("Vui lòng nhập đầy đủ thông tin");
      triggerShake();
      return;
    }

    if (!isValidEmail(profile.email)) {
      setError("Email không hợp lệ");
      triggerShake();
      return;
    }

    if (!isValidPhone(profile.phone)) {
      setError("Số điện thoại không hợp lệ");
      triggerShake();
      return;
    }

    try {
      const payload = {
        name: profile.name,
        dob: profile.dob,
        email: profile.email,
        phone: profile.phone,
      };

      const res = await updateProfile(payload);

      if (res.status === 200 || res.status === 204) {
        const updatedUser = { ...user, ...payload };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert("Cập nhật thành công");
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi server");
      triggerShake();
    }
  };

  return (
    <div style={Styles.overlay} onClick={handleClose}>
      <div
        style={{
          ...modal.content,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(-20px)",
          animation: shake ? "shake 0.4s" : "",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <div style={ButtonStyles.closeBtn} onClick={handleClose}>
          <X size={18} />
        </div>

        <h2 style={modal.title}>Thông tin cá nhân</h2>

{/* HỌ TÊN */}
<div style={modal.group}>
  <label style={modal.label}>
    Họ và tên <span style={modal.required}>*</span>
  </label>
  <input
    name="name"
    value={profile.name}
    onChange={handleChange}
    style={modal.input}
  />
</div>

{/* NGÀY SINH */}
<div style={modal.group}>
  <label style={modal.label}>
    Ngày sinh <span style={modal.required}>*</span>
  </label>
  <input
    type="date"
    name="dob"
    value={profile.dob}
    onChange={handleChange}
    style={modal.input}
  />
</div>

{/* SỐ ĐIỆN THOẠI */}
<div style={modal.group}>
  <label style={modal.label}>
    Số điện thoại <span style={modal.required}>*</span>
  </label>
  <input
    name="phone"
    value={profile.phone}
    onChange={handleChange}
    style={modal.input}
  />
</div>

{/* EMAIL */}
<div style={modal.group}>
  <label style={modal.label}>
    Email <span style={modal.required}>*</span>
  </label>
  <input
    name="email"
    value={profile.email}
    onChange={handleChange}
    style={modal.input}
  />
</div>

{/* USERNAME */}
<div style={modal.group}>
  <label style={modal.label}>Tên đăng nhập</label>
  <input value={profile.username} disabled style={modal.disabled} />
</div>

{/* ROLE */}
<div style={modal.group}>
  <label style={modal.label}>Chức vụ</label>
  <input value={profile.role} disabled style={modal.disabled} />
</div>

        {error && <p style={stylesError.message}>{error}</p>}

        <div style={modal.actions}>
          <button onClick={handleClose} style={ButtonStyles.cancelBtn}>
            Huỷ
          </button>
          <button onClick={handleUpdate} style={ButtonStyles.saveBtn}>
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* SHAKE KEYFRAME */}
      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            50% { transform: translateX(6px); }
            75% { transform: translateX(-6px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}

/* ================= STYLE ================= */

const modal = {
    content: {
        position: "relative",
        background: "#fff",
        padding: "35px 30px",
        borderRadius: "18px",
        width: "430px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "all 0.2s ease",
    },
    
    title: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "600",
        textAlign: "center",
        color: "#0f172a",
    },

    row: {
        display: "flex",
    },

    input: {
        width: "100%",
        padding: "11px 14px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        fontSize: "14px",
        outline: "none",
    },

    disabled: {
        width: "100%",
        padding: "11px 14px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        background: "#f1f5f9",
        fontSize: "14px",
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "10px",
    },

    
    group: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    label: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#475569",
    },

    required: {
        color: "#ef4444",
    },
};