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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart3 , Calendar} from "lucide-react";
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

  const [month, setMonth] = useState(new Date());

  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState(DEFAULT_PIE);

  /* ================= FETCH DATA ================= */

  useEffect(() => {

    const fetchData = async () => {

      try {

        const monthStr = month.toISOString().slice(0,7);

        const res = await getAttendanceChart(monthStr);

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
          { name: "Có phép", value: pieMap["Nghỉ phép"] },
          { name: "Không phép", value: pieMap["Vắng"] },
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

        <div style={styles.title}>
          <BarChart3  size={18}/>
            THỐNG KÊ ĐIỂM DANH TRONG THÁNG {month.getMonth()+1} NĂM {month.getFullYear()}
        </div>

        {/* DATE PICKER */}
        
        <div style={styles.yearContainer}>
          <DatePicker
            selected={month}
            onChange={(date) => setMonth(date)}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            maxDate={new Date()}
            popperPlacement="bottom-end"
            popperStrategy="fixed"
            showPopperArrow={false}
            portalId="root"
            customInput={
              <input
                style={{
                  width: 170,
                  height: 38,
                  background: "#020617",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: "6px 12px",
                  cursor: "pointer",
                  color: "#e5e7eb",
                  textAlign: "center",
                }}
              />
            }
          />
          <Calendar size={18} style={styles.calendarIcon} />
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

              <Line type="monotone" dataKey="onTime" stroke={COLORS.onTime} strokeWidth={3} name="Đúng giờ" />
              <Line type="monotone" dataKey="late" stroke={COLORS.late} strokeWidth={3} strokeDasharray="6 4" name="Đi trễ" />
              <Line type="monotone" dataKey="ot" stroke={COLORS.ot} strokeWidth={3} strokeDasharray="2 4" name="Tăng ca" />
              <Line type="monotone" dataKey="leave" stroke={COLORS.leave} strokeWidth={3} strokeDasharray="10 4" name="Có phép" />
              <Line type="monotone" dataKey="absent" stroke={COLORS.absent} strokeWidth={3} strokeDasharray="4 4" name="Không phép" />

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

const styles = {
  yearContainer: {
    width: 160,
    position: "relative",
  },

  calendarIcon: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none"
  },

  title: {
    display: "flex",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
    color: "#e5e7eb",
    gap: 6,
  },
};