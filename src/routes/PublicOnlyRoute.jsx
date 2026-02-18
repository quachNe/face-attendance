import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  return children;
};

export default PublicOnlyRoute;
