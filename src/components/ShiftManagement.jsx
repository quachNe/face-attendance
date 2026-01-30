import React, { useState } from "react";
import { Styles} from "./Styles";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Clock
} from "lucide-react";

const ShiftManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Ca Sáng", start_time: "07:00", end_time: "12:00"},
    { id: 2, name: "Ca Chiều", start_time: "13:00", end_time: "18:00"},
  ]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", start_time: "", end_time: "" });

  const openAddModal = () => {
    setEditId(null);
    setForm({ name: "", start_time: "", end_time: "" });
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setEditId(u.id);
    setForm({ ...u });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editId) {
      setUsers(users.map((u) => (u.id === editId ? { ...u, ...form } : u)));
    } else {
      setUsers([...users, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const filteredUsers = users.filter((u) => {
    const keyword = search.toLowerCase().trim();

    const matchSearch =
      !keyword ||
      u.name?.toLowerCase().includes(keyword);

    return matchSearch;
  });


  return (
    <>
      <div style={Styles.header}>
        <h1 style={Styles.title}><Clock/>QUẢN LÝ CA LÀM VIỆC</h1>
        <div style={Styles.actions}>
          <input
            placeholder="Tìm theo tên ca làm việc"
            style={Styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={Styles.rightActions}>
            <button style={Styles.btnPrimary} onClick={openAddModal}><Plus size={18}/>Thêm</button>
          </div>
        </div>
      </div>

      <div style={Styles.tableWrapper}>
        <div style={Styles.tableScroll} className="custom-scroll">
          <table style={Styles.table}>
            <thead>
              <tr>
                {["STT", "Tên Ca", "Giờ Bắt Đầu", "Giờ Kết Thúc", "Thao tác"].map((h) => (
                  <th key={h} style={Styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={u.id} onClick={() => setSelectedId(u.id)} style={{ background: selectedId === u.id ? "#0ca1a120" : "transparent" }}>
                  <td style={Styles.td}>{i + 1}</td>
                  <td style={Styles.td}>{u.name}</td>
                  <td style={Styles.td}>{u.start_time || "—"}</td>
                  <td style={Styles.td}>{u.end_time || "—"}</td>
                  <td style={Styles.td}>
                    <div style={Styles.actionIcons}>
                      <div style={Styles.iconBoxEdit} onClick={(e) => { e.stopPropagation(); openEditModal(u); }}><Pencil size={15}/></div>
                      <div style={Styles.iconBoxDelete} onClick={(e) => { e.stopPropagation(); setUsers(users.filter((item) => item.id !== u.id)); }}><Trash2 size={15}/></div>
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
            <h2 style={Styles.modalTitle}>{editId ? "SỬA CA LÀM VIỆC" : "THÊM CA LÀM VIỆC"}</h2>
            <div style={Styles.formGrid}>
                {[["Tên Ca", "name"], ["Giờ Bắt Đầu", "start_time"], ["Giờ Kết Thúc", "end_time"]].map(([label, key, type]) => (
                <div key={key} style={Styles.formGroup}>
                  <label style={Styles.label}>{label}</label>
                  <input type={type || "text"} style={Styles.formInput} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div style={Styles.modalActions}>
              <button style={Styles.btnPdf} onClick={() => setShowModal(false)}><X />Hủy</button>
              <button style={Styles.btnPrimary} onClick={handleSave}><Save />Lưu</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShiftManagement;