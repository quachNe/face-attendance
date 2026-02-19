import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Save, X } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { updateEmployee } from "../../../../services/EmployeeService.js";
import {
  stylesButton,
  stylesError,
  styleModel,
} from "../../style/Styles.js";

const ChangePassword = ({ onClose }) => {
  const { user } = useAuth();

  const [animate, setAnimate] = useState(false);
  const [shake, setShake] = useState(false);

  const [error, setError] = useState("");
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

  /* ================= PASSWORD STRENGTH ================= */

  const getStrength = (password) => {
    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getStrength(form.newPassword);

  const strengthLabel = ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
  const strengthColor = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#16a34a",
  ];

  /* ================= MOUNT ================= */

  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => onClose(), 250);
  };

  const handleChange = (key, value) =>
    setForm({ ...form, [key]: value });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  /* ================= SUBMIT ================= */
  const resetForm = () => {
    setForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShow({
      old: false,
      new: false,
      confirm: false,
    });

    setError("");
    setShake(false);
  };


  const handleSubmit = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      triggerShake();
      return;
    }

    if (form.newPassword.length < 6) {
      setError("Mật khẩu phải ít nhất 6 ký tự");
      triggerShake();
      return;
    }

    if (form.oldPassword === form.newPassword) {
      setError("Mật khẩu mới phải khác mật khẩu cũ");
      triggerShake();
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      triggerShake();
      return;
    }

    try {
      const payload = {
        oldPassword: form.oldPassword,
        password: form.newPassword,
      };

      const res = await updateEmployee(user.id, payload);

      if (res.status === 200 || res.status === 204) {
        alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        handleLogout();
        return;
      }

      setError(res.data?.message || "Đổi mật khẩu thất bại");
      triggerShake();
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data?.message || "Mật khẩu cũ không đúng");
        triggerShake();
        return;
      }

      setError("Lỗi kết nối server");
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <div style={styleModel.modalOverlay}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...styleModel.modal,
          width: 400,
          padding: "30px 24px",
          transform: animate
            ? "translateY(0)"
            : "translateY(-40px)",
          opacity: animate ? 1 : 0,
          transition: "all 0.25s ease",
          animation: shake ? "shake 0.35s" : "none",
        }}
      >
        {/* NÚT X */}
        <button
          onClick={handleClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#fff",
            }}
        >
          <X size={20}/>
        </button>
        <h2 style={styleModel.modalTitle}>ĐỔI MẬT KHẨU</h2>

        <div style={styleModel.formGridShift}>
          {["old", "new", "confirm"].map((type, index) => {
            const key =
              type === "old"
                ? "oldPassword"
                : type === "new"
                ? "newPassword"
                : "confirmPassword";

            const label =
              type === "old"
                ? "Mật khẩu hiện tại"
                : type === "new"
                ? "Mật khẩu mới"
                : "Xác nhận mật khẩu mới";

            return (
              <div key={type} style={styleModel.formGroupShift}>
                <label style={styleModel.label}>
                  {label} <span style={{ color: "red" }}>*</span>
                </label>

                <div style={styleModel.inputWrapper}>
                  <input
                    type={show[type] ? "text" : "password"}
                    style={styleModel.formInput}
                    value={form[key]}
                    onChange={(e) =>
                      handleChange(key, e.target.value)
                    }
                  />
                  <span
                    style={styleModel.eyeIcon}
                    onClick={() =>
                      setShow({ ...show, [type]: !show[type] })
                    }
                  >
                    {show[type] ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </span>
                </div>

                {/* PASSWORD STRENGTH */}
                {type === "new" && form.newPassword && (
                  <div style={{ marginTop: 8 }}>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 10,
                        background: "#1f2937",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(strength / 4) * 100}%`,
                          height: "100%",
                          background:
                            strengthColor[strength],
                          transition: "0.3s",
                        }}
                      />
                    </div>

                    <small
                      style={{
                        color: strengthColor[strength],
                        fontWeight: 500,
                      }}
                    >
                      {strengthLabel[strength]}
                    </small>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && <p style={stylesError.message}>{error}</p>}

        <div style={stylesButton.actions}>
          <button
            style={stylesButton.btnCancel}
            onClick={resetForm}
          >
            <X size={18} /> Hủy
          </button>

          <button
            style={stylesButton.btnSave}
            onClick={handleSubmit}
          >
            <Save size={18} /> Lưu
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
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
      `}
      </style>
    </div>
  );
};

export default ChangePassword;