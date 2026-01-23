import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

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

  const renderMenu = (key, label, icon) => {
    const isActive = activeMenu === key;
    const isHover = hoverMenu === key;

    return (
      <div
        onClick={() => handleClick(key)}
        onMouseEnter={() => setHoverMenu(key)}
        onMouseLeave={() => setHoverMenu(null)}
        style={{
          ...styles.menuItem,
          ...(isActive || isHover ? styles.menuItemActive : {}),
        }}
      >
        {/* Thanh sáng bên trái */}
        {(isActive || isHover) && <div style={styles.activeBar} />}

        {/* ICON */}
        <span style={styles.icon}>{icon}</span>

        {/* TEXT */}
        <span
          style={{
            ...styles.menuText,
            ...(isActive ? styles.activeText : {}),
          }}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>ATTENDANCE</h2>

      {renderMenu("employee", "Nhân Viên", "👨‍💼")}
      {renderMenu("history", "Điểm Danh", "📋")}
      {renderMenu("stats", "Thống Kê", "📊")}
      {renderMenu("settings", "Cài Đặt", "⚙️")}

      <div style={{ flex: 1 }} />

      <button style={styles.logoutBtn} onClick={handleLogout}>
        <FiLogOut size={16} style={{ transform: "rotate(180deg)" }} />
        <span>Đăng Xuất</span>
      </button>



    </div>
  );
};

const styles = {
  sidebar: {
    width: 220,
    background: "#0b1220",
    color: "#c7d2fe",
    padding: 24,
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    marginBottom: 30,
    color: "#38bdf8",
    letterSpacing: 1,
    fontSize: 20,
  },

  /* MENU */
  menuItem: {
    position: "relative",
    padding: "12px 10px",
    cursor: "pointer",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    marginBottom: 6,
    gap: 10,
  },

  menuItemActive: {
    background: "#0ca1a1",
  },

  icon: {
    width: 20,
    textAlign: "center",
    fontSize: 16,
  },

  menuText: {
    opacity: 0.85,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  activeText: {
    color: "#f7f8f8",
    opacity: 1,
    fontWeight: 600,
  },

  activeBar: {
    position: "absolute",
    left: -8,
    top: 8,
    bottom: 8,
    width: 4,
    borderRadius: 4,
    background: "#22d3ee",
  },

  logoutBtn: {
  background: "#ef4444",
  border: "none",
  borderRadius: 10,
  padding: "10px",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
},

};

export default Sidebar;
