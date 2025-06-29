
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData, setData } from "../services/storage";
import { v4 as uuidv4 } from "uuid";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    dob: "",
    contact: "",
    gender: "",
    healthInfo: "",
    role: "Patient", // ✅ default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = getData("users") || [];
    const patients = getData("patients") || [];

    if (users.find((u) => u.email === form.email)) {
      alert("Email already registered.");
      return;
    }

    const userId = uuidv4();
    const patientId = uuidv4();

    users.push({
      id: userId,
      role: form.role,
      email: form.email,
      password: form.password,
      ...(form.role === "Patient" && { patientId }), // ✅ Only if role is Patient
    });

    if (form.role === "Patient") {
      patients.push({
        id: patientId,
        name: form.name,
        dob: form.dob,
        contact: form.contact,
        gender: form.gender,
        healthInfo: form.healthInfo,
      });
      setData("patients", patients);
    }

    setData("users", users);
    alert(`${form.role} registered successfully! Please login.`);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        {/* Role Selection */}
        <label className="text-sm mb-1 block">Register as:</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="Patient">Patient</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Common Fields */}
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Conditional Fields for Patient */}
        {form.role === "Patient" && (
          <>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Contact Number"
              required
              className="w-full mb-3 p-2 border rounded"
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full mb-3 p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              name="healthInfo"
              value={form.healthInfo}
              onChange={handleChange}
              placeholder="Health Info"
              className="w-full mb-3 p-2 border rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
