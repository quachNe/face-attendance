import React from "react";
import { NavLink } from "react-router-dom";
import { Users , CalendarCheck, BarChart3, Clock, ClipboardCheck, UserCog} from "lucide-react";
import logoImg from "/Logo1.png";

const SideBar = () => {

  const renderMenu = (to, label, Icon) => {
    return (
      <NavLink
        to={to}
        style={({ isActive }) => ({
          ...stylesSidebar.menuItem,
          ...(isActive && stylesSidebar.menuItemActive),
          textDecoration: "none",
          color: "inherit",
        })}
      >
        {({ isActive }) => (
          <>
            {isActive && <div style={stylesSidebar.activeBar} />}
            <Icon size={20} color={isActive ? "#fff" : "#94a3b8"} />
            <span
              style={{
                ...stylesSidebar.menuText,
                ...(isActive && stylesSidebar.activeText),
              }}
            >
              {label}
            </span>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside style={stylesSidebar.sidebar}>
      <div style={stylesSidebar.header}>
        <div style={stylesSidebar.logoBox}>
          <div style={stylesSidebar.logoIcon}>
            <img
              src={logoImg}
              alt="Nano Tech"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div>
            <div style={stylesSidebar.logo}>NANO TECH</div>
            {/* <div style={stylesSidebar.logoSub}>Attendance System</div> */}
          </div>
        </div>
      </div>

      <div style={stylesSidebar.menuList}>
        {renderMenu("/admin/dashboard/employees", "Nhân viên", Users )}
        {renderMenu("/admin/dashboard/account", "Tài khoản", UserCog)}
        {renderMenu("/admin/dashboard/shift", "Ca làm việc", Clock)}
        {renderMenu("/admin/dashboard/leave", "Nghỉ phép", CalendarCheck)}
        {renderMenu("/admin/dashboard/history", "Điểm danh", ClipboardCheck )}
        {renderMenu("/admin/dashboard/stats", "Thống kê", BarChart3)}
      </div>

      <div style={{ flex: 1 }} />
    </aside>
  );
};

export default SideBar;

export const stylesSidebar = {
  sidebar: {
    width: 280,
    height: "100vh",
    background: "linear-gradient(180deg, #020617 0%, #020617 100%)",
    backdropFilter: "blur(14px)",
    borderRight: "1px solid rgba(12,161,161,0.25)",
    display: "flex",
    flexDirection: "column",
  },

  /* HEADER */
  header: {
    height: 60,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid rgba(12,161,161,0.25)",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  logoIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 22px rgba(34,211,238,0.55)",
    overflow: "hidden",
  },
  
  logo: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: 2,
    color: "#ffffff",
    lineHeight: 1.5,
  },

  logoSub: {
    fontSize: 14,
    color: "#67e8f9",
    letterSpacing: 1.1,
  },

  /* MENU */
  menuList: {
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  menuItem: {
    position: "relative",
    padding: "14px 18px",
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    gap: 15,
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  menuItemActive: {
    background: "linear-gradient(90deg, #0ca1a1, #089191)",
    boxShadow: "0 10px 26px rgba(12,161,161,0.4)",
  },

  menuItemHover: {
    background: "rgba(30,41,59,0.65)",
  },

  menuText: {
    fontSize: 15,
    fontWeight: 600,
    color: "#94a3b8",
  },

  activeText: {
    color: "#ffffff",
    fontWeight: 600,
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