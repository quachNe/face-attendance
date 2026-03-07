import React from "react";

const Salary = () => {

  // ===== DỮ LIỆU TĨNH TEST UI =====
  const salary = {
    month: 3,
    year: 2026,
    name: "Nguyễn Văn A",
    position: "Nhân viên IT",
    department: "Phòng Công nghệ",
    base_salary: "12.000.000 đ",
    work_days: 22,
    allowance: "1.000.000 đ",
    bonus: "500.000 đ",
    insurance: "1.200.000 đ",
    tax: "500.000 đ",
    net_salary: "11.800.000 đ",
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          BẢNG LƯƠNG THÁNG {salary.month}/{salary.year}
        </h2>

        {/* THÔNG TIN NHÂN VIÊN */}
        <div style={styles.section}>
          <Row label="Họ tên" value={salary.name} />
          <Row label="Chức vụ" value={salary.position} />
          <Row label="Phòng ban" value={salary.department} />
        </div>

        <div style={styles.divider} />

        {/* THU NHẬP */}
        <div style={styles.section}>
          <Row label="Lương cơ bản" value={salary.base_salary} />
          <Row label="Ngày công" value={salary.work_days} />
          <Row label="Phụ cấp" value={salary.allowance} />
          <Row label="Thưởng" value={salary.bonus} />
        </div>

        <div style={styles.divider} />

        {/* KHẤU TRỪ */}
        <div style={styles.section}>
          <Row label="Bảo hiểm" value={`- ${salary.insurance}`} />
          <Row label="Thuế TNCN" value={`- ${salary.tax}`} />
        </div>

        {/* LƯƠNG THỰC NHẬN */}
        <div style={styles.totalBox}>
          <span>LƯƠNG THỰC NHẬN</span>
          <span>{salary.net_salary}</span>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div style={styles.row}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value}</span>
  </div>
);

export default Salary;

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "#f4f6f9",
  },

  card: {
    background: "#fff",
    padding: "35px",
    borderRadius: "14px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    width: "650px",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#1e293b",
    fontWeight: "700",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px dashed #e2e8f0",
  },

  label: {
    color: "#64748b",
    fontWeight: "500",
  },

  value: {
    fontWeight: "600",
    color: "#0f172a",
  },

  divider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "25px 0",
  },

  totalBox: {
    marginTop: "25px",
    padding: "18px",
    background: "#ecfdf5",
    borderRadius: "10px",
    fontWeight: "700",
    display: "flex",
    justifyContent: "space-between",
    color: "#065f46",
    fontSize: "17px",
  },
};