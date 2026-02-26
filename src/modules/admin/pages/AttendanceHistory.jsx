import React, { useEffect, useState } from "react";
import { AiOutlineFileExcel } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { Styles, stylesButton, stylesForm, styleTable, datePickerStyles} from "../style/Styles";
import { ClipboardCheck } from "lucide-react";
import { getLogs } from "../../../services/AttendanceService";
import AttendanceTable from "../components/table/AttendanceTable";
const AttendanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  // LẤY DANH SÁCH ĐIỂM DANH THEO NGÀY
  const fetchAttendanceRecords = async () => {
    try {
      const { data } = await getLogs({ date });
      setRecords(data);
      console.log("Attendance records:", data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, [date]);

  return (
    <>
      <style>{datePickerStyles}</style>
      <div style={Styles.header}>
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
        {/* <form autoComplete="off"> */}
          <div style={Styles.actions}>
            <input placeholder="Tìm kiếm nhân viên..." style={stylesForm.searchInput} />
              <input type="date" 
                style={stylesForm.filterSelect} 
                className={"custom-date-input"} 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            
            <div style={Styles.rightActions}>
              <button style={stylesButton.btnExcel}><AiOutlineFileExcel  size={18}/> Xuất Excel</button>
              <button style={stylesButton.btnPdf}><FiFileText size={18}/> Xuất PDF</button>
            </div>
          </div>
        {/* </form> */}
      </div>
      <AttendanceTable
        loading={loading}
        records={records}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </>
  );
};

export default AttendanceHistory;