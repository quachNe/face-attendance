import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getEmployeePayroll } from "../services/SalaryService";

export const exportSalaryExcel = async (month, year) => {

  try {

    const { data } = await getEmployeePayroll(month, year);

    const employees = (data || []).filter(
      (u) => u.employee_code !== "admin"
    );
    if (employees.length === 0) {
      toast.warning("Không có bản ghi bảng lương để xuất");
      return;
    }
    const rows = employees.map((e, index) => ({
      STT: index + 1,
      "Mã nhân viên": e.employee_code,
      "Tên nhân viên": e.name,
      "Chức vụ": e.role === "admin" ? "Quản trị viên" : "Nhân viên",

      "Ngày công tiêu chuẩn": e.total_working_days || 0,
      "Ngày đi làm": e.actual_work_days || 0,
      "Vắng phép": e.leave_days || 0,
      "Vắng không phép": e.absent_days || 0,

      "Phút đi trễ": e.total_late_minutes || 0,
      "Phút về sớm": e.total_early_minutes || 0,
      "Phút tăng ca": e.overtime_minutes || 0,

      "Lương cơ bản": e.base_salary || 0,
      "Thưởng OT": e.overtime_bonus || 0,
      "Khấu trừ": e.deductions || 0,
      "Thực lãnh": e.net_salary || 0,

      "Trạng thái": e.is_paid ? "Đã thanh toán" : "Chưa thanh toán"
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BangLuong");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, `bang-luong-${month}-${year}.xlsx`);

  } catch (err) {
    console.error(err);
  }

};