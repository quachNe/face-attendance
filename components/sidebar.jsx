import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuth"); // xoá đăng nhập
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>ATTENDANCE</h2> {/* Logo công ty */}

      <div style={styles.menuItem}>Nhân Viên</div> {/* Menu items */}
      <div style={styles.menuItem}>Lịch Sử Điểm Danh</div>{/* Menu items */}
      <div style={styles.menuItem}>Thống Kê</div>{/* Menu items */}
      <div style={styles.menuItem}>Cài Đặt</div>{/* Menu items */}

      {/* đẩy logout xuống đáy */}
      <div style={{ flex: 1 }} />

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Đăng Xuất
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
  menuItem: {
    padding: "12px 0",
    cursor: "pointer",
    opacity: 0.85,
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    borderRadius: 10,
    padding: "10px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Sidebar;
