import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // demo đăng nhập
    navigate("/dashboard");
  };

  return (
    <div style={styles.container}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin} style={styles.form}>
        <input placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: 250,
  },
};

export default Login;
