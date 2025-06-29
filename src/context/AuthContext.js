import { createContext, useContext, useState, useEffect } from "react";
import { getData, setData } from "../services/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // Used to avoid flicker on refresh

  useEffect(() => {
    // Load current session
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    // Auto-seed Admin and Patient
    const users = getData("users") || [];
    const patients = getData("patients") || [];

    const adminExists = users.some((u) => u.email === "admin@entnt.in");
    const patientExists = users.some((u) => u.email === "john@entnt.in");

    const updatedUsers = [...users];
    const updatedPatients = [...patients];

    if (!adminExists) {
      updatedUsers.push({
        id: "admin-1",
        role: "Admin",
        email: "admin@entnt.in",
        password: "admin123",
      });
    }

    if (!patientExists) {
      const patientId = "p1";
      updatedUsers.push({
        id: "user-1",
        role: "Patient",
        email: "john@entnt.in",
        password: "patient123",
        patientId,
      });

      updatedPatients.push({
        id: patientId,
        name: "John Doe",
        dob: "1995-01-01",
        contact: "9876543210",
        gender: "Male",
        healthInfo: "No allergies",
      });
    }

    setData("users", updatedUsers);
    setData("patients", updatedPatients);
    setReady(true);
  }, []);

  const login = (email, password) => {
    const users = getData("users") || [];
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      setUser(found);
      return found;
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
