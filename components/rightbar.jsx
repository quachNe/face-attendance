import React, { useState } from "react";
import backgroundImg from "../assets/background.jpg";
import { FiEdit, FiTrash2, FiFileText, FiUpload } from "react-icons/fi";
import { AiOutlineFileExcel } from "react-icons/ai";
import "../App.css";

const DEFAULT_FACE =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

/* ================= LỊCH SỬ ĐIỂM DANH ================= */
const AttendanceHistory = () => {
  const [records] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/60?img=3",
      checkIn: "08:01",
      note: "Đúng giờ",
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: null,
      checkIn: "08:15",
      note: "Đi trễ",
    },
    {
      id: 3,
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/60?img=3",
      checkIn: "—",
      note: "Quên check-in",
    },
  ]);

  return (
    <>
      <div style={styles.header}>
        <h1 style={styles.title}>LỊCH SỬ ĐIỂM DANH</h1>

        <div style={styles.actions}>
          <input placeholder="Tìm kiếm nhân viên..." style={styles.search} />
          <input type="date" className="date-input" />

          <div style={styles.rightActions}>
            <button style={styles.btnExcel}>
              <AiOutlineFileExcel /> Xuất Excel
            </button>
            <button style={styles.btnPdf}>
              <FiFileText /> Xuất PDF
            </button>
          </div>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <div style={styles.tableScroll} className="custom-scroll">
          <table style={styles.table}>
            <thead>
              <tr>
                {[
                  "STT",
                  "Ảnh",
                  "Nhân viên",
                  "Giờ vào",
                  "Trạng thái",
                  "Ghi chú",
                ].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const hasAttendance = r.checkIn !== "—";
                return (
                  <tr key={r.id}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>
                      <img
                        src={r.avatar || DEFAULT_FACE}
                        alt=""
                        style={styles.faceImg}
                      />
                    </td>
                    <td style={styles.td}>{r.name}</td>
                    <td style={styles.td}>{r.checkIn}</td>
                    <td
                      style={{
                        ...styles.td,
                        fontSize: 18,
                        fontWeight: 700,
                        color: hasAttendance ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {hasAttendance ? "✓" : "✕"}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        fontWeight: 600,
                        color:
                          r.note.includes("trễ") || r.note.includes("Quên")
                            ? "#ef4444"
                            : "#22c55e",
                      }}
                    >
                      {r.note}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

/* ================= RIGHTBAR ================= */
const Rightbar = ({ activePage }) => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      dob: "1999-01-01",
      email: "a@gmail.com",
      phone: "0123456789",
      role: "admin",
      shift_id: 1,
      face_image: "https://i.pravatar.cc/60?img=3",
    },
    {
      id: 1,
      name: "Nguyễn Văn A",
      dob: "1999-01-01",
      email: "a@gmail.com",
      phone: "0123456789",
      role: "admin",
      shift_id: 1,
      face_image: "https://i.pravatar.cc/60?img=3",
    },{
      id: 1,
      name: "Nguyễn Văn A",
      dob: "1999-01-01",
      email: "a@gmail.com",
      phone: "0123456789",
      role: "admin",
      shift_id: 1,
      face_image: "https://i.pravatar.cc/60?img=3",
    },{
      id: 1,
      name: "Nguyễn Văn A",
      dob: "1999-01-01",
      email: "a@gmail.com",
      phone: "0123456789",
      role: "admin",
      shift_id: 1,
      face_image: "https://i.pravatar.cc/60?img=3",
    },
    {
      id: 1,
      name: "Nguyễn Văn A",
      dob: "1999-01-01",
      email: "a@gmail.com",
      phone: "0123456789",
      role: "admin",
      shift_id: 1,
      face_image: "https://i.pravatar.cc/60?img=3",
    },{
      id: 1,
      name: "Nguyễn Văn A",
      dob: "1999-01-01",
      email: "a@gmail.com",
      phone: "0123456789",
      role: "admin",
      shift_id: 1,
      face_image: "https://i.pravatar.cc/60?img=3",
    },
    {
      id: 2,
      name: "Trần Thị B",
      dob: "2000-05-12",
      email: "",
      phone: "",
      role: "user",
      shift_id: "",
      face_image: null,
    },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    role: "user",
    shift_id: "",
    face_preview: null,
  });

  const openAddModal = () => {
    setEditId(null);
    setForm({
      name: "",
      dob: "",
      email: "",
      phone: "",
      role: "user",
      shift_id: "",
      face_preview: null,
    });
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setEditId(u.id);
    setForm({
      name: u.name,
      dob: u.dob,
      email: u.email,
      phone: u.phone,
      role: u.role,
      shift_id: u.shift_id || "",
      face_preview: u.face_image,
    });
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, face_preview: URL.createObjectURL(file) });
  };

  const handleSave = () => {
    if (!form.name) return;

    if (editId) {
      setUsers(users.map((u) =>
        u.id === editId ? { ...u, ...form, face_image: form.face_preview } : u
      ));
    } else {
      setUsers([
        ...users,
        { id: Date.now(), ...form, face_image: form.face_preview },
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    setSelectedId(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        {activePage === "employee" && (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>QUẢN LÝ NHÂN VIÊN</h1>

              <div style={styles.actions}>
                <input placeholder="Tìm kiếm nhân viên..." style={styles.search} />
                <div style={styles.rightActions}>
                  <button style={styles.btnPrimary} onClick={openAddModal}>
                    Thêm nhân viên
                  </button>
                  <button style={styles.btnExcel}>
                    <AiOutlineFileExcel /> Xuất Excel
                  </button>
                  <button style={styles.btnPdf}>
                    <FiFileText /> Xuất PDF
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.tableWrapper}>
              <div style={styles.tableScroll} className="custom-scroll">
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {[
                        "STT",
                        "Họ tên",
                        "Ngày sinh",
                        "Email",
                        "SĐT",
                        "Vai trò",
                        "Ca",
                        "Khuôn mặt",
                        "Thao tác",
                      ].map((h) => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr
                        key={u.id}
                        onClick={() => setSelectedId(u.id)}
                        style={{
                          background:
                            selectedId === u.id ? "#0ca1a120" : "transparent",
                        }}
                      >
                        <td style={styles.td}>{i + 1}</td>
                        <td style={styles.td}>{u.name}</td>
                        <td style={styles.td}>{u.dob || "—"}</td>
                        <td style={styles.td}>{u.email || "—"}</td>
                        <td style={styles.td}>{u.phone || "—"}</td>
                        <td style={styles.td}>
                          {u.role === "admin" ? "Quản trị" : "Nhân viên"}
                        </td>
                        <td style={styles.td}>{u.shift_id || "—"}</td>
                        <td style={styles.td}>
                          <img
                            src={u.face_image || DEFAULT_FACE}
                            alt=""
                            style={styles.faceImg}
                          />
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionIcons}>
                            <div
                              style={styles.iconBoxEdit}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(u);
                              }}
                            >
                              <FiEdit />
                            </div>
                            <div
                              style={styles.iconBoxDelete}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(u.id);
                              }}
                            >
                              <FiTrash2 />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showModal && (
              <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                  <h2 style={styles.modalTitle}>
                    {editId ? "SỬA NHÂN VIÊN" : "THÊM NHÂN VIÊN"}
                  </h2>

                  <div style={styles.faceBox}>
                    <img
                      src={form.face_preview || DEFAULT_FACE}
                      alt=""
                      style={styles.facePreview}
                    />
                    <label style={styles.uploadBtn}>
                      <FiUpload /> Upload ảnh
                      <input hidden type="file" onChange={handleImageChange} />
                    </label>
                  </div>

                  <div style={styles.formGrid}>
                    {[
                      ["Họ tên", "name"],
                      ["Ngày sinh", "dob", "date"],
                      ["Email", "email"],
                      ["Số điện thoại", "phone"],
                    ].map(([label, key, type]) => (
                      <div key={key} style={styles.formGroup}>
                        <label style={styles.label}>{label}</label>
                        <input
                          type={type || "text"}
                          style={styles.formInput}
                          value={form[key]}
                          onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value })
                          }
                        />
                      </div>
                    ))}

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Vai trò</label>
                      <select
                        style={styles.formInput}
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                      >
                        <option value="user">Nhân viên</option>
                        <option value="admin">Quản trị</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Ca làm việc</label>
                      <input
                        style={styles.formInput}
                        value={form.shift_id}
                        onChange={(e) =>
                          setForm({ ...form, shift_id: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div style={styles.modalActions}>
                    <button
                      style={styles.btnPdf}
                      onClick={() => setShowModal(false)}
                    >
                      Hủy
                    </button>
                    <button style={styles.btnPrimary} onClick={handleSave}>
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activePage === "history" && <AttendanceHistory />}
        {/* ===== CUSTOM SCROLLBAR STYLE ===== */}
        <style>
          {`
          .custom-scroll::-webkit-scrollbar {
            width: 8px;
          }

          .custom-scroll::-webkit-scrollbar-track {
            background: #020617;
            border-radius: 10px;
          }

          .custom-scroll::-webkit-scrollbar-thumb {
            background: #0ca1a1;
            border-radius: 10px;
          }

          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: #22d3ee;
          }

          /* Firefox */
          .custom-scroll {
            scrollbar-width: thin;
            scrollbar-color: #0ca1a1 #020617;
          }
          `}
        </style>
      </div>
      
    </div>
  );
};

/* ================= STYLE ================= */
const styles = {
  container: {
    flex: 1,
    minHeight: "100vh",
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: "cover",
  },
  
  overlay: {
    minHeight: "100vh",
    padding: 32,
    background: "rgba(1,1,5,0.85)",
    color: "#e5e7eb",
  },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 16 },
  actions: { display: "flex", gap: 12 },
  rightActions: { marginLeft: "auto", display: "flex", gap: 10 },
  search: {
    width: 260,
    height: 42,
    padding: "0 12px",
    borderRadius: 8,
    background: "#020617",
    border: "1px solid #334155",
    color: "#fff",
  },
  btnPrimary: {
    background: "#0ca1a1",
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
  },
  btnExcel: { background: "#16a34a", padding: "10px 14px", borderRadius: 8, color: "#fff" },
  btnPdf: { background: "#dc2626", padding: "10px 14px", borderRadius: 8, color: "#fff" },
  
  tableWrapper: {
    background: "#020617",
    borderRadius: 12,
    border: "2px solid #1e293b",
  },
  tableScroll: {
    maxHeight: "65vh",
    overflowY: "auto",
  },

  table: { width: "100%", borderCollapse: "collapse" },
  th: {
  padding: 12,
  color: "#38f2f2",
  position: "sticky",
  top: 0,
  background: "#020617",
  zIndex: 10,
},

  td: { padding: 12, textAlign: "center", borderBottom: "1px solid #1e293b" },
  faceImg: { width: 42, height: 42, borderRadius: "50%" },
  actionIcons: { display: "flex", justifyContent: "center", gap: 12 },
  iconBoxEdit: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid #0ca1a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#38f2f2",
    cursor: "pointer",
  },
  iconBoxDelete: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid #ef4444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ef4444",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: { width: 520, background: "#020617", padding: 24, borderRadius: 12 },
  modalTitle: { textAlign: "center", fontSize: 22, fontWeight: 700 },
  faceBox: { alignItems: "center", display: "flex", flexDirection: "column", gap: 8 },
  facePreview: { width: 96, height: 96, borderRadius: "50%" },
  uploadBtn: { color: "#38f2f2", cursor: "pointer" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, color: "#94a3b8" },
  formInput: {
    height: 42,
    padding: "0 12px",
    borderRadius: 8,
    background: "#020617",
    border: "1px solid #334155",
    color: "#e5e7eb",
  },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 },
};

export default Rightbar;
