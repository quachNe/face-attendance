import React, { useState, useEffect } from "react";
import LeaveHeader from "../components/layout/LeaveHeader";
import LeaveMenu from "../components/layout/LeaveMenu";
import LeaveFooter from "../components/layout/LeaveFooter";
import LeaveLoginModal from "../components/modal/LeaveLoginModal";
import { useAuth } from "../../../context/AuthContext";
import { FolderOpen , CalendarDays, FileText } from "lucide-react";
import LeaveRequest from "./LeaveRequest";
import LeaveStatus from "./LeaveStatus";
import ProfileModal from "../components/modal/ProfileModal";
import ChangePasswordModal from "../components/modal/ChangePasswordModal";

const LeavePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [active, setActive] = useState(null);
  const { user } = useAuth();

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
            <div style={styles.emptyIcon}>
              <FolderOpen size={80} strokeWidth={1.5} />
            </div>

            <h2 style={styles.emptyTitle}>
              Chưa chọn chức năng
            </h2>

            <p style={styles.emptyDesc}>
              Vui lòng chọn một chức năng bên trái để bắt đầu sử dụng hệ thống
              quản lý đơn xin nghỉ phép.
            </p>
          </div>
        </div>
      );
    }

    switch (active) {
      case "request":
        return (
          <>
            <h2 style={styles.contentTitle}>
              <CalendarDays size={22} />
              <span>Gửi đơn xin nghỉ phép</span>
            </h2>
            <LeaveRequest />
          </>
        );

      case "status":
        return (
          <>
            <h2 style={styles.contentTitle}>
              <FileText size={22} />
              <span>Trạng thái đơn nghỉ phép</span>
            </h2>
            <LeaveStatus />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <LeaveHeader
        onLoginClick={() => setShowLogin(true)}
        onShowProfile={() => setShowProfile(true)}
        onShowChangePassword={() => setShowChangePassword(true)}
      />

      <div style={styles.wrapper}>
        <div style={styles.left}>
          <LeaveMenu
            active={active}
            setActive={setActive}
            onLoginClick={() => setShowLogin(true)}
          />
        </div>

        <div style={styles.right}>{renderContent()}</div>
      </div>

      <LeaveFooter />

      {showLogin && <LeaveLoginModal onClose={() => setShowLogin(false)} />}
      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
};

export default LeavePage;

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
    overflow: "hidden", // QUAN TRỌNG
  },

  left: {
    width: "260px",
  },

  right: {
    flex: 1,
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
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
    gap: "10px",
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