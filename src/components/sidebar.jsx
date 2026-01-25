import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users2,
  ClipboardCheck,
  BarChart3,
  LogOut,
} from "lucide-react";

const Sidebar = ({ setActivePage }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("employee");
  const [hoverMenu, setHoverMenu] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/login");
  };

  const handleClick = (key) => {
    setActiveMenu(key);
    setActivePage(key);
  };

  const renderMenu = (key, label, Icon) => {
    const isActive = activeMenu === key;
    const isHover = hoverMenu === key;

    return (
      <div
        key={key}
        onClick={() => handleClick(key)}
        onMouseEnter={() => setHoverMenu(key)}
        onMouseLeave={() => setHoverMenu(null)}
        style={{
          ...styles.menuItem,
          ...(isActive && styles.menuItemActive),
          ...(isHover && !isActive && styles.menuItemHover),
        }}
      >
        {isActive && <div style={styles.activeBar} />}

        <Icon
          size={20}
          style={{
            color: isActive ? "#ffffff" : "#94a3b8",
          }}
        />

        <span
          style={{
            ...styles.menuText,
            ...(isActive && styles.activeText),
          }}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <aside style={styles.sidebar}>
      {/* LOGO */}
      <div style={styles.logoContainer}>
        <h2 style={styles.logo}>NANO TECH</h2>
        <span style={styles.logoSub}>Attendance System</span>
      </div>

      {/* MENU */}
      <div style={styles.menuList}>
        {renderMenu("employee", "Nhân viên", Users2)}
        {renderMenu("history", "Điểm danh", ClipboardCheck)}
        {renderMenu("stats", "Thống kê", BarChart3)}
      </div>

      <div style={{ flex: 1 }} />

      {/* LOGOUT */}
      <button
        style={styles.logoutBtn}
        onClick={handleLogout}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #7f1d1d, #991b1b)";
          e.currentTarget.style.boxShadow =
            "0 0 14px rgba(239,68,68,0.35)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.08)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.color = "#fca5a5";
        }}
      >
        <LogOut size={18} />
        <span>Đăng Xuất</span>
      </button>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: 260,
    background: "linear-gradient(180deg, #020617 0%, #020617 100%)",
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1e293b",
  },

  logoContainer: {
    marginBottom: 36,
    paddingLeft: 6,
  },

  logo: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: 2,
    color: "#ffffff",
  },

  logoSub: {
    fontSize: 12,
    color: "#64748b",
    letterSpacing: 1,
  },

  menuList: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  menuItem: {
    position: "relative",
    padding: "12px 16px",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    gap: 14,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  menuItemActive: {
    background: "linear-gradient(90deg, #0ca1a1, #089191)",
    boxShadow: "0 6px 18px rgba(12,161,161,0.25)",
  },

  menuItemHover: {
    background: "rgba(30,41,59,0.6)",
  },

  menuText: {
    fontSize: 15,
    fontWeight: 500,
    color: "#94a3b8",
  },

  activeText: {
    color: "#ffffff",
    fontWeight: 600,
  },

  activeBar: {
    position: "absolute",
    left: -10,
    width: 4,
    height: 22,
    background: "#22d3ee",
    borderRadius: "0 4px 4px 0",
    boxShadow: "0 0 12px #22d3ee",
  },

  logoutBtn: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.35)",
    borderRadius: 16,
    padding: "14px",
    color: "#fca5a5",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.25s ease",
    backdropFilter: "blur(6px)",
  },
};

export default Sidebar;
