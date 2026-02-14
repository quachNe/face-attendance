import { useAuth } from "../../../context/AuthContext";

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
          QUẢN LÝ ĐƠN XIN PHÉP NGHỈ VIỆC
        </h2>
      </div>

      <div style={styles.userContainer}>
        {!user ? (
          <button onClick={onLoginClick} style={styles.loginBtn}>
            Đăng nhập
          </button>
        ) : (
          <>
            <span style={styles.username}>
              Xin chào, {user.name}
            </span>
            <span style={styles.divider}>|</span>
            <button onClick={logout} style={styles.logoutBtn}>
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

  loginBtn: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
    padding: 0,
    },

  logoutBtn: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px"
  }
};
