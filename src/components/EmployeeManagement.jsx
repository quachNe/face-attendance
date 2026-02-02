import React, { useState, useEffect } from "react";
import { Styles, DEFAULT_FACE, stylesButton, stylesError, stylesForm, styleTable, styleModel } from "./Styles";
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
import { getEmployees, updateEmployee, createEmployee } from "../services/EmployeeService";
import { getShifts } from "../services/ShiftService";
import { exportEmployeePDF } from "../utils/exportPDF";

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

// // Inject CSS một lần duy nhất khi component mount
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
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoverIcon, setHoverIcon] = useState({
    id: null,
    type: null,
  });

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

  //  MỞ MODEL THÊM NHÂN VIÊN
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

  //  MỞ MODEL SỬA NHÂN VIÊN
  const openEditModal = (u) => {
    if (!u || !u.id) return;
    setEditId(u.id);
    setForm({
      ...u,
      username: u.username,
      role : u.role == "admin" ? "ADMIN" : "EMPLOYEE",
      shift: u.shift_id,
      face_preview: null,
      face_file: null,
      face_image: !!u.face_image,
    });
    setShowModal(true);
  };

  // TẠO USERNAME TỰ ĐỘNG THEO DẠNG NVYYYYXXXX (YYYY: Năm hiện tại, XXXX: Số thứ tự)
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

  // CHUYỂN FILE ẢNH THÀNH BASE64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    }
  );

  // TẠO MẬT KHẨU TỪ NGÀY SINH THEO ĐỊNH DẠNG DDMMYYYY
  const generatePassword = (dob) => {
    if (!dob) return "";
    const d = new Date(dob);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };

  // LƯU THÔNG TIN NHÂN VIÊN (THÊM MỚI HOẶC SỬA)
  const handleSave = async () => {
    if (!form.name || !form.dob || !form.email || !form.phone) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    let imageBase64 = null;
    if (form.face_file) {
      imageBase64 = await fileToBase64(form.face_file);
    }

    // SỬA THÔNG TIN NHÂN VIÊN
    if (editId) {
      const payload = {
        name: form.name,
        dob: form.dob,
        email: form.email,
        phone: form.phone,
        role: form.role,
        shift: form.shift,
        image: imageBase64,
      };

      try {
        const {data} = await updateEmployee(editId, payload);
        if (!data.success) {
          alert(data.message || "Lỗi cập nhật nhân viên");
          return;
        }

        // update lại state FE
        setUsers(users.map(u =>
          u.id === editId ? data.user : u
        ));
        setShowModal(false);
        fetchEmployee();
      } catch (err) {
        console.error(err);
      }

      return;
    }

    // THÊM MỚI NHÂN VIÊN
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
      shift: form.shift,
      image: imageBase64,
    };

    try {
      const {data} = await createEmployee(payload);
      if (!data.success) {
        alert(data.message || "Lỗi tạo nhân viên");
        return;
      }
      
      await fetchEmployee();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // LỌC NHÂN VIÊN THEO TỪ KHÓA VÀ VAI TRÒ
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

  // LẤY DANH SÁCH NHÂN VIÊN TỪ API
  const fetchEmployee = async () => {
    try {
      const {data} = await getEmployees();
      const mappedUsers = data.map((u) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        dob: u.dob || "",
        email: u.email || "",
        phone: u.phone || "",
        role: u.role,
        shift_id: u.shift_id || null,
        shift_name: u.shift || "",
        face_image: u.face_image || null,
      }));
      const userNotAdmin = mappedUsers.filter(
        u => u.role !== "admin"
      );
      setUsers(userNotAdmin);
      console.log("Fetched users:", userNotAdmin);
    } catch (error) {
      console.error(error);
    }
  };

  // LẤY DANH SÁCH CA LÀM VIỆC TỪ API
  const fetchShifts = async () => {
    try {
      const {data} = await getShifts();
      setShifts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // GỌI APU KHI MOUNT
  useEffect(() => {
    fetchEmployee();
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
            style={stylesForm.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={stylesForm.filterSelect}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Tất Cả</option>
            <option value="ADMIN">Quản Trị Viên</option>
            <option value="EMPLOYEE">Nhân Viên</option>
          </select>
          <div style={Styles.rightActions}>
            <button style={stylesButton.btnAdd} onClick={openAddModal}>
              <Plus size={18} /> Thêm
            </button>
            <button style={stylesButton.btnExcel}>
              <FileSpreadsheet size={18} /> Xuất Excel
            </button>
            <button
            style={stylesButton.btnPdf}
            onClick={() => exportEmployeePDF(users)}
          >
            <FileText size={18} /> Xuất PDF
          </button>

          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        {loading && (
          <div style={styleTable.loadingOverlay}>
            <div style={styleTable.spinner}></div>
          </div>
        )}
        <div style={styleTable.tableWrapper}>
          <div style={styleTable.tableScroll} className="custom-scroll">
            <table style={styleTable.table}>
              <thead>
                <tr>
                  {["STT", "Họ tên", "Ngày sinh", "Email", "SĐT", "Vai trò", "Ca","Khuôn mặt", "Thao tác"].map((h) => (
                    <th key={h} style={styleTable.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!loading && filteredUsers
                  .filter(u => u && u.id)
                  .map((u, i) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedId(u.id)}
                      style={{
                        background: selectedId === u.id ? "#0ca1a120" : "transparent",
                      }}
                    >
                      <td style={styleTable.td}>{i + 1}</td>
                      <td style={styleTable.td}>{u.name}</td>
                      <td style={styleTable.td}>{u.dob || "—"}</td>
                      <td style={styleTable.td}>{u.email || "—"}</td>
                      <td style={styleTable.td}>{u.phone || "—"}</td>
                      <td style={styleTable.td}>
                        {u.role === "admin" ? "Quản trị viên" : "Nhân viên"}
                      </td>
                      <td style={styleTable.td}>{u.shift_name || "—"}</td>
                      <td style={{ ...styleTable.td, fontSize: 18, fontWeight: 700, color: u.face_image ? "#22c55e" : "#ef4444" }}>
                        {u.face_image ? "✓" : "✕"}
                      </td>
                      <td style={styleTable.td}>
                        <div style={stylesButton.actionIcons}>
                          {/* EDIT */}
                          <div
                            style={{
                              ...stylesButton.iconBoxEdit,
                              ...stylesButton.iconBoxBase,
                              ...(hoverIcon.id === u.id &&
                                hoverIcon.type === "edit" &&
                                stylesButton.iconBoxEditHover),
                            }}
                            onMouseEnter={() => setHoverIcon({ id: u.id, type: "edit" })}
                            onMouseLeave={() => setHoverIcon({ id: null, type: null })}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(u);
                            }}
                          >
                            <Pencil size={15} />
                          </div>

                          {/* DELETE */}
                          <div
                            style={{
                              ...stylesButton.iconBoxDelete,
                              ...stylesButton.iconBoxBase,
                              ...(hoverIcon.id === u.id &&
                                hoverIcon.type === "delete" &&
                                stylesButton.iconBoxDeleteHover),
                            }}
                            onMouseEnter={() => setHoverIcon({ id: u.id, type: "delete" })}
                            onMouseLeave={() => setHoverIcon({ id: null, type: null })}
                            onClick={(e) => {
                              e.stopPropagation();
                              setUsers(prev => prev.filter(item => item?.id !== u.id));
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
        <div style={styleModel.modalOverlay}>
          <div style={styleModel.modal}>
            <h2 style={styleModel.modalTitle}>{editId ? "SỬA NHÂN VIÊN" : "THÊM NHÂN VIÊN"}</h2>

            <div style={styleModel.faceBox}>
  <div style={{ position: "relative" }}>
    <img
      src={form.face_preview ? form.face_preview : DEFAULT_FACE}
      alt=""
      style={styleModel.facePreview}
    />

    {/* BADGE trạng thái */}
    <div
      style={{
        position: "absolute",
        bottom: 6,
        right: 6,
        background: form.face_image ? "#2e7d32" : "#e53935",
        color: "#fff",
        fontSize: 11,
        padding: "2px 6px",
        borderRadius: 6,
        fontWeight: 600,
        width: "max-content",
      }}
    >
      {form.face_image ? "Đã Nhận Diện" : "Chưa Nhận Diện"}
    </div>
  </div>

  <label style={stylesButton.uploadBtn}>
    <Upload /> Chọn khuôn mặt
    <input
      hidden
      type="file"
      accept="image/*"
      capture="user"
      onChange={(e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Clear preview cũ để tránh memory leak
        if (form.face_preview) {
          URL.revokeObjectURL(form.face_preview);
        }

        const previewUrl = URL.createObjectURL(file);

        setForm(prev => ({
          ...prev,
          face_preview: previewUrl, // CHỈ có khi upload mới
          face_file: file,
          face_image: false, // ảnh mới => chưa nhận diện
        }));
      }}
    />
  </label>
</div>

            <div style={styleModel.formGrid}>
              {[
                ["Họ tên", "name"],
                ["Ngày sinh", "dob", "date"],
                ["Email", "email", "email"],
                ["SĐT", "phone", "tel"],
              ].map(([label, key, type]) => (
                <div key={key} style={styleModel.formGroup}>
                  <label style={styleModel.label}>{label}<span style={{ color: "red" }}> *</span></label>
                  <input
                    type={type || "text"}
                    inputMode={key === "phone" ? "numeric" : undefined}
                    pattern={key === "phone" ? "[0-9]*" : undefined}
                    maxLength={key === "phone" ? 11 : undefined}
                    className={type === "date" ? "custom-date-input" : ""}
                    style={{
                      ...styleModel.formInput,
                      ...(type === "date" ? { color: "#ffffff" } : {}),
                    }}
                    value={form[key] || ""}
                    onChange={(e) => {
                      let value = e.target.value;

                      // chỉ cho nhập số nếu là phone
                      if (key === "phone") {
                        value = value.replace(/\D/g, "");
                      }

                      setForm({ ...form, [key]: value });
                    }}
                  />
                </div>
              ))}

              <div style={styleModel.formGroup}>
                <label style={styleModel.label}>Vai trò <span style={{ color: "red" }}>*</span></label>
                <select
                  style={styleModel.formInput}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                > 
                  <option value="EMPLOYEE">Nhân Viên</option>
                  <option value="ADMIN">Quản Trị Viên</option>
                </select>
              </div>

              <div style={styleModel.formGroup}>
                <label style={styleModel.label}>Ca làm việc <span style={{ color: "red" }}>*</span></label>
                <select
                  style={styleModel.formInput}
                  value={form.shift || ""}
                  onChange={(e) =>
                    setForm({ ...form, shift: Number(e.target.value) })
                  }
                >
                  {shifts.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* ERROR */}
            {error && (
              <p style={stylesError.message}>
                {error}
              </p>
            )}

            {/* ACTION */}
            <div style={stylesButton.actions}>
              <button style={stylesButton.btnCancel} onClick={() =>  {setShowModal(false); setError("")}}>
                <X /> Hủy
              </button>
              <button style={stylesButton.btnSave} onClick={handleSave}>
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