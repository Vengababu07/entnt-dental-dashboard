// File: src/pages/Calendar.js
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getData } from "../services/storage";

export default function CalendarView() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const data = getData("incidents") || [];
    setAppointments(data);
  }, []);

  const eventsOnDate = appointments.filter(
    (i) => new Date(i.appointmentDate).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Appointments Calendar</h2>

      {/* 📅 Calendar */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) => {
          const hasEvent = appointments.some(
            (i) => new Date(i.appointmentDate).toDateString() === date.toDateString()
          );
          return hasEvent ? "bg-blue-100 rounded-lg" : null;
        }}
      />

      {/* 📋 Appointments on selected day */}
      <div className="bg-white mt-6 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          Appointments on {selectedDate.toDateString()}
        </h3>

        {eventsOnDate.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled.</p>
        ) : (
          <ul className="space-y-3">
            {eventsOnDate.map((i) => (
              <li key={i.id} className="border p-3 rounded bg-gray-50">
                <div className="font-medium text-blue-800">{i.title}</div>
                <div className="text-sm text-gray-600">
                  {new Date(i.appointmentDate).toLocaleTimeString()} — ₹{i.cost} — {i.status}
                </div>
                <div className="text-sm">{i.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
