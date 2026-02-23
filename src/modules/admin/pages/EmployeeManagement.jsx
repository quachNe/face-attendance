import React, { useState, useEffect } from "react";
import { Styles, stylesButton, stylesForm, styleTable, tooltipStyle} from "../style/Styles";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Users2,
  FileSpreadsheet,
  ScanFace, 
  CameraOff 
} from "lucide-react";
import { getEmployees, updateEmployee, createEmployee } from "../../../services/EmployeeService";
import { getShifts } from "../../../services/ShiftService";
import { exportEmployeePDF } from "../../../utils/exportPDF";
import * as XLSX from "xlsx";
import EmployeeModal from "../components/modal/EmployeeModal"
import { toast } from "react-toastify"

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
  const [initialForm, setInitialForm] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    dob: "",
    email: "",
    phone: "",
    role: "",
    shift_id: "",
    face_preview: null,
    face_file: null,
  });

  //  MỞ MODEL THÊM NHÂN VIÊN
  const openAddModal = () => {
    setEditId(null);

    const emptyForm = {
      name: "",
      username: "",
      password: "",
      dob: "",
      email: "",
      phone: "",
      role: "",
      shift_id: "",
      face_preview: null,
      face_file: null,
    };

    setForm(emptyForm);
    setInitialForm(emptyForm);
    setShowModal(true);
  };

  //  MỞ MODEL SỬA NHÂN VIÊN
  const openEditModal = (u) => {
    if (!u || !u.id) return;

    const editForm = {
      ...u,
      role: u.role === "admin" ? "ADMIN" : "EMPLOYEE",
      shift_id: u.shift_id,
      face_preview: null,
      face_file: null,
      face_image: !!u.face_image,
    };

    setEditId(u.id);
    setForm(editForm);
    setInitialForm(editForm);
    setShowModal(true);
  };

  const handleReset = () => {
    if (!initialForm) return;

    setForm(initialForm);
    setError("");
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

  // TẠO MẬT KHẨU TỪ NGÀY SINH THEO ĐỊNH DẠNG NVYYYYXXXX
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
    if (!form.name || !form.dob || !form.email || !form.phone || !form.role || !form.shift_id) {
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
        shift_id: form.shift_id,
        image: imageBase64,
      };

      try {
        const {data} = await updateEmployee(editId, payload);
        if (!data.success) {
          toast.success(data.message || "Lỗi cập nhật nhân viên");
          return;
        }

        // update lại state FE
        setUsers(users.map(u =>
          u.id === editId ? data.user : u
        ));
        setShowModal(false);
        toast.success("Cập nhật nhân viên thành công");
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
      shift_id: form.shift_id,
      image: imageBase64,
    };

    try {
      const {data} = await createEmployee(payload);
      if (!data.success) {
        toast(data.message || "Lỗi tạo nhân viên");
        return;
      }
      
      await fetchEmployee();
      setShowModal(false);
      toast.success("Thêm nhân viên thành công");
      setError("");
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
        shift_name: u.shift_name || "",
        face_image: u.face_image || null,
      }));
      const userNotRootAdmin = mappedUsers.filter(
        u => u.username !== "admin"
      );
      setUsers(userNotRootAdmin);
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
        <h1
          style={{
            ...Styles.title,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Users2 />
          QUẢN LÝ NHÂN VIÊN
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
              <option value="admin">Quản Trị Viên</option>
              <option value="employee">Nhân Viên</option>
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
                        cursor: "pointer",
                      }}
                    >
                      <td style={styleTable.td}>{i + 1}</td>
                      <td style={styleTable.td}>{u.name}</td>
                      <td style={styleTable.td}>{u.dob || "—"}</td>
                      <td style={styleTable.td}>{u.email || "—"}</td>
                      <td style={styleTable.td}>{u.phone || "—"}</td>
                      <td style={styleTable.td}> {u.role === "admin" ? "Quản trị viên" : "Nhân viên"} </td>
                      <td style={styleTable.td}>{u.shift_name || "—"}</td>
                      <td style={{ ...styleTable.td, fontSize: 18, fontWeight: 700, color: u.face_image ? "#22c55e" : "#ef4444" }}>
                        {u.face_image ? <ScanFace size={18} color="#22c55e" /> : <CameraOff size={18} color="#ef4444" />}
                      </td>
                      <td style={styleTable.td}>
                        <div style={stylesButton.actionIcons}>
                            {/* EDIT */}
                            <div style={tooltipStyle.wrapper}>
                              <div
                                style={{
                                  ...stylesButton.iconBoxEdit,
                                  ...stylesButton.iconBoxBase,
                                  ...(hoverIcon.id === u.id &&
                                    hoverIcon.type === "edit" && stylesButton.iconBoxEditHover),
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
                              {hoverIcon.id === u.id && hoverIcon.type === "edit" && (
                                <div style={tooltipStyle.tooltip}>
                                  Chỉnh sửa
                                  <div style={tooltipStyle.arrow} />
                                </div>
                              )}
                          </div>
                          <div style={tooltipStyle.wrapper}>
                            {/* DELETE */}
                            <div
                              style={{
                                ...stylesButton.iconBoxDelete,
                                ...stylesButton.iconBoxBase,
                                ...(hoverIcon.id === u.id &&
                                  hoverIcon.type === "delete" && stylesButton.iconBoxDeleteHover),
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
                            {hoverIcon.id === u.id && hoverIcon.type === "delete" && (
                              <div style={tooltipStyle.tooltip}>
                                Xóa
                                <div style={tooltipStyle.arrow} />
                              </div>
                            )}
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
      <EmployeeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        onReset={handleReset}
        form={form}
        setForm={setForm}
        editId={editId}
        shifts={shifts}
        error={error}
        setError={setError}
      />
    </>
  );
};

export default EmployeeManagement;