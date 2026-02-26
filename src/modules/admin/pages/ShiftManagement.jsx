import React, { useEffect, useState } from "react";
import {
  Styles,
  stylesButton,
  stylesForm,
  styleTable,
  tooltipStyle
} from "../style/Styles";

import {
  Plus,
  Pencil,
  Trash2,
  Clock,
} from "lucide-react";

import {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
} from "../../../services/ShiftService";
import ShiftModal from "../components/modal/ShiftModal";
import { toast } from "react-toastify";
import ShiftTable from "../components/table/ShiftTable";


const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [initialForm, setInitialForm] = useState(null);
  const [form, setForm] = useState({
    name: "",
    start_time: "",
    end_time: "",
  });
  const [hoverIcon, setHoverIcon] = useState({
    id: null,
    type: null,
  });

  /* ================= FETCH ================= */

  const fetchShifts = async () => {
    try {
      const res = await getShifts();
      setShifts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  /* ================= ESC CLOSE ================= */

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showModal) {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  /* ================= OPEN MODAL ================= */

  const openAddModal = () => {
    const empty = { name: "", start_time: "", end_time: "" };

    setEditId(null);
    setForm(empty);
    setInitialForm(empty);
    setShowModal(true);
  };

  const openEditModal = (s) => {
    const data = {
      name: s.name || "",
      start_time: s.start_time || "",
      end_time: s.end_time || "",
    };

    setEditId(s.id);
    setForm(data);
    setInitialForm(data);
    setShowModal(true);
  };

  const handleResetForm = () => {
    if (editId) {
      setForm(initialForm);
    } else {
      setForm({ name: "", start_time: "", end_time: "" });
    }

    setError("");
  };
  /* ================= CLOSE MODAL ================= */

  const handleCloseModal = () => {
    setTimeout(() => {
      setShowModal(false);
      setError("");
    }, 250);
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!form.name || !form.start_time || !form.end_time) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      if (editId) {
        await updateShift(editId, form);
        toast.success("Cập nhật ca làm việc thành công");
      } else {
        await createShift(form);
        toast.success("Thêm ca làm việc thành công");
      }

      await fetchShifts();

      handleCloseModal();
    } catch (err) {
      console.error(err);
      toast.error("Lưu ca làm việc thất bại");
    }
  };

  /* ================= FILTER ================= */

  const filteredShifts = shifts.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <div style={Styles.header}>
        <h1
          style={{
            ...Styles.title,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Clock /> QUẢN LÝ CA LÀM VIỆC
        </h1>
        {/* <form autoComplete="off"> */}
          <div style={Styles.actions}>
            <input
              placeholder="Tìm theo tên ca làm việc"
              style={stylesForm.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div style={Styles.rightActions}>
              <button
                style={stylesButton.btnAdd}
                onClick={openAddModal}
              >
                <Plus size={18} /> Thêm
              </button>
            </div>
          </div>
        {/* </form> */}
      </div>

      {/* ================= TABLE ================= */}
      <ShiftTable
        loading={loading}
        shifts={filteredShifts}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        hoverIcon={hoverIcon}
        setHoverIcon={setHoverIcon}
        openEditModal={openEditModal}
        // handleDelete={handleDelete}
      />

      {/* ================= MODAL ================= */}
      <ShiftModal
        show={showModal}
        onClose={handleCloseModal}
        onReset={handleResetForm}
        onSave={handleSave}
        editId={editId}
        form={form}
        setForm={setForm}
        error={error}
      />
    </>
  );
};

export default ShiftManagement;