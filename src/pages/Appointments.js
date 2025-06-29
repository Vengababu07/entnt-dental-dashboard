// src/pages/Appointments.js
import { useEffect, useState } from "react";
import { getData } from "../services/storage";

export default function Appointments() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    setIncidents(getData("incidents"));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Appointments</h2>
      <ul className="mt-4">
        {incidents.map((i) => (
          <li key={i.id} className="border p-2 rounded my-2">
            <strong>{i.title}</strong> on{" "}
            {new Date(i.appointmentDate).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
