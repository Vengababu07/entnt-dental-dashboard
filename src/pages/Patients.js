
import { useState, useEffect } from "react";
import { getData, setData } from "../services/storage";
import AddIncidentForm from "../components/AddIncidentForm";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadPatients();
    loadIncidents();
  }, []);

  const loadPatients = () => {
    setPatients(getData("patients") || []);
  };

  const loadIncidents = () => {
    setIncidents(getData("incidents") || []);
  };

  const deletePatient = (id) => {
    if (!window.confirm("Are you sure you want to delete this patient and all their appointments?")) return;

    const updatedPatients = patients.filter((p) => p.id !== id);
    const updatedIncidents = incidents.filter((i) => i.patientId !== id);

    setData("patients", updatedPatients);
    setData("incidents", updatedIncidents);

    setPatients(updatedPatients);
    setIncidents(updatedIncidents);

    if (selectedPatientId === id) setSelectedPatientId(null);
  };

  const handleStatusUpdate = (incidentId, newStatus) => {
    const updated = incidents.map((i) =>
      i.id === incidentId ? { ...i, status: newStatus } : i
    );
    setData("incidents", updated);
    setIncidents(updated);
  };

  const handleCostChange = (incidentId, newCost) => {
    const updated = incidents.map((i) =>
      i.id === incidentId ? { ...i, cost: parseInt(newCost) } : i
    );
    setData("incidents", updated);
    setIncidents(updated);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold">Patients & Appointments</h2>

      {/* Patient List */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">All Patients</h3>
        {patients.length === 0 ? (
          <p className="text-gray-600">No patients registered.</p>
        ) : (
          <ul className="space-y-3">
            {patients.map((p) => (
              <li
                key={p.id}
                className={`p-3 rounded border hover:bg-gray-50 ${
                  selectedPatientId === p.id ? "bg-blue-50 border-blue-500" : ""
                }`}
              >
                <div onClick={() => setSelectedPatientId(p.id)} className="cursor-pointer">
                  <p className="font-medium text-lg">{p.name}</p>
                  <p className="text-sm text-gray-600">DOB: {p.dob}</p>
                  <p className="text-sm text-gray-600">Gender: {p.gender || "N/A"}</p>
                  <p className="text-sm text-gray-600">Contact: {p.contact}</p>
                  <p className="text-sm text-gray-600">Health Info: {p.healthInfo}</p>
                </div>
                <button
                  onClick={() => deletePatient(p.id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Appointments for Selected Patient */}
      {selectedPatientId && (
        <>
          <div className="bg-white p-6 rounded shadow">
            <AddIncidentForm
              patientId={selectedPatientId}
              onIncidentAdded={loadIncidents}
            />
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Appointments for Selected Patient</h3>

            <div className="mb-4">
              <label className="font-semibold mr-2">Filter by status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border p-1 rounded"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <ul className="space-y-4">
              {incidents
                .filter((i) => i.patientId === selectedPatientId)
                .filter((i) => statusFilter === "All" || i.status === statusFilter)
                .map((i) => (
                  <li key={i.id} className="border p-4 rounded space-y-2">
                    <div><strong>Treatment:</strong> {i.title}</div>
                    <div><strong>Date:</strong> {new Date(i.appointmentDate).toLocaleString()}</div>
                    <div><strong>Description:</strong> {i.description}</div>

                    <div>
                      <label className="block font-semibold">Cost (₹):</label>
                      <input
                        type="number"
                        value={i.cost || 0}
                        onChange={(e) => handleCostChange(i.id, e.target.value)}
                        className="border p-1 rounded w-32"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold">Status:</label>
                      <select
                        value={i.status}
                        onChange={(e) => handleStatusUpdate(i.id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option>Pending</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded"
                        onClick={() => handleStatusUpdate(i.id, "Completed")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => handleStatusUpdate(i.id, "Cancelled")}
                      >
                        Reject
                      </button>
                      <a
                        href={`/invoice/${i.id}`}
                        target="_blank"
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Invoice
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
