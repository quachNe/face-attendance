import React, { useEffect, useState } from "react";
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
import { getSalaryChart } from "../../../../services/StatisficalService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DollarSign, Calendar} from "lucide-react";
import {formatMoney} from "../../../../utils/formatMoney"

/* ================= COMPONENT ================= */

const MonthlySalaryChart = () => {

  const [salaryData, setSalaryData] = useState([]);
  const [year, setYear] = useState(new Date());

  useEffect(() => {
    fetchSalary();
  }, [year]);

  const fetchSalary = async () => {

    try {

      const selectedYear = year.getFullYear();

      const { data } = await getSalaryChart(selectedYear);

      const monthly = data.monthly_breakdown || [];

      const chartData = monthly.map((v, i) => ({
        month: String(i + 1).padStart(2, "0"),
        total: v,
      }));

      setSalaryData(chartData);

    } catch (err) {
      console.error("Load salary chart error:", err);
    }
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}

      <div style={styles.header}>

        <div style={styles.title}>
          <DollarSign size={18}/>
          TỔNG LƯƠNG THEO NĂM {year.getFullYear()}
        </div>

        {/* YEAR PICKER */}

        <div style={styles.yearContainer}>
          <DatePicker
            selected={year}
            onChange={(date) => setYear(date)}
            showYearPicker
            dateFormat="yyyy"
            showPopperArrow={false}
            customInput={<input style={styles.yearPicker} />}
          />

          <Calendar size={18} style={styles.calendarIcon} />
        </div>

      </div>

      {/* CHART */}

      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={salaryData}>

          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

          <XAxis
            dataKey="month"
            stroke="#64748b"
            tickFormatter={(m) => `T${m}`}
          />

          <YAxis
            stroke="#64748b"
            tickFormatter={(v) => v / 1000000 + "M"}
          />

          <Tooltip
            formatter={(value) => formatMoney(value)}
            contentStyle={styles.tooltip}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Tổng lương"
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default MonthlySalaryChart;


/* ================= STYLES ================= */

const styles = {

  container: {
    background: "linear-gradient(180deg,#020617,#030712)",
    borderRadius: 18,
    border: "1px solid #1e293b",
    padding: 20,
    marginBottom: 50,
    position: "relative",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    display: "flex",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
    color: "#e5e7eb",
    gap: 6,
  },

  yearContainer: {
    width: 160,
    position: "relative",
  },

  yearPicker: {
    width: "100%",
    padding: "6px 30px 6px 10px",
    borderRadius: 10,
    border: "1px solid #3b4a6b",
    background: "transparent",
    color: "#fff",
    textAlign: "center"
  },

  calendarIcon: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none"
  },

  tooltip: {
    marginTop:10,
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: 10,
    color: "#e5e7eb",
  },

};