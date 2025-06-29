import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import CalendarView from "./pages/Calendar";
import PatientAppointments from "./pages/PatientAppointments";
import AllAppointments from "./pages/AllAppointments";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// ✅ Role-based redirect for "/"
function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === "Admin" ? <Dashboard /> : <Navigate to="/appointments" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected & role-based routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute role="Admin">
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute role="Patient">
                <PatientAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute role="Admin">
                <CalendarView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-appointments"
            element={
              <ProtectedRoute role="Admin">
                <AllAppointments />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
