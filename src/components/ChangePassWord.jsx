import React, { useState } from "react";
import { Eye, EyeOff, Save, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { updateEmployee } from "../services/EmployeeService.js";
import {
  stylesButton,
  stylesError,
  styleModel,
} from "./Styles.js";

const ChangePassword = ({ onClose }) => {
  //STATE
  const { user } = useAuth();

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

  // XỬ LÝ THAY ĐỔI GIÁ TRỊ FORM
  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  // XỬ LÝ ĐĂNG XUẤT
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // XỬ LÝ ĐỔI MẬT KHẨU
  const handleSubmit = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (form.oldPassword === form.newPassword) {
      setError("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const payload = {
        oldPassword: form.oldPassword,
        password: form.newPassword,
      };

      const res = await updateEmployee(user.id, payload);

      // HTTP 2xx là thành công
      if (res.status === 200 || res.status === 204) {
        alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        handleLogout();
        return;
      }

      // fallback
      setError(res.data?.message || "Đổi mật khẩu thất bại!");
    } catch (err) {
      // ĐÚNG LỖI 400 TỪ BACKEND
      if (err.response?.status === 400) {
        setError(err.response.data?.message || "Mật khẩu cũ không đúng");
        return;
      }

      console.error(err);
      setError("Lỗi kết nối server");
    }
  };

  return (
    <div style={styleModel.modalOverlay}>
      <div style={{...styleModel.modal, width: 400, padding: "30px 24px"}}>
        <h2 style={styleModel.modalTitle}>ĐỔI MẬT KHẨU</h2>

        <div style={styleModel.formGridShift}>
          {/* MẬT KHẨU HIỆN TAI */}
          <div style={styleModel.formGroupShift}>
            <label style={styleModel.label}>
              Mật khẩu hiện tại <span style={{ color: "red" }}>*</span>
            </label>

            <div style={styleModel.inputWrapper}>
              <input
                type={show.old ? "text" : "password"}
                style={styleModel.formInput}
                value={form.oldPassword}
                onChange={(e) =>
                  handleChange("oldPassword", e.target.value)
                }
              />
              <span
                style={styleModel.eyeIcon}
                onClick={() => setShow({ ...show, old: !show.old })}
              >
                {show.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* MẬT KHẨU MỚI */}
          <div style={styleModel.formGroupShift}>
            <label style={styleModel.label}>
              Mật khẩu mới <span style={{ color: "red" }}>*</span>
            </label>

            <div style={styleModel.inputWrapper}>
              <input
                type={show.new ? "text" : "password"}
                style={styleModel.formInput}
                value={form.newPassword}
                onChange={(e) =>
                  handleChange("newPassword", e.target.value)
                }
              />
              <span
                style={styleModel.eyeIcon}
                onClick={() => setShow({ ...show, new: !show.new })}
              >
                {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* XÁC NHẬN MẬT KHẨU MỚI */}
          <div style={styleModel.formGroupShift}>
            <label style={styleModel.label}>
              Xác nhận mật khẩu mới <span style={{ color: "red" }}>*</span>
            </label>

            <div style={styleModel.inputWrapper}>
              <input
                type={show.confirm ? "text" : "password"}
                style={styleModel.formInput}
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
              />
              <span
                style={styleModel.eyeIcon}
                onClick={() =>
                  setShow({ ...show, confirm: !show.confirm })
                }
              >
                {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>
        </div>

        {error && <p style={stylesError.message}>{error}</p>}

        <div style={stylesButton.actions}>
          <button style={stylesButton.btnCancel} onClick={onClose}>
            <X size={18} /> Hủy
          </button>

          <button style={stylesButton.btnSave} onClick={handleSubmit}>
            <Save size={18} /> Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;