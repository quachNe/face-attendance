import React, { useState, useEffect, useRef, use } from "react";
import { User, Settings, Lock, LogOut, Bold } from "lucide-react";
import ChangePassword from "./ChangePassWord";
import UserProfile from "./UserProfile";
import { useAuth } from "../context/AuthContext";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const user = JSON.parse(localStorage.getItem("user"));
  const {user} = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // XỬ LÝ ĐĂNG XUẤT
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // click ngoài thì đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div style={styles.container}>
        <div style={styles.right} ref={dropdownRef}>
          <span style={styles.greeting}>
            Xin chào,{" "}
            <b
              style={{
                background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
              }}
            >
              {user?.name || "Admin"}
            </b>
          </span>

          {/* Avatar */}
          <div
            style={{
              ...styles.avatar,
              background: open
                ? "rgba(12,161,161,0.35)"
                : "rgba(12,161,161,0.15)",
            }}
            onClick={() => setOpen(!open)}
          >
            <User size={20} />
          </div>

          {/* Dropdown */}
          {open && (
            <div style={styles.dropdown}>
              <DropdownItem icon={<Settings size={16} />} text="Đổi thông tin" onClick={() => setShowUserProfile(true)} />
              <DropdownItem onClick={() => setShowChangePassword(true)} icon={<Lock size={16} />} text="Đổi mật khẩu" />
              <div style={styles.divider} />
              <DropdownItem
                icon={<LogOut size={16} />}
                text="Đăng xuất"
                danger
                onClick={handleLogout}
              />
            </div>
          )}
        </div>
      </div>
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}  
    </>
  );
};

/* ===================== ITEM ===================== */
const DropdownItem = ({ icon, text, danger, onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.item,
        background: hover
          ? danger
            ? "rgba(239,68,68,0.15)"
            : "rgba(12,161,161,0.18)"
          : "transparent",
        color: danger ? "#f87171" : "#e5e7eb",
      }}
    >
      {icon}
      {text}
    </div>
  );
};

/* ===================== STYLES ===================== */
const styles = {
  container: {
    height: 60,
    padding: "0 18px",
    background: "#020617",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(12,161,161,0.35)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 20,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    position: "relative",
  },

  greeting: {
    color: "#e5e7eb",
    fontSize: 15,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "1px solid rgba(12,161,161,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#22d3ee",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  dropdown: {
    position: "absolute",
    top: 52,
    right: -10,
    width: 190,
    background: "rgba(2,6,23,0.97)",
    border: "1px solid rgba(12,161,161,0.35)",
    borderRadius: 12,
    boxShadow: "0 20px 40px rgba(0,0,0,0.55)",
    overflow: "hidden",
    animation: "fadeScale 0.18s ease",
  },

  item: {
    padding: "12px 14px",
    display: "flex",
    gap: 10,
    alignItems: "center",
    cursor: "pointer",
    fontSize: 15,
    transition: "all 0.2s ease",
    fontWeight: 500,
  },

  divider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "6px 0",
  },
};

export default Navbar;