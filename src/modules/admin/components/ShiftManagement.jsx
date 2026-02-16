import React, { useEffect, useState } from "react";
import {
  Styles,
  stylesButton,
  stylesForm,
  styleTable,
} from "../style/Styles";

import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Clock,
} from "lucide-react";

import {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
} from "../../../services/ShiftService";
import ShiftModal from "./ShiftModal";


const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    start_time: "",
    end_time: "",
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
    setEditId(null);
    setForm({ name: "", start_time: "", end_time: "" });
    setShowModal(true);
    setTimeout(() => setAnimate(true), 10);
  };

  const openEditModal = (s) => {
    setEditId(s.id);
    setForm({
      name: s.name || "",
      start_time: s.start_time || "",
      end_time: s.end_time || "",
    });
    setShowModal(true);
    setTimeout(() => setAnimate(true), 10);
  };

  /* ================= CLOSE MODAL ================= */

  const handleCloseModal = () => {
    setAnimate(false);
    setTimeout(() => {
      setShowModal(false);
      setError("");
    }, 250);
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!form.name || !form.start_time || !form.end_time) {
      setError("Vui lòng nhập đầy đủ thông tin");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    try {
      if (editId) {
        await updateShift(editId, form);
      } else {
        await createShift(form);
      }

      await fetchShifts();

      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError("Lưu ca làm việc thất bại");
      setShake(true);
      setTimeout(() => setShake(false), 400);
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
        <h1 style={Styles.title}>
          <Clock /> QUẢN LÝ CA LÀM VIỆC
        </h1>

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
      </div>

      {/* ================= TABLE ================= */}
      <div style={{ position: "relative" }}>
        {loading && (
          <div style={styleTable.loadingOverlay}>
            <div style={styleTable.spinner}></div>
          </div>
        )}

        <div style={styleTable.tableWrapper}>
          <div style={styleTable.tableScroll}>
            <table style={styleTable.table}>
              <thead>
                <tr>
                  {["#", "Tên Ca", "Giờ Bắt Đầu", "Giờ Kết Thúc", "Thao Tác"].map(
                    (h) => (
                      <th key={h} style={styleTable.th}>
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {!loading &&
                  filteredShifts.map((s, i) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      style={{
                        background:
                          selectedId === s.id
                            ? "#0ca1a120"
                            : "transparent",
                      }}
                    >
                      <td style={styleTable.td}>{i + 1}</td>
                      <td style={styleTable.td}>{s.name}</td>
                      <td style={styleTable.td}>
                        {s.start_time || "—"}
                      </td>
                      <td style={styleTable.td}>
                        {s.end_time || "—"}
                      </td>
                      <td style={styleTable.td}>
                        <div style={stylesButton.actionIcons}>
                          <div
                            style={{
                              ...stylesButton.iconBase,
                              ...stylesButton.iconBoxEdit,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(s);
                            }}
                          >
                            <Pencil size={15} />
                          </div>

                          <div
                            style={{
                              ...stylesButton.iconBase,
                              ...stylesButton.iconBoxDelete,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteShift(s.id);
                              fetchShifts();
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

      {/* ================= MODAL ================= */}
      <ShiftModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setError("");
        }}
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