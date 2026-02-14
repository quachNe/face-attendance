import React from "react";

export default function LeaveFooter() {
  return (
    <div style={styles.footer}>
      <div style={styles.content}>
        © 2026 Phòng Nhân Sự | 
        Email: hr@nanotech.com | 
        Điện thoại: 0123456789
      </div>
    </div>
  );
}

const styles = {
  footer: {
    background: "linear-gradient(90deg, #0f4c81, #1e3a8a)",
    color: "white",
    padding: "15px 0",
    textAlign: "center",
  },

  content: {
    fontSize: "14px",
    letterSpacing: "0.5px",
  },
};
