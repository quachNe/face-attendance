import React from "react";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

/* ================= BASE CARD ================= */
const cardStyle = {
  background: "linear-gradient(180deg, #020617 0%, #030712 100%)",
  borderRadius: 16, // ⬆️ bo tròn hơn chút
  border: "1px solid #1e293b",
  padding: "18px 18px", // ⬆️ padding lớn hơn
  position: "relative",
  overflow: "hidden",
  transition: "all .25s ease",
};

/* ================= KPI DATA ================= */
const kpiItems = [
  {
    label: "TỔNG SỐ NHÂN VIÊN",
    value: 2700,
    icon: <Users size={20} />, // ⬆️ icon lớn hơn
    color: "#67e8f9",
  },
  {
    label: "ĐI LÀM HÔM NAY",
    value: 100,
    icon: <UserCheck size={20} />,
    color: "#4ade80",
  },
  {
    label: "ĐI TRỄ HÔM NAY",
    value: 35,
    icon: <Clock size={20} />,
    color: "#facc15",
  },
  {
    label: "VẮNG MẶT HÔM NAY",
    value: 1300,
    icon: <UserX size={20} />,
    color: "#f87171",
  },
];

const StatisticalCard = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 18, // ⬆️ card thoáng hơn xíu
        marginBottom: 24,
      }}
    >
      {kpiItems.map((item) => (
        <div
          key={item.label}
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = `1px solid ${item.color}55`;
            e.currentTarget.style.boxShadow = `0 12px 30px ${item.color}22`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "1px solid #1e293b";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* TOP LINE */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 2,
              background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
              opacity: 0.85,
            }}
          />

          {/* HEADER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12, // ⬆️ thoáng hơn
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 40, // ⬆️ icon box lớn hơn
                height: 40,
                borderRadius: 12,
                background: `${item.color}1f`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: item.color,
                boxShadow: `inset 0 0 0 1px ${item.color}33`,
              }}
            >
              {item.icon}
            </div>

            <div
              style={{
                fontSize: 15, // ⬆️ tiêu đề to hơn
                fontWeight: 700,
                color: "#e5e7eb",
                letterSpacing: 0.7,
                lineHeight: 1.25,
              }}
            >
              {item.label}
            </div>
          </div>

          {/* VALUE */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 30, // ⬆️ số lớn hơn chút
                fontWeight: 800,
                color: item.color,
                lineHeight: 1,
              }}
            >
              {item.value}
            </span>

            <span
              style={{
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              người
            </span>
          </div>

          {/* GLOW */}
          <div
            style={{
              position: "absolute",
              right: -36,
              bottom: -36,
              width: 110,
              height: 110,
              background: item.color,
              opacity: 0.05,
              filter: "blur(48px)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StatisticalCard;
