import React, { useEffect, useState } from "react";
import {
  Save,
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
} from "lucide-react";
import { styleModel, stylesButton, stylesError, datePickerStyles } from "../style/Styles";
import {
  getEmployeeById,
  updateEmployee,
} from "../../../services/EmployeeService";
import { useAuth } from "../../../context/AuthContext";

const UserProfile = ({ onClose }) => {
  
  const { user } = useAuth();

  const [animate, setAnimate] = useState(false);
  const [shake, setShake] = useState(false);
  const [hover, setHover] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  /* ================= LOAD USER ================= */
  const fetchUser = async () => {
    try {
      const { data } = await getEmployeeById(user.id);
      setForm({
        name: data.name || "",
        dob: data.dob || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        role: data.role?.toUpperCase() || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= MOUNT ================= */
  useEffect(() => {
    fetchUser();

    setTimeout(() => setAnimate(true), 10);

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  /* ================= CLOSE ================= */
  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  /* ================= CHANGE ================= */
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.dob) {
      setError("Không được để trống thông tin");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    try {
      const { data } = await updateEmployee(user.id, form);

      if (!data.success) {
        setError(data.message || "Cập nhật thất bại");
        setShake(true);
        setTimeout(() => setShake(false), 400);
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...currentUser,
        name: form.name,
        email: form.email,
        phone: form.phone,
        dob: form.dob,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Đổi thông tin thành công!!")
      // handleClose();
    } catch (err) {
      console.error(err);
      setError("Cập nhật thất bại");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <>
      <style>{datePickerStyles}</style>
      <div
        style={styleModel.modalOverlay}
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            ...styleModel.modal,
            width: 500,
            padding: "30px 24px",
            transform: animate
              ? "translateY(0)"
              : "translateY(-40px)",
            opacity: animate ? 1 : 0,
            transition: "all 0.25s ease",
            animation: shake ? "shake 0.35s" : "none",
          }}
        >
          <h2 style={styleModel.modalTitle}>
            THÔNG TIN NGƯỜI DÙNG
          </h2>

          <div style={styleModel.formGridShift}>
            {[
              ["name", "Họ và tên", <User size={18} />],
              ["dob", "Ngày sinh", <Calendar size={18} />],
              ["email", "Email", <Mail size={18} />],
              ["phone", "Số điện thoại", <Phone size={18} />],
              ["role", "Chức vụ", <Briefcase size={18} />],
            ].map(([key, label, icon]) => (
              <div key={key} style={styleModel.formGroup}>
                <label style={styleModel.label}>
                  {label}
                  {key !== "role" && (
                    <span style={{ color: "red" }}> *</span>
                  )}
                </label>

                <div style={stylesUserProfile.inputBox}>
                  <span style={stylesUserProfile.icon}>
                    {icon}
                  </span>

                  <input
                    type={
                      key === "dob"
                        ? "date"
                        : key === "phone"
                        ? "tel"
                        : "text"
                    }
                    className={key === "dob" ? "custom-date-input" : ""}
                    disabled={key === "role"}
                    value={form[key]}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (key === "phone") {
                        value = value.replace(/\D/g, "");
                      }
                      handleChange(key, value);
                    }}
                    style={stylesUserProfile.input}
                  />
                </div>
              </div>
            ))}

            {error && (
              <p style={stylesError.message}>{error}</p>
            )}

            <div style={stylesButton.actions}>
              <button
                style={{
                  ...stylesButton.btnCancel,
                  ...(hover === "cancel" &&
                    stylesButton.btnCancelHover),
                }}
                onMouseEnter={() => setHover("cancel")}
                onMouseLeave={() => setHover(null)}
                onClick={handleClose}
              >
                <X size={18} /> Hủy
              </button>

              <button
                style={{
                  ...stylesButton.btnSave,
                  ...(hover === "save" &&
                    stylesButton.btnSaveHover),
                }}
                onMouseEnter={() => setHover("save")}
                onMouseLeave={() => setHover(null)}
                onClick={handleSubmit}
              >
                <Save size={18} /> Lưu
              </button>
            </div>
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
    </>
  );
};

export default UserProfile;

/* ================= STYLES ================= */

const stylesUserProfile = {
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e5e7eb",
    fontSize: 14,
  },
};
