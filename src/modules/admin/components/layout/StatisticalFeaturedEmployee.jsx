import React from "react";
import { Star } from "lucide-react";
const employees = [
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
    name: "Lê Văn C",
    code: "NV20260003",
    role: "Nhân viên",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Phạm Thị D",
    code: "NV20260004",
    role: "Quản trị viên",
    avatar: "https://i.pravatar.cc/150?img=56",
  },
];

const StatisticalFeaturedEmployee = () => {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(2,6,23,1), rgba(3,7,18,1))",
        borderRadius: 16, //
        border: "1px solid #1e293b",
        padding: "14px 16px", //
        marginBottom: 30,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#e5e7eb",
          marginBottom: 15,
          display: "flex",
          alignItems: "center",
        }}
      >
        NHÂN VIÊN NỔI BẬT
      </div>

      {/* EMPLOYEE LIST */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20, // ⬅️ gần nhau hơn
        }}
      >
        {employees.map((emp) => (
          <div
            key={emp.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 72, // ⬅️ thu hẹp item
            }}
          >
            {/* AVATAR */}
            <img
              src={emp.avatar}
              alt={emp.name}
              style={{
                width: 50, // ⬅️ avatar nhỏ hơn
                height: 50,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #22d3ee",
                marginBottom: 10,
              }}
            />

            {/* NAME */}
            <div
              style={{
                fontSize: 12.5, // ⬅️ nhỏ hơn
                fontWeight: 600,
                color: "#e5e7eb",
                lineHeight: 1.15,
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              {emp.name}
            </div>


            <div
              style={{
                fontSize: 10.5, // ⬅️ nhỏ hơn
                color: "#94a3b8",
                marginTop: 5,
                whiteSpace: "nowrap",
              }}
            >
              {emp.code}
            </div>

            {/* ROLE */}
            <div
              style={{
                fontSize: 10.5, // ⬅️ nhỏ hơn
                color: "#94a3b8",
                marginTop: 5,
                whiteSpace: "nowrap",
              }}
            >
              {emp.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticalFeaturedEmployee;
