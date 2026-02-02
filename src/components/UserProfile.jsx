import React, { useEffect, useState } from "react";
import { Save, X, User, Mail, Phone, Briefcase, Calendar, } from "lucide-react";
import { styleModel, stylesButton, stylesError } from "./Styles";
import { getEmployeeById, updateEmployee } from "../services/EmployeeService";
import { useAuth } from "../context/AuthContext";

const UserProfile = ({ onClose}) => {
  const { user } = useAuth();
  const [hover, setHover] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    dob: user?.dob || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    role: user.role?.toUpperCase() || "",
  });

  // LOAD USER TỪ API
  const fetchUser = async () => {
    try {
      const {data} = await getEmployeeById(`${user.id}`);
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

  // GỌI API KHI MOUNT COMPONENT
  useEffect(() => {
    fetchUser();
  }, []);

  
  // XỬ LÝ THAY ĐỔI GIÁ TRỊ FORM
  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  // XỬ LÝ LƯU THÔNG TIN NGƯỜI DÙNG
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.dob) {
      setError("Không được để trống thông tin");
      return;
    }

    try {
      const { data } = await updateEmployee(user.id, form);

      if (!data.success) {
        setError(data.message || "Cập nhật thất bại");
        return;
      }

      // lấy user hiện tại trong local
      const currentUser = JSON.parse(localStorage.getItem("user"));

      // merge lại user (KHÔNG phụ thuộc backend có trả user hay không)
      const updatedUser = {
        ...currentUser,
        name: form.name,
        email: form.email,
        phone: form.phone,
        dob: form.dob,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Cập nhật thông tin thành công");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Cập nhật thất bại");
    }
  };

  return (
    <div style={styleModel.modalOverlay}>
      <div style={{...styleModel.modal, width: 500, padding: "30px 24px"}}>
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
              <label style={styleModel.label}>{label}<span style={{ color: "red" }}> *</span></label>
              <div style={stylesUserProfile.inputBox}>
                <span style={stylesUserProfile.icon}>{icon}</span>
                <input
                  type={
                    key === "dob"
                      ? "date"
                      : key === "phone"
                      ? "tel"
                      : "text"
                  }
                  disabled={key === "role"}
                  value={form[key]}
                  onChange={(e) => {
                    let value = e.target.value;

                    // Nếu là SĐT → chỉ cho nhập số
                    if (key === "phone") {
                      value = value.replace(/\D/g, "");
                    }

                    handleChange(key, value);
                  }}
                  style={{
                    ...stylesUserProfile.input,
                    color: "#e5e7eb",
                  }}
                />
              </div>
            </div>
          ))}

          {/* ERROR */}
          {error && (
            <p style={stylesError.message}>
              {error}
            </p>
          )}

          {/* ACTIONS */}
          <div style={stylesButton.actions}>
            <button
              style={{
                ...stylesButton.btnCancel,
                ...(hover === "cancel" && stylesButton.btnCancelHover),
              }}
              onMouseEnter={() => setHover("cancel")}
              onMouseLeave={() => setHover(null)}
              onClick={onClose}
            >
              <X size={18} /> Hủy
            </button>

            <button
              style={{
                ...stylesButton.btnSave,
                ...(hover === "save" && stylesButton.btnSaveHover),
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
    </div>
  );
};

export default UserProfile;

// STYLES
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