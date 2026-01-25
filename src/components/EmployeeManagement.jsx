import React, { useState } from "react";
import { FiEdit, FiTrash2, FiFileText, FiUpload } from "react-icons/fi";
import { AiOutlineFileExcel } from "react-icons/ai";
import { Styles, DEFAULT_FACE } from "./Styles";

const EmployeeManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", dob: "1999-01-01", email: "a@gmail.com", phone: "0123456789", role: "admin", shift_id: 1, face_image: "https://i.pravatar.cc/60?img=3" },
    { id: 2, name: "Trần Thị B", dob: "2000-05-12", email: "", phone: "", role: "user", shift_id: "", face_image: null },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", dob: "", email: "", phone: "", role: "user", shift_id: "", face_preview: null });

  const openAddModal = () => {
    setEditId(null);
    setForm({ name: "", dob: "", email: "", phone: "", role: "user", shift_id: "", face_preview: null });
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setEditId(u.id);
    setForm({ ...u, face_preview: u.face_image });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editId) {
      setUsers(users.map((u) => (u.id === editId ? { ...u, ...form, face_image: form.face_preview } : u)));
    } else {
      setUsers([...users, { ...form, id: Date.now(), face_image: form.face_preview }]);
    }
    setShowModal(false);
  };

  return (
    <>
      <div style={Styles.header}>
        <h1 style={Styles.title}>QUẢN LÝ NHÂN VIÊN</h1>
        <div style={Styles.actions}>
          <input placeholder="Tìm kiếm nhân viên..." style={Styles.search} />
          <div style={Styles.rightActions}>
            <button style={Styles.btnPrimary} onClick={openAddModal}>Thêm nhân viên</button>
            <button style={Styles.btnExcel}><AiOutlineFileExcel /> Xuất Excel</button>
            <button style={Styles.btnPdf}><FiFileText /> Xuất PDF</button>
          </div>
        </div>
      </div>

      <div style={Styles.tableWrapper}>
        <div style={Styles.tableScroll} className="custom-scroll">
          <table style={Styles.table}>
            <thead>
              <tr>
                {["STT", "Họ tên", "Ngày sinh", "Email", "SĐT", "Vai trò", "Ca", "Khuôn mặt", "Thao tác"].map((h) => (
                  <th key={h} style={Styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} onClick={() => setSelectedId(u.id)} style={{ background: selectedId === u.id ? "#0ca1a120" : "transparent" }}>
                  <td style={Styles.td}>{i + 1}</td>
                  <td style={Styles.td}>{u.name}</td>
                  <td style={Styles.td}>{u.dob || "—"}</td>
                  <td style={Styles.td}>{u.email || "—"}</td>
                  <td style={Styles.td}>{u.phone || "—"}</td>
                  <td style={Styles.td}>{u.role === "admin" ? "Quản trị" : "Nhân viên"}</td>
                  <td style={Styles.td}>{u.shift_id || "—"}</td>
                  <td style={Styles.td}><img src={u.face_image || DEFAULT_FACE} alt="" style={Styles.faceImg} /></td>
                  <td style={Styles.td}>
                    <div style={Styles.actionIcons}>
                      <div style={Styles.iconBoxEdit} onClick={(e) => { e.stopPropagation(); openEditModal(u); }}><FiEdit /></div>
                      <div style={Styles.iconBoxDelete} onClick={(e) => { e.stopPropagation(); setUsers(users.filter((item) => item.id !== u.id)); }}><FiTrash2 /></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={Styles.modalOverlay}>
          <div style={Styles.modal}>
            <h2 style={Styles.modalTitle}>{editId ? "SỬA NHÂN VIÊN" : "THÊM NHÂN VIÊN"}</h2>
            <div style={Styles.faceBox}>
              <img src={form.face_preview || DEFAULT_FACE} alt="" style={Styles.facePreview} />
              <label style={Styles.uploadBtn}>
                <FiUpload /> Upload ảnh
                <input hidden type="file" onChange={(e) => setForm({ ...form, face_preview: URL.createObjectURL(e.target.files[0]) })} />
              </label>
            </div>
            <div style={Styles.formGrid}>
              {[["Họ tên", "name"], ["Ngày sinh", "dob", "date"], ["Email", "email"], ["SĐT", "phone"]].map(([label, key, type]) => (
                <div key={key} style={Styles.formGroup}>
                  <label style={Styles.label}>{label}</label>
                  <input type={type || "text"} style={Styles.formInput} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div style={Styles.formGroup}>
                <label style={Styles.label}>Vai trò</label>
                <select style={Styles.formInput} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="user">Nhân viên</option>
                  <option value="admin">Quản trị</option>
                </select>
              </div>
              <div style={Styles.formGroup}>
                <label style={Styles.label}>Ca làm việc</label>
                <input style={Styles.formInput} value={form.shift_id} onChange={(e) => setForm({ ...form, shift_id: e.target.value })} />
              </div>
            </div>
            <div style={Styles.modalActions}>
              <button style={Styles.btnPdf} onClick={() => setShowModal(false)}>Hủy</button>
              <button style={Styles.btnPrimary} onClick={handleSave}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeManagement;