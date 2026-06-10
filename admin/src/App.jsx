import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import AdminLogin from "./pages/auth/Login";
import AdminDashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/Users";
import SenderIDs from "./pages/senderIDs/SenderIDs";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/sender-ids" element={<ProtectedRoute><SenderIDs /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}