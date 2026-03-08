import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  BarChart3,
  Clock,
  ClipboardCheck,
  UserCog,
  DollarSign,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

const SideBar = ({ collapsed }) => {
  const { user } = useAuth();

  const renderMenu = (to, label, Icon) => {
    return (
      <NavLink
        to={to}
        title={collapsed ? label : ""}
        style={({ isActive }) => ({
          ...stylesSidebar.menuItem,
          ...(isActive && stylesSidebar.menuItemActive),
          textDecoration: "none",
          color: "inherit",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "14px" : "14px 18px",
          gap: collapsed ? 0 : 15,
        })}
      >
        {({ isActive }) => (
          <>
            {isActive && !collapsed && (
              <div style={stylesSidebar.activeBar} />
            )}

            <Icon size={20} color={isActive ? "#fff" : "#94a3b8"} />

            {!collapsed && (
              <span
                style={{
                  ...stylesSidebar.menuText,
                  ...(isActive && stylesSidebar.activeText),
                }}
              >
                {label}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      style={{
        ...stylesSidebar.sidebar,
        width: collapsed ? 80 : 260,
      }}
    >
      {/* MENU */}
      <div style={stylesSidebar.menuList}>
        {user?.username === "admin" && (
          <>
            {renderMenu("/admin/dashboard/employees", "Nhân viên", Users)}
            {renderMenu("/admin/dashboard/account", "Tài khoản", UserCog)}
          </>
        )}

        {renderMenu("/admin/dashboard/shift", "Ca làm việc", Clock)}
        {renderMenu("/admin/dashboard/leave", "Nghỉ phép", CalendarCheck)}
        {renderMenu("/admin/dashboard/history", "Điểm danh", ClipboardCheck)}
        {renderMenu("/admin/dashboard/salary", "Lương nhân viên", DollarSign)}
        {renderMenu("/admin/dashboard/stats", "Thống kê", BarChart3)}
      </div>

      <div style={{ flex: 1 }} />
    </aside>
  );
};

export default SideBar;

/* ================= STYLES ================= */

export const stylesSidebar = {
  sidebar: {
    height: "calc(100vh - 60px)",
    background: "linear-gradient(180deg, #020617 0%, #020617 100%)",
    backdropFilter: "blur(14px)",
    borderRight: "1px solid rgba(12,161,161,0.25)",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s ease",
  },

  menuList: {
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  menuItem: {
    position: "relative",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.25s ease",
    color: "#94a3b8",
  },

  menuItemActive: {
    background: "linear-gradient(90deg, #0ca1a1, #089191)",
    boxShadow: "0 10px 26px rgba(12,161,161,0.4)",
  },

  menuText: {
    fontSize: 15,
    fontWeight: 600,
    color: "#94a3b8",
  },

  activeText: {
    color: "#ffffff",
  },

  activeBar: {
    position: "absolute",
    left: -8,
    width: 4,
    height: 26,
    background: "#22d3ee",
    borderRadius: "0 4px 4px 0",
    boxShadow: "0 0 14px #22d3ee",
  },
};