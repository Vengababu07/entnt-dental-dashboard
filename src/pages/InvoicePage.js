
import { useParams } from "react-router-dom";
import { getData } from "../services/storage";
import { useEffect, useState } from "react";

export default function InvoicePage() {
  const { id } = useParams(); // appointment ID
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const allAppointments = getData("incidents") || [];
    const allPatients = getData("patients") || [];

    const found = allAppointments.find((a) => a.id === id);
    if (found) {
      setAppointment(found);
      const patientDetails = allPatients.find((p) => p.id === found.patientId);
      setPatient(patientDetails);
    }
  }, [id]);

  if (!appointment) return <p className="p-6 text-center">Appointment not found.</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow rounded space-y-4 print:p-12">
      <h1 className="text-2xl font-bold mb-2 text-center">🧾 Invoice</h1>
      
      <div>
        <strong>Invoice ID:</strong> {appointment.id}
      </div>

      <div>
        <strong>Patient Name:</strong> {patient?.name || "Unknown"}
      </div>

      <div>
        <strong>Treatment:</strong> {appointment.title}
      </div>

      <div>
        <strong>Appointment Date:</strong>{" "}
        {new Date(appointment.appointmentDate).toLocaleString()}
      </div>

      <div>
        <strong>Cost:</strong> ₹{appointment.cost}
      </div>

      <div>
        <strong>Status:</strong> {appointment.status}
      </div>

      <div>
        <strong>Description:</strong>
        <p className="text-gray-700 mt-1">{appointment.description}</p>
      </div>

      {appointment.comments && (
        <div>
          <strong>Comments:</strong>
          <p className="text-gray-700 mt-1">{appointment.comments}</p>
        </div>
      )}

      {appointment.files?.length > 0 && (
        <div>
          <strong>Attached Files:</strong>
          <ul className="list-disc ml-5 mt-1">
            {appointment.files.map((file, idx) => (
              <li key={idx}>
                <a href={file.url} download={file.name} className="text-blue-600 underline">
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => window.print()}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        🖨️ Print Invoice
      </button>
    </div>
  );
}
