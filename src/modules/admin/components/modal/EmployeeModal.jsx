import React, { useEffect, useState } from "react";
import {
  styleModel,
  stylesButton,
  stylesError,
  datePickerStyles,
} from "../../style/Styles";
import { X, Save, RotateCcw } from "lucide-react";

const EmployeeModal = ({
  show,
  onClose,
  onSave,
  onReset,
  form,
  setForm,
  editId,
  shifts,
  error,
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && show && handleClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [show]);

  useEffect(() => {
    if (show) setTimeout(() => setAnimate(true), 10);
  }, [show]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 250);
  };

  if (!show) return null;

  return (
    <>
      <style>{datePickerStyles}</style>

      <div style={styleModel.modalOverlay}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            ...styleModel.modal,
            width: 600,
            transform: animate ? "translateY(0)" : "translateY(-40px)",
            opacity: animate ? 1 : 0,
            transition: "all .25s",
          }}
        >
          <button onClick={handleClose} style={styleModel.btnClose}>
            <X size={20} />
          </button>

          <h2 style={styleModel.modalTitle}>
            {editId ? "CẬP NHẬT NHÂN VIÊN" : "THÊM NHÂN VIÊN"}
          </h2>

          <div style={styleModel.formGrid}>
            <div style={styleModel.formGroup}>
              <label style={styleModel.label}>Họ và tên <span style={{color:"red"}}>*</span></label>
              <input
                style={styleModel.formInput}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div style={styleModel.formGroup}>
              <label style={styleModel.label}>Ngày sinh <span style={{color:"red"}}>*</span></label>
              <input
                type="date"
                style={styleModel.formInput}
                value={form.dob}
                onChange={(e) =>
                  setForm({ ...form, dob: e.target.value })
                }
                className="custom-date-input"
              />
            </div>

            <div style={styleModel.formGroup}>
              <label style={styleModel.label}>SĐT <span style={{color:"red"}}>*</span></label>
              <input
                style={styleModel.formInput}
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div style={styleModel.formGroup}>
              <label style={styleModel.label}>Email <span style={{color:"red"}}>*</span></label>
              <input
                type="email"
                style={styleModel.formInput}
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div style={styleModel.formGroup}>
              <label style={styleModel.label}>Vai trò <span style={{color:"red"}}>*</span></label>
              <select
                style={styleModel.formInput}
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="">-- Chọn --</option>
                <option value="employee">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            <div style={styleModel.formGroup}>
              <label style={styleModel.label}>Ca làm <span style={{color:"red"}}>*</span></label>
              <select
                style={styleModel.formInput}
                value={form.shift_id}
                onChange={(e) =>
                  setForm({ ...form, shift_id: e.target.value })
                }
              >
                <option value="">-- Chọn --</option>
                {shifts?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p style={stylesError.message}>{error}</p>}

          <div style={stylesButton.actions}>
            <button style={stylesButton.btnCancel} onClick={onReset}>
              <RotateCcw size={18} /> Làm mới
            </button>

            <button style={stylesButton.btnSave} onClick={onSave}>
              <Save size={18} /> Lưu
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeModal;