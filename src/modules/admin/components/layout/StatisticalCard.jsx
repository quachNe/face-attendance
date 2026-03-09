import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  LogOut,
  FileText
} from "lucide-react";
import { getStats } from "../../../../services/StatisficalService";

/* ================= BASE CARD ================= */
const cardStyle = {
  background: "linear-gradient(180deg, #020617 0%, #030712 100%)",
  borderRadius: 14,
  border: "1px solid #1e293b",
  padding: "14px 16px", // nhỏ hơn
  position: "relative",
  overflow: "hidden",
  transition: "all .25s ease",
};

const StatisticalCard = () => {
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    early: 0,
    leave: 0,
    absent: 0
  });

  const fetchStats = async () => {
    try {
      const { data } = await getStats();

      setStats({
        total: data.total_employees,
        present: data.present_today,
        late: data.late_today,
        early: data.early_leave_today,
        leave: data.leave_today,
        absent: data.absent_no_permission
      });

    } catch (err) {
      console.error("Lỗi lấy thống kê:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /* ================= KPI DATA ================= */

  const Items = [
    {
      label: "TỔNG NHÂN VIÊN",
      value: stats.total,
      icon: <Users size={18} />,
      color: "#67e8f9",
    },
    {
      label: "ĐI LÀM HÔM NAY",
      value: stats.present,
      icon: <UserCheck size={18} />,
      color: "#4ade80",
    },
    {
      label: "ĐI TRỄ",
      value: stats.late,
      icon: <Clock size={18} />,
      color: "#facc15",
    },
    {
      label: "VỀ SỚM",
      value: stats.early,
      icon: <LogOut size={18} />,
      color: "#fb923c",
    },
    {
      label: "NGHỈ PHÉP",
      value: stats.leave,
      icon: <FileText size={18} />,
      color: "#a78bfa",
    },
    {
      label: "VẮNG KHÔNG PHÉP",
      value: stats.absent,
      icon: <UserX size={18} />,
      color: "#f87171",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)", // 6 card
        gap: 14,
        marginBottom: 24,
      }}
    >
      {Items.map((item) => (
        <div
          key={item.label}
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = `1px solid ${item.color}55`;
            e.currentTarget.style.boxShadow = `0 10px 22px ${item.color}22`;
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
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
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
                fontSize: 13,
                fontWeight: 700,
                color: "#e5e7eb",
                letterSpacing: 0.6,
                lineHeight: 1.2,
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
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 24, // nhỏ hơn
                fontWeight: 800,
                color: item.color,
                lineHeight: 1,
              }}
            >
              {item.value}
            </span>

            <span
              style={{
                fontSize: 12,
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
              width: 90,
              height: 90,
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