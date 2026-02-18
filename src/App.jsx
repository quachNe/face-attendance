import { Routes, Route, Navigate  } from "react-router-dom";
import Scan from "./modules/admin/pages/Scan";
import Login from "./modules/admin/pages/Login";
import Dashboard from "./modules/admin/pages/Dashboard";
import { AuthProvider, useAuth } from './context/AuthContext';
import Protected from "./routes/Protected";
import LeaveManagement from "./modules/leave/pages/LeaveManagement";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// IMPORT CÁC TRANG TRONG DASHBOARD
import SystemStatistics from "./modules/admin/components/SystemStatistics";
import EmployeeManagement from "./modules/admin/components/EmployeeManagement";
import AttendanceHistory from "./modules/admin/components/AttendanceHistory";
import ShiftManagement from "./modules/admin/components/ShiftManagement";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/*URL trang gửi đơn xin nghỉ phép*/}
        <Route path="/leaves" element={<LeaveManagement />}/>

        {/*URL trang điểm danh*/}
        <Route path="/" element={<Navigate to="/scan" replace/>} />
        <Route path="/scan" element={<Scan />} />

        {/*URL trang đăng nhập*/}
        <Route
          path="/admin/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        {/*URL trang dashboard*/}
        <Route path="/admin/dashboard" 
          element={
            <Protected allowedRoles={["admin"]}>
              <Dashboard />
            </Protected>
          }
               
        >
          <Route index element={<Navigate to="employees" replace />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="history" element={<AttendanceHistory />} />
          <Route path="shift" element={<ShiftManagement />} />
          <Route path="leave" element={<div>Chưa làm</div>} />
          <Route path="stats" element={<SystemStatistics />} />
          </Route>
      </Routes>

      {/*Toast thông báo thao tác*/}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}
export default App;