import React, { useState } from "react";
import { FiUser, FiLogOut, FiSettings, FiLock } from "react-icons/fi";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.right}>
        
        <span style={styles.greeting}>
          Xin chào, <b>{user?.username || "Admin"}</b>
        </span>
        <div style={styles.avatar} onClick={() => setOpen(!open)}>
          <FiUser size={20} />
        </div>
        
        {open && (
          <div style={styles.dropdown}>
            <div style={styles.item}>
              <FiSettings /> Đổi thông tin
            </div>
            <div style={styles.item}>
              <FiLock /> Đổi mật khẩu
            </div>
            <div style={styles.divider} />
            <div style={{ ...styles.item, color: "#f87171" }} onClick={handleLogout}>
              <FiLogOut /> Đăng xuất
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: 60,
    padding: "0 24px",
    background: "rgba(2,6,23,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(12,161,161,0.35)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 10,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    position: "relative",
  },

  greeting: {
    color: "#e5e7eb",
    fontSize: 17,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "rgba(12,161,161,0.15)",
    border: "1px solid rgba(12,161,161,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#22d3ee",
    cursor: "pointer",
  },

  dropdown: {
    position: "absolute",
    top: 48,
    right: 0,
    width: 180,
    background: "rgba(2,6,23,0.95)",
    border: "1px solid rgba(12,161,161,0.35)",
    borderRadius: 10,
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },

  item: {
    padding: "12px 14px",
    display: "flex",
    gap: 10,
    alignItems: "center",
    cursor: "pointer",
    color: "#e5e7eb",
    fontSize: 14,
  },

  divider: {
    height: 1,
    background: "rgba(255,255,255,0.1)",
  },
};

export default Navbar;
