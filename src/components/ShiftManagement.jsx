import React, { useEffect, useState } from "react";
import { Styles } from "./Styles";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Clock
} from "lucide-react";

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


  const handleSave = async () => {
    // Validate cơ bản
    if (!form.name || !form.start_time || !form.end_time) {
      alert("Vui lòng nhập đầy đủ thông tin ca làm việc");
      return;
    }

    const isEdit = !!editId;
    const url = isEdit
      ? `http://localhost:5000/api/shifts/${editId}`
      : `http://localhost:5000/api/shifts`;

    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      alert("Lưu ca làm việc thất bại");
      return;
    }

    const data = await response.json();
    const normalizeTime = (t) => {
      if (!t) return "";
      return t.length > 5 ? t.slice(0, 5) : t; // "08:00:00" → "08:00"
    };
    if (isEdit) {
      setShifts(shifts.map(s => (s.id === editId ? data : s)));
    } else {
      setShifts([...shifts, data]);
    }

    setShowModal(false);
    setEditId(null);
    // fetchShifts();
  };



  const filteredShifts = shifts.filter((u) => {
    const keyword = search.toLowerCase().trim();

    const matchSearch =
      !keyword ||
      u.name?.toLowerCase().includes(keyword);

    return matchSearch;
  });

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
      console.log("Fetched shifts:", data);
    } catch (error) {
      console.error(error);
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
            style={Styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div style={Styles.rightActions}>
            <button style={Styles.btnPrimary} onClick={openAddModal}><Plus size={18}/>Thêm</button>
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
                  {["STT", "Tên Ca", "Giờ Bắt Đầu", "Giờ Kết Thúc", "Thao tác"].map((h) => (
                    <th key={h} style={Styles.th}>{h}</th>
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
                    <td style={Styles.td}>{i + 1}</td>
                    <td style={Styles.td}>{s.name}</td>
                    <td style={Styles.td}>{s.start_time|| "—"}</td>
                    <td style={Styles.td}>{s.end_time || "—"}</td>
                    <td style={Styles.td}>
                      <div style={Styles.actionIcons}>
                        <div
                          style={Styles.iconBoxEdit}
                          onClick={(e) => { e.stopPropagation(); openEditModal(s); }}
                        >
                          <Pencil size={15} />
                        </div>
                        <div
                          style={Styles.iconBoxDelete}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShifts(shifts.filter((item) => item.id !== s.id));
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
            <h2 style={Styles.modalTitle}>
              {editId ? "SỬA CA LÀM VIỆC" : "THÊM CA LÀM VIỆC"}
            </h2>

            <div style={Styles.formGridShift}>
              {/* Tên ca */}
              <div style={Styles.formGroupShift}>
                <label style={Styles.label}>Tên Ca</label>
                <input
                  type="text"
                  style={Styles.formInput}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Giờ bắt đầu */}
              <div style={Styles.formGroupShift}>
                <label style={Styles.label}>Giờ Bắt Đầu</label>
                <input
                  type="time"
                  className="custom-time-input"
                  style={{
                    ...Styles.formInput,
                  }}
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({ ...form, start_time: e.target.value })
                  }
                />
              </div>

              {/* Giờ kết thúc */}
              <div style={Styles.formGroupShift}>
                <label style={Styles.label}>Giờ Kết Thúc</label>
                <input
                  type="time"
                  className="custom-time-input"
                  style={{
                    ...Styles.formInput,
                  }}
                  value={form.end_time}
                  onChange={(e) =>
                    setForm({ ...form, end_time: e.target.value })
                  }
                />
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

export default ShiftManagement;