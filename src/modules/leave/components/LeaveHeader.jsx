import { useAuth } from "../../../context/AuthContext";
import { User, LogIn, LogOut } from "lucide-react";

function LeaveHeader({ onLoginClick }) {
  const { user, logout } = useAuth();

  return (
    <div style={styles.header}>
      
      <div style={styles.logoContainer}>
        <img src="/Logo1.png" alt="logo" style={styles.logo} />
        <span style={styles.systemName}>NANO TECH</span>
      </div>

      <div>
        <h2 style={styles.pageTitle}>
          QUẢN LÝ ĐƠN XIN NGHỈ PHÉP
        </h2>
      </div>

      <div style={styles.userContainer}>
        {!user ? (
          <button onClick={onLoginClick} style={styles.loginBtn}>
            <LogIn size={18} style={{ marginRight: "6px" }} />
            Đăng nhập
          </button>
        ) : (
          <>
            <div style={styles.userInfo}>
              <User size={18} />
              <span style={styles.username}>
                Xin chào, {user.name}
              </span>
            </div>

            <span style={styles.divider}>|</span>

            <button onClick={logout} style={styles.logoutBtn}>
              <LogOut size={18} style={{ marginRight: "6px" }} />
              Đăng xuất
            </button>
          </>
        )}
      </div>

    </div>
  );
}

export default LeaveHeader;

const styles = {
  header: {
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
    gap: "10px"
  },

  username: {
    fontSize: "14px"
  },

  divider: {
    opacity: 0.7
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },

  loginBtn: {
    background: "none",display:"flex",
    justifyContent:"center",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
    },

  logoutBtn: {
    display:"flex",
    justifyContent:"center",
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "14px"
  }
};
