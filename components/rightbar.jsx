import React from "react";

const Rightbar = () => {
  return (
    <div style={styles.container}>
      <h1>Admin Dashboard</h1>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>👥 Tổng nhân viên</h3>
          <p style={styles.number}>25</p>
        </div>

        <div style={styles.card}>
          <h3>📸 Điểm danh hôm nay</h3>
          <p style={styles.number}>18</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: 32,
    flex: 1,
    background: "#f1f5f9",
    minHeight: "100vh",
  },
  cards: {
    display: "flex",
    gap: 20,
    marginTop: 24,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 220,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  number: {
    fontSize: 32,
    fontWeight: 700,
    marginTop: 10,
  },
};

export default Rightbar;
