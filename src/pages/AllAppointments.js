<<<<<<< HEAD
=======

>>>>>>> d6205c91da66850fa8a25db16e390bb75ca35f58
import { useEffect, useState } from "react";
import { getData, setData } from "../services/storage";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import AddAppointmentForm from "../components/AddAppointmentForm"; //  Ensure this component exists

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setAppointments(getData("incidents") || []);
    setPatients(getData("patients") || []);
  }, []);

  const getPatientName = (id) => {
    const patient = patients.find((p) => p.id === id);
    return patient ? patient.name : "Unknown";
  };

  const updateStatus = (id, newStatus) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: newStatus } : a
    );
    setAppointments(updated);
    setData("incidents", updated);
  };

  const deleteAppointment = (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    setData("incidents", updated);
  };

  const handleCostChange = (id, newCost) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, cost: parseInt(newCost) || 0 } : a
    );
    setAppointments(updated);
    setData("incidents", updated);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">All Appointments</h2>

      {/* Add Appointment Form */}
      <AddAppointmentForm
        onAppointmentAdded={() =>
          setAppointments(getData("incidents") || [])
        }
      />

      {/* Appointment List */}
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((a) => (
            <li key={a.id} className="border p-4 rounded space-y-2 bg-white shadow">
              <div><strong>Patient:</strong> {getPatientName(a.patientId)}</div>
              <div><strong>Treatment:</strong> {a.title}</div>
              <div><strong>Date:</strong> {new Date(a.appointmentDate).toLocaleString()}</div>
              <div><strong>Description:</strong> {a.description}</div>
              <div><strong>Status:</strong> {a.status}</div>
              <div>
                <strong>Cost:</strong>{" "}
                <input
                  type="number"
                  value={a.cost}
                  onChange={(e) => handleCostChange(a.id, e.target.value)}
                  className="border p-1 rounded w-24"
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => updateStatus(a.id, "Completed")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(a.id, "Cancelled")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
                <Link
                  to={`/invoice/${a.id}`}
                  target="_blank"
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Invoice
                </Link>
                <button
                  onClick={() => deleteAppointment(a.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <FaTrash size={14} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
