import React, { useState, useEffect } from "react";
import { Styles, DEFAULT_FACE } from "./Styles";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Upload,
  Users2,
  FileSpreadsheet,
  Save,
  X
} from "lucide-react";

// CSS global cho input date (chỉ inject 1 lần)
const datePickerStyles = `
  .custom-date-input {
    color-scheme: dark; /* giúp icon trắng/sáng ở Firefox và một số trường hợp Chrome */
  }

  .custom-date-input::-webkit-calendar-picker-indicator {
    filter: brightness(0) invert(1); /* biến icon thành trắng hoàn toàn */
    opacity: 1 !important;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }

  .custom-date-input::-webkit-inner-spin-button,
  .custom-date-input::-webkit-clear-button {
    display: none; /* ẩn các nút spin nếu có */
  }
`;

// Inject CSS một lần duy nhất khi component mount
if (!document.getElementById("date-picker-custom-style")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "date-picker-custom-style";
  styleSheet.type = "text/css";
  styleSheet.innerText = datePickerStyles;
  document.head.appendChild(styleSheet);
}

const EmployeeManagement = () => {
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    dob: "",
    email: "",
    phone: "",
    role: "",
    shift: "",
    face_preview: null,
    face_file: null,
  });

  // Mở modal thêm nhân viên
  const openAddModal = () => {
    setEditId(null);
    setForm({
      name: "",
      username: "",
      password: "",
      dob: "",
      email: "",
      phone: "",
      role: "EMPLOYEE",
      shift: "",
      face_preview: null,
      face_file: null,
    });
    setShowModal(true);
  };

  //  Mở modal sửa nhân viên
  const openEditModal = (u) => {
    setEditId(u.id);
    setForm({
      ...u,
      username: u.username,
      role : u.role == "admin" ? "ADMIN" : "EMPLOYEE",
      shift: u.shift,
      face_preview: u.face_image,
      face_file: null,
    });
    setShowModal(true);
  };


  const generateUsername = (users) => {
    const year = new Date().getFullYear();

    const sameYearUsers = users
      .map(u => u.username)
      .filter(u => u && u.startsWith(`NV${year}`));

    let max = 0;
    sameYearUsers.forEach(u => {
      const num = parseInt(u.slice(6)); // NV2026XXXX
      if (!isNaN(num) && num > max) max = num;
    });

    const next = max + 1;
    return `NV${year}${String(next).padStart(4, "0")}`;
  };


  // Lưu nhân viên (thêm hoặc sửa)
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    }
  );

  const generatePassword = (dob) => {
    if (!dob) return "";
    const d = new Date(dob);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };

  const handleSave = async () => {
    if (!form.name || !form.dob) {
      alert("Thiếu tên hoặc ngày sinh");
      return;
    }

    let imageBase64 = null;
    if (form.face_file) {
      imageBase64 = await fileToBase64(form.face_file);
    }

    // =====================
    // 👉 TRƯỜNG HỢP SỬA
    // =====================
    if (editId) {
      const payload = {
        name: form.name,
        dob: form.dob,
        email: form.email,
        phone: form.phone,
        role: form.role,
        shift: form.shift,
        image: imageBase64, // null nếu không đổi ảnh
      };

      try {
        const res = await fetch(
          `http://localhost:5000/api/employees/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(data.message || "Lỗi cập nhật nhân viên");
          return;
        }

        // 👉 update lại state FE
        setUsers(users.map(u =>
          u.id === editId ? data.user : u
        ));
        setShowModal(false);
        FetchEmployee();
      } catch (err) {
        console.error(err);
        alert("Không kết nối được server");
      }

      return;
    }

    // =====================
    // 👉 TRƯỜNG HỢP THÊM MỚI
    // =====================
    const username = generateUsername(users);
    const password = generatePassword(form.dob);

    const payload = {
      name: form.name,
      username,
      password,
      dob: form.dob,
      email: form.email,
      phone: form.phone,
      role: form.role || "EMPLOYEE",
      shift: form.shift || 1,
      image: imageBase64,
    };

    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Lỗi tạo nhân viên");
        return;
      }

      setUsers([...users, data.user]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Không kết nối được server");
    }
  };

  // Lọc nhân viên theo tìm kiếm và vai trò
  const filteredUsers = users.filter((u) => {
    const keyword = search.toLowerCase().trim();
    const matchSearch =
      !keyword ||
      u.name?.toLowerCase().includes(keyword) ||
      u.email?.toLowerCase().includes(keyword) ||
      u.phone?.toLowerCase().includes(keyword);
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  // Lấy danh sách nhân viên từ API
  const FetchEmployee = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const mappedUsers = data.map((u) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        dob: u.dob || "",
        email: u.email || "",
        phone: u.phone || "",
        role: u.role,
        shift: u.shift || "",
        face_image: u.face_image || null,
      }));
      const userNotAdmin = mappedUsers.filter(u => u.role !== "admin");
      console.log("Fetched users:", userNotAdmin);
      setUsers(userNotAdmin);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShifts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/shifts`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setShifts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    FetchEmployee();
    fetchShifts();
  }, []);

  return (
    <>
      <div style={Styles.header}>
        <h1 style={Styles.title}>
          <Users2 /> QUẢN LÝ NHÂN VIÊN
        </h1>
        <div style={Styles.actions}>
          <input
            placeholder="Tìm theo tên, ngày sinh, email, SĐT"
            style={Styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={Styles.filterSelect}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Tất Cả</option>
            <option value="ADMIN">Quản Trị Viên</option>
            <option value="EMPLOYEE">Nhân Viên</option>
          </select>
          <div style={Styles.rightActions}>
            <button style={Styles.btnPrimary} onClick={openAddModal}>
              <Plus size={18} /> Thêm
            </button>
            <button style={Styles.btnExcel}>
              <FileSpreadsheet size={18} /> Xuất Excel
            </button>
            <button style={Styles.btnPdf}>
              <FileText size={18} /> Xuất PDF
            </button>
          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
      {loading && (
                <div style={Styles.loadingOverlay}>
                  <div style={Styles.spinner}></div>
                </div>
              )}
      <div style={Styles.tableWrapper}>
        <div style={Styles.tableScroll} className="custom-scroll">
          <table style={Styles.table}>
            <thead>
              <tr>
                {["STT", "Họ tên", "Ngày sinh", "Email", "SĐT", "Vai trò", "Ca","Khuôn mặt", "Thao tác"].map((h) => (
                  <th key={h} style={Styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredUsers
                .filter(u => u && u.id) // ✅ CHỐNG undefined
                .map((u, i) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedId(u.id)}
                    style={{
                      background: selectedId === u.id ? "#0ca1a120" : "transparent",
                    }}
                  >
                    <td style={Styles.td}>{i + 1}</td>
                    <td style={Styles.td}>{u.name}</td>
                    <td style={Styles.td}>{u.dob || "—"}</td>
                    <td style={Styles.td}>{u.email || "—"}</td>
                    <td style={Styles.td}>{u.phone || "—"}</td>
                    <td style={Styles.td}>
                      {u.role === "admin" ? "Quản trị viên" : "Nhân viên"}
                    </td>
                    <td style={Styles.td}>{u.shift || "—"}</td>
                    {/* <td style={Styles.td}>{u.face_image ? "Có" : "Không"}</td> */}
                    <td style={{ ...Styles.td, fontSize: 18, fontWeight: 700, color: u.face_image ? "#22c55e" : "#ef4444" }}>
                      {u.face_image ? "✓" : "✕"}
                    </td>
                    <td style={Styles.td}>
                      <div style={Styles.actionIcons}>
                        <div
                          style={Styles.iconBoxEdit}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(u);
                          }}
                        >
                          <Pencil size={15} />
                        </div>
                        <div
                          style={Styles.iconBoxDelete}
                          onClick={(e) => {
                            e.stopPropagation();
                            setUsers(prev =>
                              prev.filter(item => item?.id !== u.id)
                            );
                          }}
                        >
                          <Trash2 size={15} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
  </div>
      {showModal && (
        <div style={Styles.modalOverlay}>
          <div style={Styles.modal}>
            <h2 style={Styles.modalTitle}>{editId ? "SỬA NHÂN VIÊN" : "THÊM NHÂN VIÊN"}</h2>

            <div style={Styles.faceBox}>
              <img src={form.face_preview || DEFAULT_FACE} alt="" style={Styles.facePreview} />
              <label style={Styles.uploadBtn}>
                < Upload/> Khuôn Mặt
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  capture="user" // 👈 mở camera nếu có
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setForm({
                      ...form,
                      face_preview: URL.createObjectURL(file),
                      face_file: file,
                    });
                  }}
                />
              </label>
            </div>

            <div style={Styles.formGrid}>
              {[
                ["Họ tên", "name"],
                ["Ngày sinh", "dob", "date"],
                ["Email", "email"],
                ["SĐT", "phone"],
              ].map(([label, key, type]) => (
                <div key={key} style={Styles.formGroup}>
                  <label style={Styles.label}>{label}</label>
                  <input
                    type={type || "text"}
                    className={type === "date" ? "custom-date-input" : ""}
                    style={{
                      ...Styles.formInput,
                      ...(type === "date" ? { color: "#ffffff" } : {}), // giữ màu chữ trắng nếu cần
                    }}
                    value={form[key] || ""}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}

              <div style={Styles.formGroup}>
                <label style={Styles.label}>Vai trò</label>
                <select
                  style={Styles.formInput}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                > 
                  <option value="EMPLOYEE">Nhân Viên</option>
                  <option value="ADMIN">Quản Trị Viên</option>
                </select>
              </div>

              <div style={Styles.formGroup}>
                <label style={Styles.label}>Ca làm việc</label>

                <select
                  style={Styles.formInput}
                  value={form.shift}
                  onChange={(e) =>
                    setForm({ ...form, shift: e.target.value })
                  }
                >
                  {Array.isArray(shifts) && shifts.map(shift => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={Styles.modalActions}>
              <button style={Styles.btnPdf} onClick={() => setShowModal(false)}>
                <X /> Hủy
              </button>
              <button style={Styles.btnPrimary} onClick={handleSave}>
                <Save /> Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeManagement;