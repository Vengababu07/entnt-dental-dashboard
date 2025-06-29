
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getData, setData } from "../services/storage";
import { v4 as uuidv4 } from "uuid";
import { convertToBase64 } from "../utils/fileUtils";

const treatmentOptions = [
  { name: "General Checkup", cost: 300 },
  { name: "Root Canal", cost: 1000 },
  { name: "Tooth Cleaning", cost: 500 },
];

export default function PatientAppointments() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    patientName: user?.name || "",
    age: "",
    treatment: "",
    description: "",
    comments: "",
    appointmentDate: "",
  });

  const [files, setFiles] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    setIncidents(getData("incidents") || []);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const uploads = await Promise.all(
      selectedFiles.map(async (file) => {
        const base64 = await convertToBase64(file);
        return { name: file.name, url: base64 };
      })
    );
    setFiles(uploads);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allIncidents = getData("incidents") || [];

    // 🛑 Prevent duplicate appointment
    const alreadyExists = allIncidents.some(
      (i) => i.patientId === user.patientId && i.appointmentDate === form.appointmentDate
    );
    if (alreadyExists) {
      alert("You already have an appointment booked at this date and time.");
      return;
    }

    const selectedTreatment = treatmentOptions.find((t) => t.name === form.treatment);

    const newIncident = {
      ...form,
      id: uuidv4(),
      patientId: user.patientId,
      title: form.treatment, // ✅ treatment type used as 'title'
      cost: selectedTreatment ? selectedTreatment.cost : 500,
      status: "Pending",
      files,
    };

    const updatedIncidents = [...allIncidents, newIncident];
    setData("incidents", updatedIncidents);
    setIncidents(updatedIncidents);

    alert("Appointment booked!");
    setForm({
      patientName: user.name || "",
      age: "",
      treatment: "",
      description: "",
      comments: "",
      appointmentDate: "",
    });
    setFiles([]);
  };

  const now = new Date();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">My Appointments</h2>

      {/* ✅ Book new appointment form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <h3 className="text-lg font-semibold">Book New Appointment</h3>

        <input
          name="patientName"
          type="text"
          value={form.patientName}
          onChange={handleChange}
          placeholder="Patient Name"
          required
          className="w-full p-2 border rounded"
        />

        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="treatment"
          value={form.treatment}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Treatment</option>
          {treatmentOptions.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name} - ₹{t.cost}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
        />

        <input
          name="comments"
          value={form.comments}
          onChange={handleChange}
          placeholder="Comments"
          className="w-full p-2 border rounded"
        />

        <input
          name="appointmentDate"
          type="datetime-local"
          value={form.appointmentDate}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Book Appointment
        </button>
      </form>

      {/* ✅ Appointment history */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Your Appointment History</h3>
        <ul className="space-y-3">
          {incidents
            .filter((i) => i.patientId === user.patientId)
            .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
            .map((i) => (
              <li key={i.id} className="border p-3 rounded space-y-1">
                <div className="font-medium">{i.title} — ₹{i.cost}</div>
                <div className="text-sm text-gray-600">{new Date(i.appointmentDate).toLocaleString()}</div>
                <div>{i.description}</div>
                <div className="text-sm italic text-gray-500">Status: {i.status}</div>
                {i.files?.length > 0 && (
                  <div className="mt-2 text-sm">
                    <strong>Files:</strong>
                    <ul className="ml-4 list-disc">
                      {i.files.map((f, index) => (
                        <li key={index}>
                          <a href={f.url} download={f.name} className="text-blue-600 underline">
                            {f.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
