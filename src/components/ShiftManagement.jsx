import React, { useEffect, useState } from "react";
import { styleModel, Styles, stylesButton, stylesError, stylesForm, styleTable } from "./Styles";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Clock
} from "lucide-react";

import {
  getShifts,
  createShift,
  updateShift,
  deleteShift,
} from "../services/ShiftService";

// CSS cập nhật cho icon clock trắng (dùng brightness(0) invert(1) để trắng đậm, rõ)
const timePickerStyles = `
  .custom-time-input {
    color-scheme: dark !important; /* Buộc dark mode cho picker popup */
  }

  /* Icon clock trắng hoàn hảo trên Chrome/Edge/Safari */
  .custom-time-input::-webkit-calendar-picker-indicator {
    filter: brightness(0) invert(1) !important; /* Đen → trắng đậm */
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
  const [hoverIcon, setHoverIcon] = useState({
    id: null,
    type: null,
  });
  const [form, setForm] = useState({
    name: "",
    start_time: "",
    end_time: "",
  });


  const openAddModal = () => {
    setEditId(null);
    setForm({ name: "", start_time: "", end_time: "" });
    setShowModal(true);
  };

  const openEditModal = (s) => {
    setEditId(s.id);
    setForm({
      name: s.name || "",
      start_time: s.start_time || "",
      end_time: s.end_time || "",
    });
    setShowModal(true);
  };

  // LƯU CA LÀM VIỆC (THÊM MỚI HOẶC CẬP NHẬT)
  const handleSave = async () => {
    if (!form.name || !form.start_time || !form.end_time) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      let res;

      if (editId) {
        res = await updateShift(editId, form);
        setShifts(
          shifts.map((s) => (s.id === editId ? res.data : s))
        );
      } else {
        res = await createShift(form);
        setShifts([...shifts, res.data]);
      }

      setShowModal(false);
      setEditId(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Lưu ca làm việc thất bại");
    }
  };




  const filteredShifts = shifts.filter((u) => {
    const keyword = search.toLowerCase().trim();

    const matchSearch =
      !keyword ||
      u.name?.toLowerCase().includes(keyword);

    return matchSearch;
  });

  // LẤY DANH SÁCH CA LÀM VIỆC TỪ API
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

  return (
    <>
      {/* Inject CSS cập nhật */}
      <style>{timePickerStyles}</style>

      <div style={Styles.header}>
        <h1 style={Styles.title}><Clock/>QUẢN LÝ CA LÀM VIỆC</h1>
        <div style={Styles.actions}>
          <input
            placeholder="Tìm theo tên ca làm việc"
            style={stylesForm.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={Styles.rightActions}>
            <button style={stylesButton.btnAdd} onClick={openAddModal}><Plus size={18}/>Thêm</button>
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
                  {["STT", "Tên Ca", "Giờ Bắt Đầu", "Giờ Kết Thúc", "Thao tác"].map((h) => (
                    <th key={h} style={styleTable.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!loading && filteredShifts.map((s, i) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    style={{ background: selectedId === s.id ? "#0ca1a120" : "transparent" }}
                  >
                    <td style={styleTable.td}>{i + 1}</td>
                    <td style={styleTable.td}>{s.name}</td>
                    <td style={styleTable.td}>{s.start_time|| "—"}</td>
                    <td style={styleTable.td}>{s.end_time || "—"}</td>
                    <td style={styleTable.td}>
                      <div style={stylesButton.actionIcons}>
                        {/* EDIT */}
                        <div
                          style={{
                            ...stylesButton.iconBase,
                            ...stylesButton.iconBoxEdit,
                            ...(hoverIcon.id === s.id &&
                              hoverIcon.type === "edit" &&
                              stylesButton.iconBoxEditHover),
                          }}
                          onMouseEnter={() => setHoverIcon({ id: s.id, type: "edit" })}
                          onMouseLeave={() => setHoverIcon({ id: null, type: null })}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(s);
                          }}
                        >
                          <Pencil size={15} />
                        </div>

                        {/* DELETE */}
                        <div
                          style={{
                            ...stylesButton.iconBase,
                            ...stylesButton.iconBoxDelete,
                            ...(hoverIcon.id === s.id &&
                              hoverIcon.type === "delete" &&
                              stylesButton.iconBoxDeleteHover),
                          }}
                          onMouseEnter={() => setHoverIcon({ id: s.id, type: "delete" })}
                          onMouseLeave={() => setHoverIcon({ id: null, type: null })}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShifts(prev => prev.filter(item => item.id !== s.id));
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
            <h2 style={styleModel.modalTitle}>
              {editId ? "SỬA CA LÀM VIỆC" : "THÊM CA LÀM VIỆC"}
            </h2>

            <div style={styleModel.formGridShift}>
              {/* Tên ca */}
              <div style={styleModel.formGroupShift}>
                <label style={styleModel.label}>Tên Ca <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  style={styleModel.formInput}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Giờ bắt đầu */}
              <div style={styleModel.formGroupShift}>
                <label style={styleModel.label}>Giờ Bắt Đầu <span style={{ color: "red" }}>*</span></label>
                <input
                  type="time"
                  className="custom-time-input"
                  style={{
                    ...styleModel.formInput,
                  }}
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({ ...form, start_time: e.target.value })
                  }
                />
              </div>

              {/* Giờ kết thúc */}
              <div style={styleModel.formGroupShift}>
                <label style={styleModel.label}>Giờ Kết Thúc <span style={{ color: "red" }}>*</span></label>
                <input
                  type="time"
                  className="custom-time-input"
                  style={{
                    ...styleModel.formInput,
                  }}
                  value={form.end_time}
                  onChange={(e) =>
                    setForm({ ...form, end_time: e.target.value })
                  }
                />
              </div>
            </div>
            {error && (
              <p style={stylesError.message}>
                {error}
              </p>
            )}
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

export default ShiftManagement;