
import { createContext, useContext, useState, useEffect } from "react";
import { getData, setData } from "../services/storage";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); //  new flag

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setReady(true); //  context is now ready
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.email === email && u.password === password);
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
