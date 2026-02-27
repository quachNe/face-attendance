import React, { useEffect, useState } from "react";
import { Star, Clock } from "lucide-react";
import { getTopLate } from "../../../../services/StatisficalService";

/* ================= TOP XUẤT SẮC (DEMO) ================= */
const topEmployees = [
  {
    name: "Nguyễn Văn A",
    code: "NV20260001",
    role: "Nhân viên",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Trần Thị B",
    code: "NV20260002",
    role: "Nhân viên",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Phạm Thị D",
    code: "NV20260004",
    role: "Quản trị viên",
    avatar: "https://i.pravatar.cc/150?img=56",
  },
];

/* ================= ITEM ================= */
const EmployeeItem = ({ emp }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 78,
      padding: "6px 4px",
      cursor: "pointer",
    }}
  >
    <img
      src={emp.avatar}
      alt={emp.name}
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #22d3ee",
        boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
        marginBottom: 8,
      }}
    />

    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "#e5e7eb",
        textAlign: "center",
      }}
    >
      {emp.name}
    </div>

    <div style={{ fontSize: 10, color: "#94a3b8" }}>{emp.code}</div>

    <div style={{ fontSize: 10, color: "#94a3b8" }}>{emp.role}</div>
  </div>
);

/* ================= LIST ================= */
const EmployeeList = ({ list }) => {
  if (!list || list.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "#64748b",
          fontSize: 12,
          padding: "12px 0",
        }}
      >
        Không có dữ liệu
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 18,
        flexWrap: "wrap",
      }}
    >
      {list.map((emp) => (
        <EmployeeItem key={emp.code || emp.name} emp={emp}/>
      ))}
    </div>
  );
};

/* ================= FRAME ================= */
const SmallFrame = ({ icon, title, children }) => (
  <div
    style={{
      flex: 1,
      background: "rgba(2,6,23,0.6)",
      borderRadius: 14,
      border: "1px solid #1e293b",
      padding: "14px 12px",
      backdropFilter: "blur(6px)",
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#e5e7eb",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon}
      {title}
    </div>

    {children}
  </div>
);

/* ================= MAIN COMPONENT ================= */
const StatisticalFeaturedEmployee = () => {
  const [lateEmployees, setLateEmployees] = useState([]);

  useEffect(() => {
    const fetchTopLate = async () => {
      try {
        const { data } = await getTopLate();

        const mapped = data.map((u, i) => ({
          name: u.name,
          code: `NV${(i + 1).toString().padStart(4, "0")}`,
          role: "Nhân viên",
          avatar: u.avatar
            ? "https://i.pravatar.cc/150?img=12"
            : "https://i.pravatar.cc/150?img=1",
        }));

        setLateEmployees(mapped);
      } catch (e) {
        console.error("Lỗi top trễ:", e);
      }
    };

    fetchTopLate();
  }, []);

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(2,6,23,1), rgba(3,7,18,1))",
        borderRadius: 18,
        border: "1px solid #1e293b",
        padding: "18px 18px",
        marginBottom: 30,
        boxShadow: "0 8px 28px rgba(0,0,0,0.6)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#f1f5f9",
          marginBottom: 16,
          letterSpacing: 0.4,
        }}
      >
        XẾP HẠNG NHÂN VIÊN
      </div>

      {/* 2 FRAME */}
      <div style={{ display: "flex", gap: 16 }}>
        {/* ⭐ XUẤT SẮC */}
        <SmallFrame
          icon={<Star size={16} color="#facc15" fill="#facc15" />}
          title="THÀNH TÍCH TỐT"
        >
          <EmployeeList list={topEmployees} />
        </SmallFrame>

        {/* ⏰ ĐI TRỄ */}
        <SmallFrame
          icon={<Clock size={16} color="#f87171" />}
          title="THÀNH TÍCH KÉM"
        >
          <EmployeeList list={lateEmployees} />
        </SmallFrame>
      </div>
    </div>
  );
};

export default StatisticalFeaturedEmployee;