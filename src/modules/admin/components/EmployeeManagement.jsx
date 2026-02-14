import React, { useState, useEffect, useRef } from "react";
import { Styles, DEFAULT_FACE, stylesButton, stylesError, stylesForm, styleTable, styleModel } from "../style/Styles";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Camera ,
  Users2,
  FileSpreadsheet,
  Save,
  X
} from "lucide-react";
import { getEmployees, updateEmployee, createEmployee } from "../../../services/EmployeeService";
import { getShifts } from "../../../services/ShiftService";
import { exportEmployeePDF } from "../../../utils/exportPDF";
import * as XLSX from "xlsx";

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
  // ===== WEBCAM =====
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [showCamModal, setShowCamModal] = useState(false);
  const [camStream, setCamStream] = useState(null);

  const openCameraModal = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });

    setCamStream(stream);
    setShowCamModal(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, 100);
  } catch (err) {
    alert("Không thể mở webcam");
  }
};
  const closeCameraModal = () => {
  if (camStream) {
    camStream.getTracks().forEach(track => track.stop());
  }
  setCamStream(null);
  setShowCamModal(false);
};
const captureFromCamera = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  if (!video || !canvas) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  canvas.toBlob((blob) => {
    if (!blob) return;

    const file = new File([blob], "face.jpg", { type: "image/jpeg" });
    const previewUrl = URL.createObjectURL(blob);

    // clear preview cũ
    if (form.face_preview) {
      URL.revokeObjectURL(form.face_preview);
    }

    setForm(prev => ({
      ...prev,
      face_preview: previewUrl,
      face_file: file,
      face_image: false,
    }));

    closeCameraModal();
  }, "image/jpeg");
};

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

  // XUẤT DANH SÁCH NHÂN VIÊN RA EXCEL
  const handleExportExcel = () => {
    if (!filteredUsers.length) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    const tableData = filteredUsers.map((u, index) => ({
      STT: index + 1,
      "Họ và tên": u.name,
      "Ngày sinh": u.dob || "",
      Email: u.email || "",
      "Số điện thoại": u.phone || "",
      "Chức vụ": u.role === "admin" ? "Quản trị viên" : "Nhân viên",
      "Ca làm việc": u.shift_name || "",
      "Khuôn mặt": u.face_image ? "Đã nhận diện" : "Chưa nhận diện",
    }));

    // 👉 Sheet bắt đầu từ A1 (KHÔNG tiêu đề)
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    /* ===== HEADER (DÒNG 1) ===== */
    for (let C = range.s.c; C <= range.e.c; C++) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
      const cell = worksheet[headerCell];
      if (!cell) continue;

      cell.s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }

    /* ===== BODY (KẺ BẢNG) ===== */
    for (let R = 1; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const addr = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[addr];
        if (!cell) continue;

        cell.s = {
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
          alignment: {
            vertical: "center",
            horizontal: [0, 2, 7].includes(C) ? "center" : "left",
          },
        };
      }
    }

    /* ===== WIDTH ===== */
    worksheet["!cols"] = [
      { wch: 6 },   // STT
      { wch: 24 },  // Họ tên
      { wch: 14 },  // Ngày sinh
      { wch: 28 },  // Email
      { wch: 16 },  // SĐT
      { wch: 16 },  // Chức vụ
      { wch: 18 },  // Ca
      { wch: 18 },  // Khuôn mặt
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NhanVien");
    XLSX.writeFile(workbook, "Danh_sach_nhan_vien.xlsx");
  };

  return (
    <>
      {/*------------------------ HEADER ------------------------*/}
      <div style={Styles.header}>
        {/*------------------------ TITLE ------------------------*/}
        <h1 style={Styles.title}>
          <Users2 /> QUẢN LÝ NHÂN VIÊN
        </h1>
        
        <div style={Styles.actions}>
          {/*------------------------ SEARCH ------------------------*/}
          <input
            placeholder="Tìm theo tên, ngày sinh, email, SĐT"
            style={stylesForm.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/*------------------------ FILLTER ------------------------*/}
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
            {/*------------------------ ADD ------------------------*/}
            <button style={stylesButton.btnAdd} onClick={openAddModal}>
              <Plus size={18} /> Thêm
            </button>
            {/*------------------------ EXPORT EXCEL ------------------------*/}
            <button style={stylesButton.btnExcel} onClick={handleExportExcel}>
              <FileSpreadsheet size={18} /> Xuất Excel
            </button>
            {/*------------------------ EXPORT PDF ------------------------*/}
            <button
            style={stylesButton.btnPdf}
            onClick={() => exportEmployeePDF(users)}
          >
            <FileText size={18} /> Xuất PDF
          </button>

          </div>
        </div>
      </div>
      {/*------------------------ CONTENT ------------------------*/}
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
                  {["#", "Họ Và Tên", "Ngày Sinh", "Email", "SĐT", "Chức Vụ", "Ca","Khuôn Mặt", "Thao Tác"].map((h) => (
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
      {/*------------------------ MODAL------------------------*/}
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
                  <button
                    type="button"
                    onClick={openCameraModal}
                    style={{
                      ...stylesButton.uploadBtn,
                      background: "none",
                      border: "1px dashed #9ca3af",
                      borderRadius: 8,
                      justifyContent: "center",
                      width: "50%",
                    }}
                  >
                    <Camera size={18} />Chụp ảnh khuôn mặt
                  </button>
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

      {/*------------------------ MODAL WEBCAM------------------------*/}
      {showCamModal && (
        <div style={styleModel.modalOverlay}>
          <div style={{ ...styleModel.modal, width: 360 }}>
            <h3 style={{ textAlign: "center", marginBottom: 12 }}>
              <Camera size={18} /> Chụp ảnh khuôn mặt
            </h3>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                borderRadius: 12,
                border: "2px solid #0ca1a1",
              }}
            />

            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "center",
                
                gap: 12,
              }}
            >
              <button onClick={closeCameraModal} style={stylesButton.btnCancel}>
                <X size={18} /> Hủy
              </button>
              <button onClick={captureFromCamera} style={stylesButton.btnSave}>
                <Camera size={18} /> Chụp
              </button>
              
            </div>

            <canvas ref={canvasRef} hidden />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeManagement;