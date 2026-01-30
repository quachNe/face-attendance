import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // hoặc spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;