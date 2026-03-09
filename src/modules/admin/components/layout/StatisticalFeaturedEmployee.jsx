import React, { useEffect, useState } from "react";
import { Star, Clock } from "lucide-react";
import { getEmployeeRanking } from "../../../../services/StatisficalService";

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
      src={`/IconUser.png`}
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

    <div style={{ fontSize: 10, color: "#f87171", fontWeight: 600 }}>
      {emp.role}
    </div>
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
        <EmployeeItem key={emp.code || emp.name} emp={emp} />
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
  const [bestEmployees, setBestEmployees] = useState([]);
  const [worstEmployees, setWorstEmployees] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await getEmployeeRanking();

        const best = res.data.best.map((u, i) => ({
          name: u.name,
          code: `TOP ${i + 1}`,
          role: `Score ${u.score}`,
        }));

        const worst = res.data.worst.map((u, i) => ({
          name: u.name,
          code: `TOP ${i + 1}`,
          role: `Score ${u.score}`,
        }));

        setBestEmployees(best);
        setWorstEmployees(worst);
      } catch (err) {
        console.error("Lỗi load ranking:", err);
      }
    };

    fetchRanking();
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

      <div style={{ display: "flex", gap: 16 }}>
        {/* THÀNH TÍCH TỐT */}
        <SmallFrame
          icon={<Star size={16} color="#facc15" fill="#facc15" />}
          title="THÀNH TÍCH TỐT"
        >
          <EmployeeList list={bestEmployees} />
        </SmallFrame>

        {/* THÀNH TÍCH KÉM */}
        <SmallFrame
          icon={<Clock size={16} color="#f87171" />}
          title="THÀNH TÍCH KÉM"
        >
          <EmployeeList list={worstEmployees} />
        </SmallFrame>
      </div>
    </div>
  );
};

export default StatisticalFeaturedEmployee;