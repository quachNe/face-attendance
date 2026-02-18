import React from "react";
import { useAuth } from "../../../../context/AuthContext";
import {Settings, Lock, LogOut} from "lucide-react"
export default function LeaveDropdown({
  onClose,
  onShowProfile,
  onShowChangePassword,
}) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div style={styles.dropdown}>
      <button
        onClick={() => {
          onShowProfile();
          onClose();
        }}
        style={styles.item}
      >
        <Settings /> Thông tin cá nhân
      </button>

      <button
        onClick={() => {
          onShowChangePassword();
          onClose();
        }}
        style={styles.item}
      >
        <Lock />Đổi mật khẩu
      </button>

      <button
        onClick={handleLogout}
        style={{ ...styles.item, ...styles.logout }}
      >
        <LogOut />Đăng xuất
      </button>
    </div>
  );
}

const styles = {
    dropdown: {
        position: "absolute",
        top: "45px",
        right: 0,
        width: "210px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        overflow: "hidden",
        zIndex: 1000,
    },

    item: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        padding: "12px 16px",
        border: "none",
        background: "#ffffff",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        color: "#000000",
    },

    logout: {
        color: "#dc2626",
        fontWeight: "500",
    },
};