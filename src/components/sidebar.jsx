import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users2, ClipboardCheck, BarChart3 } from "lucide-react";

const Sidebar = ({ setActivePage }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [activeMenu, setActiveMenu] = useState("employee");
  const [hoverMenu, setHoverMenu] = useState(null);

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

        <Icon size={20} color={isActive ? "#fff" : "#94a3b8"} />

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
      {/* HEADER – CAO BẰNG NAVBAR */}
      <div style={styles.header}>
        <div style={styles.logoBox}>
          <div style={styles.logoIcon}>N</div>
          <div>
            <div style={styles.logo}>NANO TECH</div>
            <div style={styles.logoSub}>Attendance System</div>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div style={styles.menuList}>
        {renderMenu("employee", "Nhân viên", Users2)}
        {renderMenu("history", "Điểm danh", ClipboardCheck)}
        {renderMenu("stats", "Thống kê", BarChart3)}
      </div>

      <div style={{ flex: 1 }} />
    </aside>
  );
};

const styles = {
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
    height: 60, // BẰNG NAVBAR
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
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "linear-gradient(135deg, #0ca1a1, #22d3ee)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 900,
    color: "#020617",
    boxShadow: "0 0 22px rgba(34,211,238,0.55)",
  },

  logo: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 2,
    color: "#ffffff",
    lineHeight: 1.1,
  },

  logoSub: {
    fontSize: 12,
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
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    gap: 16,
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
    fontSize: 16,
    fontWeight: 500,
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

export default Sidebar;
