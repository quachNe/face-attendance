import React, { useEffect, useState } from "react";
import {
  styleModel,
  stylesButton,
  stylesError,
  datePickerStyles,
} from "../../style/Styles";
import { X, Save, RotateCcw, Camera } from "lucide-react";
import CameraModal from "./CameraModal";

const FACE_TYPES = ["left", "center", "right"];

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
  const [cameraFor, setCameraFor] = useState(null);

  /* ================= ESC ================= */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && show && handleClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [show]);

  /* ================= OPEN ================= */
  useEffect(() => {
    if (show) setTimeout(() => setAnimate(true), 10);
  }, [show]);

  /* ================= CAMERA ================= */
  const openCamera = (type) => setCameraFor(type);

  const handleCapture = (img) => {
    setForm((prev) => ({
      ...prev,
      face_preview: {
        ...prev.face_preview,
        [cameraFor]: img,
      },
    }));
    setCameraFor(null);
  };

  /* ================= CLOSE ================= */
  const handleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 250);
  };

  if (!show) return null;

  return (
    <>
      <style>{datePickerStyles}</style>

      {/* ===== MODAL ===== */}
      <div style={styleModel.modalOverlay}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            ...styleModel.modal,
            width: 650,
            transform: animate ? "translateY(0)" : "translateY(-40px)",
            opacity: animate ? 1 : 0,
            transition: "all .25s",
          }}
        >
          {/* NÚT X */}
          <button onClick={handleClose} style={styleModel.btnClose}>
            <X size={20} />
          </button>

          <h2 style={styleModel.modalTitle}>
            {editId ? "CẬP NHẬT NHÂN VIÊN" : "THÊM NHÂN VIÊN"}
          </h2>

          {/* ===== ẢNH KHUÔN MẶT ===== */}
          <div style={styles.faceRow}>
            {FACE_TYPES.map((t) => (
              <div
                key={t}
                style={styles.faceBox}
                onClick={() => openCamera(t)}
              >
                <div style={styles.faceTitle}>
                  {t === "left"
                    ? "Góc trái"
                    : t === "right"
                    ? "Góc phải"
                    : "Chính diện"}
                </div>

                {form.face_preview?.[t] ? (
                  <img
                    src={form.face_preview[t]}
                    alt=""
                    style={styles.faceImg}
                  />
                ) : (
                  <div style={styles.facePlaceholder}>
                    <Camera size={28} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ===== FORM ===== */}
<div style={styleModel.formGrid}>
  
  {/* HỌ TÊN */}
  <div style={styleModel.formGroup}>
    <label style={styleModel.label}>
      Họ và tên <span style={{ color: "red" }}>*</span>
    </label>
    <input
      type="text"
      style={styleModel.formInput}
      value={form.name}
      onChange={(e) =>
        setForm({ ...form, name: e.target.value })
      }
    />
  </div>

  {/* NGÀY SINH */}
  <div style={styleModel.formGroup}>
    <label style={styleModel.label}>
      Ngày sinh <span style={{ color: "red" }}>*</span>
    </label>
    <input
      type="date"
      className="custom-date-input"
      style={styleModel.formInput}
      value={form.dob}
      onChange={(e) =>
        setForm({ ...form, dob: e.target.value })
      }
    />
  </div>

  {/* SĐT */}
  <div style={styleModel.formGroup}>
    <label style={styleModel.label}>
      Số điện thoại <span style={{ color: "red" }}>*</span>
    </label>
    <input
      type="text"
      style={styleModel.formInput}
      value={form.phone}
      onChange={(e) =>
        setForm({ ...form, phone: e.target.value })
      }
    />
  </div>

  {/* EMAIL */}
  <div style={styleModel.formGroup}>
    <label style={styleModel.label}>
      Email <span style={{ color: "red" }}>*</span>
    </label>
    <input
      type="email"
      style={styleModel.formInput}
      value={form.email}
      onChange={(e) =>
        setForm({ ...form, email: e.target.value })
      }
    />
  </div>

  {/* VAI TRÒ */}
  <div style={styleModel.formGroup}>
    <label style={styleModel.label}>
      Vai trò <span style={{ color: "red" }}>*</span>
    </label>
    <select
      style={styleModel.formInput}
      value={form.role}
      onChange={(e) =>
        setForm({ ...form, role: e.target.value })
      }
    >
      <option value="">-- Chọn --</option>
      <option value="EMPLOYEE">Nhân viên</option>
      <option value="ADMIN">Quản trị viên</option>
    </select>
  </div>

  {/* CA LÀM */}
  <div style={styleModel.formGroup}>
    <label style={styleModel.label}>
      Ca làm việc <span style={{ color: "red" }}>*</span>
    </label>
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

          {/* ERROR */}
          {error && <p style={stylesError.message}>{error}</p>}

          {/* ACTION */}
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

      {/* ===== CAMERA MODAL ===== */}
      <CameraModal
        show={!!cameraFor}
        onClose={() => setCameraFor(null)}
        onCapture={handleCapture}
      />
    </>
  );
};

export default EmployeeModal;

/* ================= STYLES ================= */

const styles = {
  faceRow: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    marginBottom: 18,
  },

  faceBox: {
    width: 150,
    textAlign: "center",
    cursor: "pointer",
  },

  faceTitle: {
    fontWeight: 700,
    marginBottom: 6,
  },

  faceImg: {
    width: "100%",
    borderRadius: 10,
  },

  facePlaceholder: {
    height: 110,
    background: "#020617",
    border: "1px dashed #334155",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};