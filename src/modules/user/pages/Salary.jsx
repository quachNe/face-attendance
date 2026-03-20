import React, { useState, useEffect } from "react";
import { getSalaryOnlyEmployee } from "../../../services/SalaryService";
import { useAuth } from "../../../context/AuthContext";

const PayrollStatus = () => {
  const { user } = useAuth();

  const [payrolls, setPayrolls] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [monthFilter, setMonthFilter] = useState("all");
  const [monthOptions, setMonthOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayroll = async () => {
    try {
      setLoading(true);

      let params = {};
      if (monthFilter !== "all") {
        const [month, year] = monthFilter.split("-");
        params = { month, year };
      }

      const { data } = await getSalaryOnlyEmployee(params);

      setPayrolls(data);

      if (monthFilter === "all") {
        const options = data.map((p) => ({
          value: `${p.month}-${p.year}`,
          label: `Tháng ${p.month} năm ${p.year}`,
        }));
        setMonthOptions(options);
      }

      if (monthFilter !== "all" && data.length > 0) {
        setSelectedPayroll(data[0]);
      } else {
        setSelectedPayroll(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy payroll:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchPayroll();
  }, [user, monthFilter]);

  return (
    <div style={styles.card}>
      {/* FILTER */}
      <div style={styles.filterBar}>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">Tất cả</option>
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* ================= LIST ================= */}
      {monthFilter === "all" && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thCenter}>STT</th>
                <th style={styles.thLeft}>Nội dung</th>
                <th style={styles.thRight}>Lương cơ bản</th>
                <th style={styles.thRight}>Khấu trừ</th>
                <th style={styles.thRight}>Thưởng OT</th>
                <th style={styles.thRight}>Thực nhận</th>
                <th style={styles.thCenter}>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={styles.center}>Đang tải...</td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.center}>Không có dữ liệu</td>
                </tr>
              ) : (
                payrolls.map((p, index) => (
                  <tr key={p.id} style={styles.row}>
                    <td style={styles.tdCenter}>{index + 1}</td>

                    <td style={styles.tdLeft}>
                      Lương tháng {p.month} năm {p.year}
                    </td>

                    <td style={styles.tdRight}>
                      {p.base_salary.toLocaleString()}
                    </td>

                    <td style={{ ...styles.tdRight, ...styles.red }}>
                      {(-p.deductions).toLocaleString()}
                    </td>

                    <td style={styles.tdRight}>
                      {p.overtime_bonus.toLocaleString()}
                    </td>

                    <td style={{ ...styles.tdRight, ...styles.greenBold }}>
                      {p.net_salary.toLocaleString()}
                    </td>

                    <td style={styles.tdCenter}>
                      {p.is_paid ? (
                        <span style={styles.paid}>Đã chốt</span>
                      ) : (
                        <span style={styles.unpaid}>Chưa chốt</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= DETAIL ================= */}
      {monthFilter !== "all" && selectedPayroll && (
        <div style={styles.detailBox}>
          <h3 style={styles.title}>
            Lương tháng {selectedPayroll.month}/{selectedPayroll.year}
          </h3>

          <table style={styles.table}>
            <tbody>
              <Row label="Lương cơ bản" value={selectedPayroll.base_salary} />
              <Row label="Ngày công chuẩn" value={selectedPayroll.total_working_days} />
              <Row label="Ngày làm thực tế" value={selectedPayroll.actual_work_days} />
              <Row label="Nghỉ phép" value={selectedPayroll.leave_days} />
              <Row label="Vắng không phép" value={selectedPayroll.absent_days} />

              <Row label="Đi trễ (phút)" value={selectedPayroll.total_late_minutes} />
              <Row label="Về sớm (phút)" value={selectedPayroll.total_early_minutes} />
              <Row label="Tăng ca (phút)" value={selectedPayroll.total_overtime_minutes} />

              <Row label="Khấu trừ" value={selectedPayroll.deductions} style={styles.red} />
              <Row label="Thưởng OT" value={selectedPayroll.overtime_bonus} />
              <Row label="Thực nhận" value={selectedPayroll.net_salary} style={styles.greenBold} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value, style = {} }) => (
  <tr>
    <td style={styles.tdLeft}>{label}</td>
    <td style={{ ...styles.tdRight, ...style }}>
      {typeof value === "number" ? value.toLocaleString() : value}
    </td>
  </tr>
);

export default PayrollStatus;

const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  title: {
    marginBottom: "15px",
    color: "#1e293b",
  },

  center: {
    textAlign: "center",
    padding: "20px",
  },

  detailBox: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "10px",
  },

  paid: {
    background: "#dcfce7",
    color: "#166534",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
  },

  unpaid: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
  },

  greenBold: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  red: {
    color: "#dc2626",
  },

  filterBar: {
    marginBottom: "20px",
  },

  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  tableWrapper: {
    maxHeight: "calc(100vh - 370px)",
    overflowY: "auto",
    borderRadius: "12px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  row: {
    background: "#fff",
  },

  thCenter: {
    textAlign: "center",
    padding: "12px",
    background: "#1b3e88",
    color: "white",
  },

  thLeft: {
    textAlign: "left",
    padding: "12px",
    background: "#1b3e88",
    color: "white",
  },

  thRight: {
    textAlign: "right",
    padding: "12px",
    background: "#1b3e88",
    color: "white",
  },

  tdCenter: {
    textAlign: "center",
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },

  tdLeft: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },

  tdRight: {
    textAlign: "right",
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontVariantNumeric: "tabular-nums", // fix lệch số
  },
};