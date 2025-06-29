
import { useState } from "react";
import { getData, setData } from "../services/storage";
import { v4 as uuidv4 } from "uuid";

export default function AddPatientForm({ onPatientAdded }) {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    contact: "",
    healthInfo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPatient = { ...form, id: uuidv4() };
    const patients = getData("patients");
    patients.push(newPatient);
    setData("patients", patients);
    onPatientAdded && onPatientAdded(); // Refresh list
    setForm({ name: "", dob: "", contact: "", healthInfo: "" });
    alert("Patient added!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Patient</h2>

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
      <textarea
        name="healthInfo"
        value={form.healthInfo}
        onChange={handleChange}
        placeholder="Health Info"
        className="w-full mb-3 p-2 border rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Patient
      </button>
    </form>
  );
}
