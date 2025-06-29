import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import CalendarView from "./pages/Calendar";
import PatientAppointments from "./pages/PatientAppointments";
import AllAppointments from "./pages/AllAppointments";
import InvoicePage from "./pages/InvoicePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// ✅ Role-based redirect
function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === "Admin" ? <Dashboard /> : <Navigate to="/appointments" />;
}

function App() {
  // ⛔ REMOVE THIS before deploying to production
  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") {
  //     localStorage.removeItem("user");
  //   }
  // }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute role="Admin"><Patients /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute role="Patient"><PatientAppointments /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute role="Admin"><CalendarView /></ProtectedRoute>} />
          <Route path="/all-appointments" element={<ProtectedRoute role="Admin"><AllAppointments /></ProtectedRoute>} />
          <Route path="/invoice/:id" element={<ProtectedRoute><InvoicePage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
