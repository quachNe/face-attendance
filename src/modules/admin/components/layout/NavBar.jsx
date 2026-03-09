import React, { useState, useEffect, useRef } from "react";
import { User, Settings, Lock, LogOut, Menu } from "lucide-react";
import ChangePassword from "../modal/ChangePassword";
import UserProfile from "../modal/UserProfile";
import { useAuth } from "../../../../context/AuthContext";
import logoImg from "/Logo1.png";

const Navbar = ({ collapsed, setCollapsed }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user } = useAuth();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [disableIsClose, setDisableIsClose] = useState(false);

  const [menuHover, setMenuHover] = useState(false);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/admin/login";
  };

  /* ================= CLOSE DROPDOWN OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= FORCE CHANGE PASSWORD ================= */

  useEffect(() => {
    if (user?.must_change_password) {
      setShowChangePassword(true);
      setDisableIsClose(true);
    }
  }, [user]);

  return (
    <>
      <div style={styles.container}>
        {/* LEFT */}
        <div style={styles.left}>
          {/* LOGO */}
          <div style={styles.logoBox}>
            <img src={logoImg} style={styles.logoIcon} />
            <span style={styles.logoText}>NANO TECH</span>
          </div>

          {/* BUTTON COLLAPSE SIDEBAR */}
          <div
            style={{
              ...styles.menuBtn,
              background: menuHover
                ? "rgba(12,161,161,0.25)"
                : "transparent",
              transform: menuHover ? "scale(1.08)" : "scale(1)",
              boxShadow: menuHover
                ? "0 0 14px rgba(34,211,238,0.5)"
                : "none",
            }}
            onMouseEnter={() => setMenuHover(true)}
            onMouseLeave={() => setMenuHover(false)}
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Mở thanh bên" : "Đóng thanh bên"}
          >
            <Menu size={22} />
          </div>
        </div>

        {/* RIGHT */}
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
              <DropdownItem
                icon={<Settings size={16} />}
                text="Đổi thông tin"
                onClick={() => {
                  setShowUserProfile(true);
                  setOpen(false);
                }}
              />

              <DropdownItem
                icon={<Lock size={16} />}
                text="Đổi mật khẩu"
                onClick={() => {
                  setShowChangePassword(true);
                  setOpen(false);
                }}
              />

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

      {/* CHANGE PASSWORD */}
      {showChangePassword && (
        <ChangePassword
          onClose={() => setShowChangePassword(false)}
          disableIsclose={disableIsClose}
        />
      )}

      {/* USER PROFILE */}
      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}
    </>
  );
};

/* ================= ITEM ================= */

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

/* ================= STYLES ================= */

const styles = {
  container: {
    height: 60,
    padding: "0 18px",
    background: "#020617",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(12,161,161,0.35)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 35,
  },

  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    border: "1px solid rgba(12,161,161,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#22d3ee",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  logoIcon: {
    width: 36,
    height: 36,
    objectFit: "contain",
  },

  logoText: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 1,
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