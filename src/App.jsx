import { Routes, Route, Navigate  } from "react-router-dom";
import Scan from "./modules/admin/pages/FaceScan";
import Login from "./modules/admin/pages/Login";
import Dashboard from "./modules/admin/pages/Dashboard";
import { AuthProvider, useAuth } from './context/AuthContext';
import Protected from "./routes/Protected";
import LeavePage from "./modules/user/pages/LeavePage";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// IMPORT CÁC TRANG TRONG DASHBOARD
import SystemStatistics from "./modules/admin/pages/SystemStatistics";
import EmployeeManagement from "./modules/admin/pages/EmployeeManagement";
import AttendanceHistory from "./modules/admin/pages/AttendanceHistory";
import ShiftManagement from "./modules/admin/pages/ShiftManagement";
import LeaveManagement from "./modules/admin/pages/LeaveManagement";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/*URL trang gửi đơn xin nghỉ phép*/}
        <Route path="/leaves" element={<LeavePage />}/>

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
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="stats" element={<SystemStatistics />} />
          </Route>
      </Routes>

      {/*Toast thông báo thao tác*/}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}
export default App;