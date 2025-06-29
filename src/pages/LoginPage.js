
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = login(email, password);
    if (user) {
      if (user.role === "Patient") {
        navigate("/appointments");
      } else if (user.role === "Admin") {
        navigate("/");
      } else {
        alert("Unknown role!");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white">
      {/* ✨ Fantasy Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-wide text-purple-200 drop-shadow-md">
           Welcome to
        </h1>
        <h2 className="text-5xl font-bold text-white drop-shadow-xl mt-2">
           Dental Center Management 🦷
        </h2>
      </div>

      {/* 💡 Login Box */}
      <div className="bg-white text-black p-8 rounded-lg shadow-md w-80">
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold mb-4 text-center">Login</h3>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white p-2 rounded"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          New user?{" "}
          <a href="/register" className="text-blue-600 underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
