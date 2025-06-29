import { useState } from "react";
import { getData, setData } from "../services/storage";
import { v4 as uuidv4 } from "uuid";

export default function AddAppointmentForm({ onAppointmentAdded }) {
  const [form, setForm] = useState({
    patientId: "",
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    cost: "",
  });

  const patients = getData("patients") || [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const incidents = getData("incidents") || [];

    const newIncident = {
      id: uuidv4(),
      ...form,
      cost: parseInt(form.cost),
      status: "Pending",
      files: [],
    };

    incidents.push(newIncident);
    setData("incidents", incidents);
    onAppointmentAdded?.();
    alert("Appointment added!");
    setForm({
      patientId: "",
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
      cost: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Add New Appointment</h3>

      <select
        name="patientId"
        value={form.patientId}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">Select Patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        name="title"
        placeholder="Treatment Title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded mb-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded mb-2"
      />

      <input
        name="comments"
        placeholder="Comments"
        value={form.comments}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        name="appointmentDate"
        type="datetime-local"
        value={form.appointmentDate}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded mb-2"
      />

      <input
        name="cost"
        type="number"
        placeholder="Cost (₹)"
        value={form.cost}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded mb-2"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Appointment
      </button>
    </form>
  );
}
