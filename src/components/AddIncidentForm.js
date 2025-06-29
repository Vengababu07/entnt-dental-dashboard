import { useState } from "react";
import { getData, setData } from "../services/storage";
import { v4 as uuidv4 } from "uuid";
import { convertToBase64 } from "../utils/fileUtils"; //  base64 converter

export default function AddIncidentForm({ patientId, onIncidentAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
  });

  const [files, setFiles] = useState([]); // store uploaded files

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

    const newIncident = {
      ...form,
      id: uuidv4(),
      patientId,
      cost: 0,
      status: "Pending",
      files: files, //  include files in incident object
    };

    const incidents = getData("incidents");
    incidents.push(newIncident);
    setData("incidents", incidents);

    alert("Appointment added!");

    // Reset form
    setForm({
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
    });
    setFiles([]);
    onIncidentAdded && onIncidentAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 border rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Add Appointment</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        name="comments"
        value={form.comments}
        onChange={handleChange}
        placeholder="Comments"
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        name="appointmentDate"
        type="datetime-local"
        value={form.appointmentDate}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      {/*  File Upload */}
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="w-full p-2 border rounded mb-3"
      />

      {/*  File Preview */}
      {files.length > 0 && (
        <div className="space-y-2 mb-3">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-medium">{f.name}</span>
              {f.url.startsWith("data:image") ? (
                <img src={f.url} alt={f.name} className="w-16 h-16 object-cover rounded" />
              ) : (
                <a href={f.url} download={f.name} className="text-blue-600 underline">
                  Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Add Appointment
      </button>
    </form>
  );
}
