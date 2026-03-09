import React, { useEffect, useState } from "react";
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
  CartesianGrid,
} from "recharts";
import { getAttendanceChart } from "../../../../services/StatisficalService";

/* ================= COLORS ================= */

const COLORS = {
  onTime: "#22c55e",
  late: "#ef4444",
  ot: "#38bdf8",
  leave: "#facc15",
  absent: "#a855f7",
};

/* ================= DEFAULT PIE ================= */

const DEFAULT_PIE = [
  { name: "Đúng giờ", value: 0 },
  { name: "Đi trễ", value: 0 },
  { name: "Tăng ca", value: 0 },
  { name: "Nghỉ phép", value: 0 },
  { name: "Vắng", value: 0 },
];

/* ================= COMPONENT ================= */

const StatisticalChart = () => {

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState(DEFAULT_PIE);

  /* ================= FETCH DATA ================= */

  useEffect(() => {

    const fetchData = async () => {

      try {

        const res = await getAttendanceChart(month);

        /* ========= LINE DATA ========= */

        const normalizedLine = res.data.line.map((d) => ({
          day: d.day,
          onTime: d.onTime ?? 0,
          late: d.late ?? 0,
          ot: d.ot ?? 0,
          leave: d.leave ?? 0,
          absent: d.absent ?? 0,
        }));

        setLineData(normalizedLine);

        /* ========= PIE DATA ========= */

        const pieMap = {
          "Đúng giờ": 0,
          "Đi trễ": 0,
          "Tăng ca": 0,
          "Nghỉ phép": 0,
          "Vắng": 0,
        };

        if (res.data.pie) {
          res.data.pie.forEach((item) => {
            pieMap[item.name] = item.value ?? 0;
          });
        }

        const normalizedPie = [
          { name: "Đúng giờ", value: pieMap["Đúng giờ"] },
          { name: "Đi trễ", value: pieMap["Đi trễ"] },
          { name: "Tăng ca", value: pieMap["Tăng ca"] },
          { name: "Nghỉ phép", value: pieMap["Nghỉ phép"] },
          { name: "Vắng", value: pieMap["Vắng"] },
        ];

        setPieData(normalizedPie);

      } catch (err) {
        console.error("Chart error:", err);
      }

    };

    fetchData();

  }, [month]);

  /* ================= TOTAL ================= */

  const total = pieData.reduce((sum, i) => sum + i.value, 0);

  /* ================= RENDER ================= */

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

        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#e5e7eb",
          }}
        >
          📊 THỐNG KÊ ĐIỂM DANH THEO THÁNG
        </div>

        <div style={{ position: "relative" }}>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{
              width: 170,
              height: 38,
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "6px 12px",
              cursor: "pointer",
              colorScheme: "dark",
              color: "transparent",
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
            {`Tháng ${month.slice(5)} năm ${month.slice(0, 4)}`}
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

        {/* ================= LINE CHART ================= */}

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
              fontSize: 15,
              fontWeight: 600,
              color: "#cbd5f5",
              marginBottom: 20,
            }}
          >
            Biểu đồ đường - Số lượng theo ngày
          </div>

          <ResponsiveContainer width="100%" height={350}>

            <LineChart data={lineData}>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />

              <Tooltip
                labelFormatter={(value) => `Ngày ${value}`}
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #334155",
                  borderRadius: 10,
                }}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="onTime"
                stroke={COLORS.onTime}
                strokeWidth={3}
                name="Đúng giờ"
              />

              <Line
                type="monotone"
                dataKey="late"
                stroke={COLORS.late}
                strokeWidth={3}
                strokeDasharray="6 4"
                name="Đi trễ"
              />

              <Line
                type="monotone"
                dataKey="ot"
                stroke={COLORS.ot}
                strokeWidth={3}
                strokeDasharray="2 4"
                name="Tăng ca"
              />

              <Line
                type="monotone"
                dataKey="leave"
                stroke={COLORS.leave}
                strokeWidth={3}
                strokeDasharray="10 4"
                name="Nghỉ phép"
              />

              <Line
                type="monotone"
                dataKey="absent"
                stroke={COLORS.absent}
                strokeWidth={3}
                strokeDasharray="4 4"
                name="Vắng"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* ================= PIE CHART ================= */}

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
            Tỷ lệ chấm công trong tháng
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>

              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                label={(entry) => entry.name}
              >

                {pieData.map((entry, index) => {

                  const colors = Object.values(COLORS);

                  return (
                    <Cell
                      key={index}
                      fill={colors[index % colors.length]}
                    />
                  );

                })}

              </Pie>

              <Tooltip
                formatter={(value) => {

                  const percent =
                    total === 0
                      ? 0
                      : ((value / total) * 100).toFixed(1);

                  return [`${value} (${percent}%)`, "Số lượng"];

                }}
              />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default StatisticalChart;