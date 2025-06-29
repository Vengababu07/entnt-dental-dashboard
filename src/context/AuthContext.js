import { createContext, useContext, useState, useEffect } from "react";
import { getData, setData } from "../services/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Seed admin user if not exists
    const users = getData("users") || [];

    const adminExists = users.some((u) => u.email === "admin@entnt.in");

    if (!adminExists) {
      users.push({
        id: "admin-1",
        role: "Admin",
        email: "admin@entnt.in",
        password: "admin123",
      });
      setData("users", users);
    }

    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email, password) => {
    const users = getData("users") || [];
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
