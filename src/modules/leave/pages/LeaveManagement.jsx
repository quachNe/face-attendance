import React, { useState, useEffect } from "react";
import LeaveHeader from "../components/LeaveHeader";
import LeaveMenu from "../components/LeaveMenu";
import LeaveFooter from "../components/LeaveFooter";
import LeaveLoginModal from "../components/LeaveLoginModal";
import { useAuth } from "../../../context/AuthContext";
import Profile from "../components/Profile";
import {User2Icon} from "lucide-react"

const LeaveManagement = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [active, setActive] = useState(null);
  const {user} = useAuth();
  useEffect(() => {
    if (!user) {
      setActive(null);
    }
  }, [user]);
  const renderContent = () => {
    if (!active) {
      return (
        <div style={styles.emptyWrapper}>
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>📂</div>
            <h2 style={styles.emptyTitle}>
              Chưa chọn chức năng
            </h2>
            <p style={styles.emptyDesc}>
              Vui lòng chọn một chức năng bên trái để bắt đầu sử dụng hệ thống quản lý đơn xin nghỉ phép.
            </p>
          </div>
        </div>
      );
    }

    switch (active) {
      case "request":
        return (
          <div>
            <h2 style={styles.contentTitle}>📝 Gửi đơn xin nghỉ phép</h2>
          </div>
        );

      case "status":
        return (
          <div>
            <h2 style={styles.contentTitle}>📊 Trạng thái đơn nghỉ phép</h2>
          </div>
        );

      case "profile":
        return (
          <div>
            <h2 style={styles.contentTitle}>
              <User2Icon size={22} />
              <span>Thông tin cá nhân</span>
            </h2>
            <Profile />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <LeaveHeader onLoginClick={() => setShowLogin(true)} />

      <div style={styles.wrapper}>
        <div style={styles.left}>
          <LeaveMenu
            active={active}
            setActive={setActive}
            onLoginClick={() => setShowLogin(true)}
          />
        </div>

        <div style={styles.right}>
          {renderContent()}
        </div>
      </div>

      <LeaveFooter />

      {showLogin && (
        <LeaveLoginModal onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

export default LeaveManagement;
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f4f6f9",
  },

  wrapper: {
    flex: 1,
    display: "flex",
    gap: "24px",
    padding: "24px 40px",
  },

  left: {
    width: "260px",
  },

  right: {
    flex: 1,
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    overflow: "auto",
    position: "relative",
  },

  /* ================= EMPTY STATE ================= */

  emptyWrapper: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyCard: {
    textAlign: "center",
    padding: "60px 50px",
    borderRadius: "20px",
    background: "linear-gradient(145deg, #f8fafc, #ffffff)",
    // boxShadow: "0 12px 35px rgba(0,0,0,0.05)",
    maxWidth: "500px",
  },

  emptyIcon: {
    fontSize: "52px",
    marginBottom: "24px",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "600",
    color: "#1e293b",
  },

  emptyDesc: {
    marginTop: "12px",
    fontSize: "15px",
    color: "#64748b",
    lineHeight: "1.6",
  },

  /* ================= CONTENT ================= */

  contentTitle: {
    margin: 0,
    display: "flex",
    alignItems: "center",
    fontSize: "23px",
    fontWeight: "600",
    color: "#0f172a",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
};