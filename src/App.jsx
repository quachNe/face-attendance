import { Routes, Route } from "react-router-dom";
import Scan from "./modules/admin/pages/Scan";
import Login from "./modules/admin/pages/Login";
import Dashboard from "./modules/admin/pages/Dashboard";
import { AuthProvider, useAuth } from './context/AuthContext';
import Protected from "./routes/Protected";
import LeaveManagement from "./modules/leave/pages/LeaveManagement";

import PublicOnlyRoute from "./routes/PublicOnlyRoute";
function App() {
  return (
    <AuthProvider>
      <Routes>
          <Route path="/leave" element={<LeaveManagement />}/>
          <Route path="/" element={<Scan />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route path="/dashboard" 
            element={
              <Protected allowedRoles={["admin"]}>
                <Dashboard />
              </Protected>
            }
          />
      </Routes>
    </AuthProvider>
  );
}
export default App;
