import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getEmployeePayroll } from "../services/SalaryService";

export const exportSalaryPDF = async (month, year) => {

  const doc = new jsPDF("p", "mm", "a4");

  /* ================= LOAD FONT ================= */
  const loadFont = async (url) => {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    return btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
  };

  const robotoRegular = await loadFont("/fonts/Roboto-Regular.ttf");
  const robotoBold = await loadFont("/fonts/Roboto-Bold.ttf");

  doc.addFileToVFS("Roboto-Regular.ttf", robotoRegular);
  doc.addFileToVFS("Roboto-Bold.ttf", robotoBold);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

  const { data } = await getEmployeePayroll(month, year);

  const employees = (data || []).filter(
    (u) => u.employee_code !== "admin"
  );

  const formatMoney = (v = 0) =>
    new Intl.NumberFormat("vi-VN").format(Math.round(v)) + " ₫";

  /* ================= COLOR ================= */
  const primary = [12, 128, 148];
  const dark = [32, 41, 54];
  const gray = [120, 128, 138];
  const light = [248, 250, 252];

  employees.forEach((e, index) => {

    if (index !== 0) doc.addPage();

    /* ================= HEADER ================= */

    const logoX = 12;
    const logoY = 10;

    doc.setFont("Roboto", "bold");
    doc.setFontSize(44);
    doc.setTextColor(...primary);
    doc.text("N", logoX, logoY + 22);

    const textX = logoX + 12;

    doc.setFontSize(17);
    doc.setTextColor(...dark);
    doc.text("NANO TECH", textX, logoY + 17);

    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text("Attendance System", textX, logoY + 22);

    doc.setFontSize(9);
    doc.text(
      `Ngày in: ${new Date().toLocaleDateString("vi-VN")}`,
      200,
      logoY + 18,
      { align: "right" }
    );

    doc.setDrawColor(220);
    doc.line(10, 42, 200, 42);

    /* ================= TITLE ================= */

    doc.setFont("Roboto", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...dark);
    doc.text(`PHIẾU LƯƠNG THÁNG ${month}/${year}`, 105, 55, {
      align: "center",
    });

    /* ================= INFO ================= */

    doc.setFont("Roboto", "normal");
    doc.setFontSize(11);

    doc.text(`Tên nhân viên: ${e.name}`, 14, 70);
    doc.text(`Mã nhân viên: ${e.employee_code}`, 14, 77);
    doc.text(
      `Chức vụ: ${e.role === "admin" ? "Quản trị viên" : "Nhân viên"}`,
      14,
      84
    );

    /* ================= TABLE ================= */

    autoTable(doc, {
      startY: 95,

      head: [["Thông tin", "Giá trị"]],

      body: [
        ["Lương cơ bản", formatMoney(e.base_salary)],
        ["Số ngày làm việc", e.total_working_days],
        ["Phút đi trễ", e.total_late_minutes],
        ["Phút về sớm", e.total_early_minutes],
        ["Phút tăng ca", e.total_overtime_minutes],
        ["Thưởng tăng ca", formatMoney(e.overtime_bonus)],
        ["Khấu trừ", formatMoney(e.deductions)],
        ["Thực lãnh", formatMoney(e.net_salary)],
      ],

      styles: {
        font: "Roboto",
        fontSize: 11,
        cellPadding: 6,
      },

      headStyles: {
        fillColor: primary,
        textColor: 255,
      },

      alternateRowStyles: {
        fillColor: light,
      },

      columnStyles: {
        0: { cellWidth: 90 },
        1: { halign: "right" },
      },
    });

    /* ================= SIGN ================= */

    const finalY = doc.lastAutoTable.finalY + 20;

    doc.text("Kế toán", 40, finalY);
    doc.text("Nhân viên", 160, finalY, { align: "right" });

    /* ================= FOOTER ================= */

    doc.setFontSize(9);
    doc.setTextColor(150);

    const page = doc.internal.getCurrentPageInfo().pageNumber;
    const total = doc.internal.getNumberOfPages();

    doc.text("NANO TECH – Attendance System", 10, 290);
    doc.text(`Trang ${page} / ${total}`, 200, 290, { align: "right" });

  });

  doc.save(`bang-luong-${month}-${year}.pdf`);
};