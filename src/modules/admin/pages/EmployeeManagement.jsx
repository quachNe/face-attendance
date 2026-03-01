import React, { useState, useEffect } from "react";
import { Styles, stylesButton, stylesForm, styleTable, tooltipStyle} from "../style/Styles";
import {
  Plus,
  FileText,
  Users2,
  FileSpreadsheet,
} from "lucide-react";
import { getEmployees, updateEmployee, createEmployee } from "../../../services/EmployeeService";
import { getShifts } from "../../../services/ShiftService";
import { exportEmployeePDF } from "../../../utils/exportEmployeePDF";
import { exportEmployeeExcel } from "../../../utils/exportEmployeeExcel";
import EmployeeModal from "../components/modal/EmployeeModal"
import CameraModal from "../components/modal/CameraModal";
import { toast } from "react-toastify"
import EmployeeTable from "../components/table/EmployeeTable";

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
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraUser, setCameraUser] = useState(null);
  
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

  const openCameraModal = (u) => {
    if (!u || !u.id) return;

    setCameraUser(u);
    setShowCameraModal(true);
  };

  //  MỞ MODEL SỬA NHÂN VIÊN
  const openEditModal = (u) => {
    if (!u || !u.id) return;

    const editForm = {
      ...u,
      role: u.role,
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
              <button 
                style={stylesButton.btnExcel} 
                onClick={() => exportEmployeeExcel(filteredUsers)}
              >
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
      <EmployeeTable
        users={filteredUsers}
        loading={loading}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        hoverIcon={hoverIcon}
        setHoverIcon={setHoverIcon}
        openEditModal={openEditModal}
        openCameraModal={openCameraModal}
        setUsers={setUsers}
      />
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

      <CameraModal
        show={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        userId={cameraUser?.id}
      />
    </>
  );
};

export default EmployeeManagement;