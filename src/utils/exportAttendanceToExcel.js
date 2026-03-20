import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
const statusMapping = {
    PRESENT: "Có mặt",
    ON_LEAVE: "Nghỉ phép",
    ABSENT: "Vắng",
};
export const exportAttendanceToExcel = (records, date) => {

    // Không có dữ liệu
    if (!records || records.length === 0) {
        toast.warning("Không có bản ghi nào để xuất");
        return;
    }

    // format giờ
    const formatTime = (time) => {
        if (!time) return "-";
        return time; // 🔥 trả thẳng luôn
    };

    // map dữ liệu
    const dataExport = records.map((r, index) => ({
        STT: index + 1,
        "Tên nhân viên": r.name,
        "Giờ vào": formatTime(r.time),
        "Giờ ra": formatTime(r.checkout),
        "Đi trễ (phút)": r.late_minutes || 0,
        "Về sớm (phút)": r.early_leave_minutes || 0,
        "Tăng ca (phút)": r.overtime_minutes || 0,
        "Trạng thái": statusMapping[r.status] || r.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExport);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    const file = new Blob([excelBuffer], {
        type: "application/octet-stream",
    });

    saveAs(file, `attendance_${date}.xlsx`);
};