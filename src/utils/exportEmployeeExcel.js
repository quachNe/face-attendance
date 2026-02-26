import * as XLSX from "xlsx";

export const exportEmployeeExcel = (users) => {
  if (!users || users.length === 0) {
    alert("Không có dữ liệu để xuất");
    return;
  }

  const tableData = users.map((u, index) => ({
    STT: index + 1,
    "Họ và tên": u.name,
    "Ngày sinh": u.dob || "",
    Email: u.email || "",
    "Số điện thoại": u.phone || "",
    "Chức vụ":
      u.role === "admin" || u.role === "ADMIN"
        ? "Quản trị viên"
        : "Nhân viên",
    "Ca làm việc": u.shift_name || "",
    "Khuôn mặt": u.face_image ? "Đã nhận diện" : "Chưa nhận diện",
  }));

  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  /* ===== HEADER STYLE ===== */
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cellAddr = XLSX.utils.encode_cell({ r: 0, c: C });
    const cell = worksheet[cellAddr];
    if (!cell) continue;

    cell.s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };
  }

  /* ===== BODY STYLE ===== */
  for (let R = 1; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[addr];
      if (!cell) continue;

      cell.s = {
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
        alignment: {
          vertical: "center",
          horizontal: [0, 2, 7].includes(C) ? "center" : "left",
        },
      };
    }
  }

  /* ===== COLUMN WIDTH ===== */
  worksheet["!cols"] = [
    { wch: 6 },   // STT
    { wch: 24 },  // Họ tên
    { wch: 14 },  // Ngày sinh
    { wch: 28 },  // Email
    { wch: 16 },  // SĐT
    { wch: 16 },  // Chức vụ
    { wch: 18 },  // Ca
    { wch: 18 },  // Khuôn mặt
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "NhanVien");

  XLSX.writeFile(workbook, "Danh_sach_nhan_vien.xlsx");
};