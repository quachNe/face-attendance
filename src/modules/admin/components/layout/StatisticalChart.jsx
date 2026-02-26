import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ================= MOCK DATA ================= */
const attendanceByMonth = {
  "2025-01": [
    { day: 1, onTime: 85, late: 12 },
    { day: 2, onTime: 90, late: 8 },
    { day: 3, onTime: 88, late: 10 },
    { day: 4, onTime: 92, late: 6 },
    { day: 5, onTime: 95, late: 5 },
    { day: 6, onTime: 80, late: 15 },
    { day: 7, onTime: 87, late: 11 },
  ],
  "2025-02": [
    { day: 1, onTime: 78, late: 18 },
    { day: 2, onTime: 82, late: 14 },
    { day: 3, onTime: 85, late: 12 },
    { day: 4, onTime: 88, late: 10 },
    { day: 5, onTime: 90, late: 9 },
    { day: 6, onTime: 92, late: 8 },
    { day: 7, onTime: 94, late: 6 },
  ],
};

/* ================= COLORS ================= */
const COLORS = {
  onTime: "#22c55e", // xanh
  late: "#ef4444", // đỏ
};

const glowGreen = "drop-shadow(0 0 4px rgba(34,197,94,0.5))";
const glowRed = "drop-shadow(0 0 4px rgba(239,68,68,0.5))";

const StatisticalChart = () => {
  const [month, setMonth] = useState("2025-01");

  const lineData = attendanceByMonth[month];

  const totalOnTime = lineData.reduce((sum, i) => sum + i.onTime, 0);
  const totalLate = lineData.reduce((sum, i) => sum + i.late, 0);

  const pieData = [
    { name: "Đúng giờ", value: totalOnTime },
    { name: "Đi trễ", value: totalLate },
  ];
  const formatVN = (value) => {
    if (!value) return "";
    const [year, m] = value.split("-");
    return `Tháng ${m} năm ${year}`;
  };
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #020617, #030712)",
        borderRadius: 18,
        border: "1px solid #1e293b",
        padding: 20,
        marginBottom: 24,
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e5e7eb" }}>
          📊 THỐNG KÊ ĐIỂM DANH THEO THÁNG
        </div>

        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{
              width: 170,
              height: 38,
              background: "#020617",
              color: "transparent", // ẩn text gốc
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "6px 12px",
              fontSize: 13,
              cursor: "pointer",
              colorScheme: "dark",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#e5e7eb",
              pointerEvents: "none",
              fontSize: 13,
            }}
          >
            {month && `Tháng ${month.slice(5)} năm ${month.slice(0, 4)}`}
          </div>
        </div>
      </div>
      {/* ================= CONTENT ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
        }}
      >
        {/* ===== LINE CHART ===== */}
        <div
          style={{
            background: "#020617",
            borderRadius: 14,
            border: "1px solid #1e293b",
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#cbd5f5",
              marginBottom: 8,
            }}
          >
            Biểu đồ đi làm theo ngày
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lineData}>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  color: "#e5e7eb",
                }}
              />

              {/* ===== GLOW LAYER (ON TIME) ===== */}
              <Line
                type="monotone"
                dataKey="onTime"
                stroke={COLORS.onTime}
                strokeWidth={5}
                dot={false}
                isAnimationActive={false}
                style={{
                  opacity: 0.25,
                  filter: "blur(4px)",
                }}
              />

              {/* ===== MAIN LINE (ON TIME) ===== */}
              <Line
                type="monotone"
                dataKey="onTime"
                stroke={COLORS.onTime}
                strokeWidth={1.8}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: COLORS.onTime,
                  stroke: "#020617",
                  strokeWidth: 2,
                  style: {
                    filter: "drop-shadow(0 0 6px rgba(34,197,94,0.8))",
                  },
                }}
              />

              {/* ===== GLOW LAYER (LATE) ===== */}
              <Line
                type="monotone"
                dataKey="late"
                stroke={COLORS.late}
                strokeWidth={5}
                dot={false}
                isAnimationActive={false}
                style={{
                  opacity: 0.25,
                  filter: "blur(4px)",
                }}
              />

              {/* ===== MAIN LINE (LATE) ===== */}
              <Line
                type="monotone"
                dataKey="late"
                stroke={COLORS.late}
                strokeWidth={1.8}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: COLORS.late,
                  stroke: "#020617",
                  strokeWidth: 2,
                  style: {
                    filter: "drop-shadow(0 0 6px rgba(239,68,68,0.8))",
                  },
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ===== PIE CHART ===== */}
        <div
          style={{
            background: "#020617",
            borderRadius: 14,
            border: "1px solid #1e293b",
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#cbd5f5",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Tỷ lệ trong tháng
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={68}
                outerRadius={92}
                paddingAngle={4}
                dataKey="value"
              >
                <Cell fill={COLORS.onTime} />
                <Cell fill={COLORS.late} />
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticalChart;