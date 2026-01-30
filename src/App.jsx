import { Routes, Route } from "react-router-dom";
import Scan from "./pages/Scan";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from './context/AuthContext';
import Protected from "./components/Protected";
function App() {
  return (
    <AuthProvider>
      <Routes>
          <Route path="/scan" element={<Scan />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      </Routes>
    </AuthProvider>
  );
}
export default App;
