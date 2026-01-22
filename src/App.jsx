import { Routes, Route } from "react-router-dom";
import Scan from "./pages/scan";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Scan />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
