// src/components/AddPatientForm.js
import { useState } from "react";
import { getData, setData } from "../services/storage";
import { v4 as uuidv4 } from "uuid";

export default function AddPatientForm({ onPatientAdded }) {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    contact: "",
    gender: "",
    healthInfo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPatient = { id: uuidv4(), ...form };
    const patients = getData("patients") || [];
    patients.push(newPatient);
    setData("patients", patients);

    onPatientAdded && onPatientAdded();
    setForm({
      name: "",
      dob: "",
      contact: "",
      gender: "",
      healthInfo: "",
    });

    alert(" Patient added successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md bg-white border p-4 rounded shadow space-y-3"
    >
      <h2 className="text-xl font-semibold">➕ Add New Patient</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
        className="w-full p-2 border rounded"
      />

      <input
        name="dob"
        type="date"
        value={form.dob}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        name="contact"
        value={form.contact}
        onChange={handleChange}
        placeholder="Contact Number"
        required
        className="w-full p-2 border rounded"
      />

      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <textarea
        name="healthInfo"
        value={form.healthInfo}
        onChange={handleChange}
        placeholder="Health Info"
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Patient
      </button>
    </form>
  );
}
