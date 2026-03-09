import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

/* ================= DATA TĨNH ================= */

const salaryData = [
  { month: "01", total: 120000000 },
  { month: "02", total: 135000000 },
  { month: "03", total: 142000000 },
  { month: "04", total: 150000000 },
  { month: "05", total: 148000000 },
  { month: "06", total: 160000000 },
];

/* ================= FORMAT TIỀN ================= */

const formatMoney = (value) =>
  value.toLocaleString("vi-VN") + " đ";

/* ================= COMPONENT ================= */

const MonthlySalaryChart = () => {

  return (
    <div
      style={{
        background: "linear-gradient(180deg,#020617,#030712)",
        borderRadius: 18,
        border: "1px solid #1e293b",
        padding: 20,
        marginBottom: 50,
      }}
    >

      {/* HEADER */}

      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#e5e7eb",
          marginBottom: 16,
        }}
      >
        💰 TỔNG LƯƠNG THEO THÁNG
      </div>

      {/* CHART */}

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salaryData}>

          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

          <XAxis
            dataKey="month"
            stroke="#64748b"
            tickFormatter={(m) => `T${m}`}
          />

          <YAxis
            stroke="#64748b"
            tickFormatter={(v) => (v / 1000000) + "M"}
          />

          <Tooltip
            formatter={(value) => formatMoney(value)}
            contentStyle={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: 10,
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Tổng lương"
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default MonthlySalaryChart;