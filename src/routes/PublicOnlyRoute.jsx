import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/leave" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
