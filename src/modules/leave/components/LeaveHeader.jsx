import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { User, LogIn } from "lucide-react";
import LeaveDropdown from "./LeaveDropdown";

function LeaveHeader({
  onLoginClick,
  onShowProfile,
  onShowChangePassword
}) {
  const { user } = useAuth();
  const [showDropDown, setShowDropDown] = useState(false);
  const dropdownRef = useRef(null);

  const handleShowDropDown = () => {
    setShowDropDown((prev) => !prev);
  };

  // Click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropDown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={styles.header}>
      {/* LOGO */}
      <div style={styles.logoContainer}>
        <img src="/Logo1.png" alt="logo" style={styles.logo} />
        <span style={styles.systemName}>NANO TECH</span>
      </div>

      {/* TITLE */}
      <h2 style={styles.pageTitle}>
        QUẢN LÝ ĐƠN XIN NGHỈ PHÉP
      </h2>

      {/* USER */}
      <div style={styles.userContainer} ref={dropdownRef}>
        {!user ? (
          <button onClick={onLoginClick} style={styles.loginBtn}>
            <LogIn size={18} style={{ marginRight: "6px" }} />
            Đăng nhập
          </button>
        ) : (
          <>
            <div style={styles.userInfo} onClick={handleShowDropDown}>
              <span style={styles.username}>
                Xin chào, {user.name}
              </span>
              <User size={25} style={{ cursor: "pointer" }} />
            </div>

            {showDropDown && (
              <LeaveDropdown
                onClose={() => setShowDropDown(false)}
                onShowProfile={onShowProfile}
                onShowChangePassword={onShowChangePassword}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LeaveHeader;


const styles = {
  header: {
    position: "relative", // 🔥 quan trọng
    background: "linear-gradient(90deg, #0f4c81, #1e3a8a)",
    color: "white",
    padding: "12px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  logo: {
    width: "40px"
  },

  systemName: {
    fontWeight: "600",
    fontSize: "16px"
  },

  pageTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    letterSpacing: "1px"
  },

  userContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    position: "relative"  // 🔥 anchor cho dropdown
  },

  username: {
    fontSize: "14px"
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer"
  },

  loginBtn: {
    background: "none",
    display: "flex",
    alignItems: "center",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "14px"
  }
};