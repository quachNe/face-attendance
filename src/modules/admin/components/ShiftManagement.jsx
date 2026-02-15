import React, { useEffect, useState } from "react";
import {
  styleModel,
  Styles,
  stylesButton,
  stylesError,
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

const timePickerStyles = `
  .custom-time-input {
    color-scheme: dark !important;
  }

  .custom-time-input::-webkit-calendar-picker-indicator {
    filter: brightness(0) invert(1) !important;
    opacity: 1 !important;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
`;

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [animate, setAnimate] = useState(false);
  const [shake, setShake] = useState(false);

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
      <style>{timePickerStyles}</style>

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
      {showModal && (
        <div
          style={styleModel.modalOverlay}
          onClick={handleCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              ...styleModel.modal,
              width: 450,
              padding: "30px 24px",
              transform: animate
                ? "translateY(0)"
                : "translateY(-40px)",
              opacity: animate ? 1 : 0,
              transition: "all 0.25s ease",
              animation: shake ? "shake 0.35s" : "none",
            }}
          >
            <h2 style={styleModel.modalTitle}>
              {editId
                ? "SỬA CA LÀM VIỆC"
                : "THÊM CA LÀM VIỆC"}
            </h2>

            <div style={styleModel.formGridShift}>
              <div style={styleModel.formGroupShift}>
                <label style={styleModel.label}>
                  Tên Ca <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  style={styleModel.formInput}
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div style={styleModel.formGroupShift}>
                <label style={styleModel.label}>
                  Giờ Bắt Đầu{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="time"
                  className="custom-time-input"
                  style={styleModel.formInput}
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      start_time: e.target.value,
                    })
                  }
                />
              </div>

              <div style={styleModel.formGroupShift}>
                <label style={styleModel.label}>
                  Giờ Kết Thúc{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="time"
                  className="custom-time-input"
                  style={styleModel.formInput}
                  value={form.end_time}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      end_time: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {error && (
              <p style={stylesError.message}>{error}</p>
            )}

            <div style={stylesButton.actions}>
              <button
                style={stylesButton.btnCancel}
                onClick={handleCloseModal}
              >
                <X /> Hủy
              </button>

              <button
                style={stylesButton.btnSave}
                onClick={handleSave}
              >
                <Save /> Lưu
              </button>
            </div>
          </div>

          <style>
            {`
              @keyframes shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(-6px); }
                50% { transform: translateX(6px); }
                75% { transform: translateX(-4px); }
                100% { transform: translateX(0); }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default ShiftManagement;