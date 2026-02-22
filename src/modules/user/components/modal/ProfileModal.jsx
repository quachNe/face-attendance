import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { updateProfile } from "../../../../services/EmployeeService.js";
import { Styles, stylesError } from "../../style/Styles.js";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function ProfileStyles({ onClose }) {
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
        toast.success("Cập nhật thành công");
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
          ...Styles.content,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(-20px)",
          animation: shake ? "shake 0.4s" : "",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <div style={Styles.closeBtn} onClick={handleClose}>
          <X size={18} />
        </div>

        <h2 style={Styles.title}>Thông tin cá nhân</h2>

        {/* HỌ TÊN */}
        <div style={modal.group}>
          <label style={Styles.label}>
            Họ và tên <span style={Styles.required}>*</span>
          </label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            style={Styles.input}
          />
        </div>

        {/* NGÀY SINH */}
        <div style={modal.group}>
          <label style={Styles.label}>
            Ngày sinh <span style={Styles.required}>*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
            style={Styles.input}
          />
        </div>

        {/* SỐ ĐIỆN THOẠI */}
        <div style={modal.group}>
          <label style={Styles.label}>
            Số điện thoại <span style={Styles.required}>*</span>
          </label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            style={Styles.input}
          />
        </div>

        {/* EMAIL */}
        <div style={modal.group}>
          <label style={Styles.label}>
            Email <span style={Styles.required}>*</span>
          </label>
          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            style={Styles.input}
          />
        </div>

        {/* USERNAME */}
        <div style={modal.group}>
          <label style={Styles.label}>Tên đăng nhập</label>
          <input value={profile.username} disabled style={Styles.disabled} />
        </div>

        {/* ROLE */}
        <div style={modal.group}>
          <label style={Styles.label}>Chức vụ</label>
          <input value={profile.role} disabled style={Styles.disabled} />
        </div>

        {error && <p style={stylesError.message}>{error}</p>}

        <div style={Styles.actions}>
          <button onClick={handleClose} style={Styles.cancelBtn}>
            Huỷ
          </button>
          <button onClick={handleUpdate} style={Styles.saveBtn}>
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
    row: {
        display: "flex",
    },
    group: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    label: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#475569",
    },
};