import React, { useEffect, useState } from "react";
import { Styles, stylesButton, stylesForm, datePickerStyles} from "../style/Styles";
import { ClipboardCheck, RotateCcw, FileText,FileSpreadsheet} from "lucide-react";
import { getLogs } from "../../../services/AttendanceService";
import AttendanceTable from "../components/table/AttendanceTable";
import { exportAttendanceToExcel } from "../../../utils/exportAttendanceToExcel";
const AttendanceHistory = () => {
  /* ================= STATE ================= */
  // Danh sách bản ghi điểm danh lấy từ backend
  const [records, setRecords] = useState([]);

  // Ngày đang được chọn để lọc (mặc định là hôm nay)
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Trạng thái loading khi gọi API
  const [loading, setLoading] = useState(true);

  // ID dòng đang được chọn trong bảng
  const [selectedId, setSelectedId] = useState(null);

  // Từ khóa tìm kiếm theo tên nhân viên
  const [search, setSearch] = useState("");

  const [monthYear, setMonthYear] = useState(
  new Date().toISOString().slice(0, 7)
);
  /* ================= API CALL ================= */
  // Hàm gọi API lấy danh sách điểm danh theo ngày
  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const { data } = await getLogs({ date });
      console.log("DATE:", date);
      console.log("DATA:", data);
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  /* ================= EFFECT ================= */
  // Khi date thay đổi → tự động gọi lại API
  useEffect(() => {
    fetchAttendanceRecords();
  }, [date]);

  /* ================= FILTER ================= */
  const filteredRecords = records.filter((r) => {
    const keyword = search.toLowerCase().trim();

    return (
      !keyword ||
      r.name?.toLowerCase().includes(keyword)
    );
  });

  /* ================= RESET ================= */
  const handleResetFilter = () => {
    setSearch("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  /* ================= UI ================= */
  return (
    <>
      {/* Style riêng cho date picker */}
      <style>{datePickerStyles}</style>
      <div style={Styles.header}>
        {/* ===== TITLE ===== */}
        <h1
          style={{
            ...Styles.title,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ClipboardCheck /> QUẢN LÝ ĐIỂM DANH
        </h1>
        {/* ===== ACTIONS ===== */}
        <div style={Styles.actions}>
          {/* Ô tìm kiếm theo tên */}
          <form autoComplete="off">
            <input
              placeholder="Tìm kiếm nhân viên..."
              style={stylesForm.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          {/* Chọn ngày để lọc */}
          <input type="date" 
            style={stylesForm.filterSelect} 
            className={"custom-date-input"} 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {/* Nút reset bộ lọc */}
          <button
            type="button"
            style={stylesButton.btnReset}
            onClick={handleResetFilter}
          >
            <RotateCcw size={16} />
          </button>
          {/* Nút xuất file */}
          <div style={Styles.rightActions}>
            {/* Xuất Excel */}
            <button
              style={stylesButton.btnExcel}
              onClick={() => exportAttendanceToExcel(filteredRecords, date)}
            >
              <FileSpreadsheet size={18}/> Xuất Excel
            </button>
          </div>
        </div>
      </div>
      {/* ===== TABLE ===== */}
      <AttendanceTable
        loading={loading}
        records={filteredRecords}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </>
  );
};

export default AttendanceHistory;