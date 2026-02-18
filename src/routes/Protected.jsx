import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Protected = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // hoặc spinner

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Nếu có truyền allowedRoles thì check role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default Protected;
