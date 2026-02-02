import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportEmployeePDF = async (users) => {
  if (!users || users.length === 0) return;

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

  /* ================= COLOR ================= */
  const primary = [12, 128, 148];
  const dark = [32, 41, 54];
  const gray = [120, 128, 138];
  const light = [248, 250, 252];

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
    `Ngày in: ${new Date().toLocaleDateString("vi-VN")} ${new Date().toLocaleTimeString(
      "vi-VN",
      { hour: "2-digit", minute: "2-digit" }
    )}`,
    200,
    logoY + 18,
    { align: "right" }
  );

  doc.setDrawColor(220);
  doc.setLineWidth(0.4);
  doc.line(10, 42, 200, 42);

  /* ================= TITLE ================= */
  doc.setFont("Roboto", "bold");
  doc.setFontSize(19);
  doc.setTextColor(...dark);
  doc.text("DANH SÁCH NHÂN VIÊN", 105, 55, { align: "center" });

  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.text(`Danh sách này gồm: ${users.length} nhân viên`, 105, 62, {
    align: "center",
  });

  /* ================= TABLE ================= */
  autoTable(doc, {
    startY: 72,
    theme: "striped",

    head: [
      [
        "#",
        "Họ và Tên",
        "Email",
        "SĐT",
        "Chức Vụ",
        "Ca",
        "Khuôn mặt",
      ],
    ],

    body: users.map((u, i) => {
      const hasFace = !!u.face_image; // ← đổi field nếu backend khác

      return [
        i + 1,
        u.name || "-",
        u.email || "-",
        u.phone || "-",
        u.role === "ADMIN" ? "Quản trị viên" : "Nhân viên",
        u.shift_name || "—",
        hasFace ? "Đã có" : "Chưa có",
      ];
    }),

    styles: {
      font: "Roboto",
      fontSize: 9.5,
      textColor: [40, 40, 40],
      cellPadding: { top: 6, bottom: 6, left: 4, right: 4 },
      valign: "middle",
    },

    headStyles: {
      fillColor: [245, 248, 250],
      textColor: dark,
      fontStyle: "bold",
      halign: "center",
      lineWidth: 0,
    },

    alternateRowStyles: {
      fillColor: light,
    },

    columnStyles: {
      0: { cellWidth: 10},
      1: { cellWidth: 35 },
      2: { cellWidth: 44 },
      3: { cellWidth: 27},
      4: { cellWidth: 24},
      5: { cellWidth: 20},
      6: { cellWidth: 20},
    },

    margin: { left: 10, right: 10 },

    didDrawPage: () => {
      const page = doc.internal.getCurrentPageInfo().pageNumber;
      const total = doc.internal.getNumberOfPages();

      doc.setFontSize(8.5);
      doc.setTextColor(150);
      doc.text("NANO TECH – Attendance System", 10, 290);
      doc.text(`Trang ${page} / ${total}`, 200, 290, { align: "right" });
    },
  });

  /* ================= SAVE ================= */
  const today = new Date().toISOString().slice(0, 10);
  doc.save(`employee-list_${today}.pdf`);
};

export const exportAttendancePDF = async (users) => {
  if (!users || users.length === 0) return;

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

  /* ================= COLOR ================= */
  const primary = [12, 128, 148];
  const dark = [32, 41, 54];
  const gray = [120, 128, 138];
  const light = [248, 250, 252];

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
    `Ngày in: ${new Date().toLocaleDateString("vi-VN")} ${new Date().toLocaleTimeString(
      "vi-VN",
      { hour: "2-digit", minute: "2-digit" }
    )}`,
    200,
    logoY + 18,
    { align: "right" }
  );

  doc.setDrawColor(220);
  doc.setLineWidth(0.4);
  doc.line(10, 42, 200, 42);

  /* ================= TITLE ================= */
  doc.setFont("Roboto", "bold");
  doc.setFontSize(19);
  doc.setTextColor(...dark);
  doc.text("DANH SÁCH NHÂN VIÊN", 105, 55, { align: "center" });

  doc.setFont("Roboto", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.text(`Danh sách này gồm: ${users.length} nhân viên`, 105, 62, {
    align: "center",
  });

  /* ================= TABLE ================= */
  autoTable(doc, {
    startY: 72,
    theme: "striped",

    head: [
      [
        "#",
        "Họ và Tên",
        "Giờ điểm danh",
        "Ghi chú",
      ],
    ],

    body: users.map((u, i) => {
      const hasFace = !!u.face_image; // ← đổi field nếu backend khác

      return [
        i + 1,
        u.name || "-",
        u.email || "-",
        u.phone || "-",
        u.role === "ADMIN" ? "Quản trị viên" : "Nhân viên",
        u.shift_name || "—",
        hasFace ? "Đã có" : "Chưa có",
      ];
    }),

    styles: {
      font: "Roboto",
      fontSize: 9.5,
      textColor: [40, 40, 40],
      cellPadding: { top: 6, bottom: 6, left: 4, right: 4 },
      valign: "middle",
    },

    headStyles: {
      fillColor: [245, 248, 250],
      textColor: dark,
      fontStyle: "bold",
      halign: "center",
      lineWidth: 0,
    },

    alternateRowStyles: {
      fillColor: light,
    },

    columnStyles: {
      0: { cellWidth: 10},
      1: { cellWidth: 35 },
      2: { cellWidth: 44 },
      3: { cellWidth: 27},
      4: { cellWidth: 24},
      5: { cellWidth: 20},
      6: { cellWidth: 20},
    },

    margin: { left: 10, right: 10 },

    didDrawPage: () => {
      const page = doc.internal.getCurrentPageInfo().pageNumber;
      const total = doc.internal.getNumberOfPages();

      doc.setFontSize(8.5);
      doc.setTextColor(150);
      doc.text("NANO TECH – Attendance System", 10, 290);
      doc.text(`Trang ${page} / ${total}`, 200, 290, { align: "right" });
    },
  });

  /* ================= SAVE ================= */
  const today = new Date().toISOString().slice(0, 10);
  doc.save(`employee-list_${today}.pdf`);
};