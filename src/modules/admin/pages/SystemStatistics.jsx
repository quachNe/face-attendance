import React from "react";
import { Styles, DEFAULT_FACE } from "../style/Styles";
import { BarChart3 } from "lucide-react";

const cardStyle = {
  background: "#020617",
  borderRadius: 16,
  border: "1px solid #1e293b",
  padding: 20,
};

const SystemStatistics = () => {
  return (
    <>  
        {/* HEADER */}
        <div style={Styles.header}>
          <h1 style={Styles.title}>
            <BarChart3 /> THỐNG KÊ HỆ THỐNG
          </h1>
        </div>

        {/* KPI */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {[
            ["TỔNG NHÂN VIÊN", "2700"],
            ["HIỆN DIỆN", "100"],
            ["VẮNG MẶT", "1300"],
          ].map(([label, value]) => (
            <div key={label} style={{ ...cardStyle, textAlign: "center" }}>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>{label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#67e8f9" }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* TOP EMPLOYEES */}
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 12, color: "#67e8f9" }}>
            NHÂN VIÊN NỔI BẬT
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            {mockStats.topEmployees.map((u) => (
              <div
                key={u.name}
                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <img
                  src={DEFAULT_FACE}
                  alt=""
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    border: "2px solid #22d3ee",
                    marginBottom: 8,
                  }}
                />
                <span style={{ fontWeight: 600 }}>{u.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHARTS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* BAR CHART */}
          <div style={cardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 12, color: "#67e8f9" }}>
              XU HƯỚNG ĐIỂM DANH TUẦN
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
              {mockStats.weeklyTrend.map((v, i) => (
                <div
                  key={i}
                  style={{
                    width: 18,
                    height: v,
                    borderRadius: 6,
                    background: "linear-gradient(180deg,#22d3ee,#0ca1a1)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* DONUT */}
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{ fontWeight: 700, marginBottom: 12, color: "#67e8f9" }}>
              TỶ LỆ ĐÚNG GIỜ
            </div>

            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                margin: "auto",
                background: `conic-gradient(#22d3ee ${mockStats.onTimeRate * 3.6}deg,#1e293b 0)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {mockStats.onTimeRate}%
            </div>
          </div>
        </div>

        {/* ACTIVITIES */}
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 12, color: "#67e8f9" }}>
            HOẠT ĐỘNG GẦN ĐÂY
          </div>

          {mockStats.activities.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #1e293b",
              }}
            >
              <span style={{ fontWeight: 600 }}>{a.name}</span>
              <span style={{ color: "#94a3b8" }}>{a.note}</span>
            </div>
          ))}
        </div>
    </>
  );
};

export default SystemStatistics;

const mockStats = {
  totalEmployees: 2700,
  present: 100,
  absent: 1300,
  onTimeRate: 85,
  weeklyTrend: [30, 45, 20, 55, 40, 60, 65],
  topEmployees: [
    { name: "Nhật Thắng" },
    { name: "Nhi Xn" },
    { name: "Ba Thắng" },
  ],
  activities: [
    { name: "Đội nợ tiền chẵn", note: "132 giờ trúng thưởng" },
    { name: "Tài nợ tiền chẵn", note: "508 giờ trúng thưởng" },
    { name: "Hìn nợ tài cả", note: "201 giờ đột xuất" },
  ],
};