
import { useEffect, useState } from "react";
import { getData } from "../services/storage";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    statusCounts: { Pending: 0, Completed: 0, Cancelled: 0 },
    topPatients: [],
    upcoming: [],
    genderCount: { Male: 0, Female: 0, Other: 0 },
  });

  useEffect(() => {
    const patients = getData("patients") || [];
    const incidents = getData("incidents") || [];

    const revenue = incidents
      .filter((i) => i.status === "Completed")
      .reduce((sum, i) => sum + (i.cost || 0), 0);

    const statusCounts = incidents.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {});

    const upcoming = [...incidents]
      .filter(i => new Date(i.appointmentDate) > new Date())
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, 10);

    const patientMap = {};
    incidents.forEach((i) => {
      patientMap[i.patientId] = (patientMap[i.patientId] || 0) + 1;
    });

    const topPatients = patients
      .map((p) => ({ ...p, count: patientMap[p.id] || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const genderCount = patients.reduce(
      (acc, p) => {
        if (p.gender === "Male") acc.Male++;
        else if (p.gender === "Female") acc.Female++;
        else acc.Other++;
        return acc;
      },
      { Male: 0, Female: 0, Other: 0 }
    );

    setStats({
      totalPatients: patients.length,
      totalAppointments: incidents.length,
      totalRevenue: revenue,
      statusCounts,
      topPatients,
      upcoming,
      genderCount,
    });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Total Patients</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Total Appointments</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalAppointments}</p>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-3xl font-bold text-rose-600">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Gender Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4 text-center">
          <h4 className="font-semibold mb-2">Gender Breakdown</h4>
          <ul className="text-sm space-y-1">
            <li>👨‍⚕️ Male: {stats.genderCount.Male}</li>
            <li>👩‍⚕️ Female: {stats.genderCount.Female}</li>
            <li>⚧️ Other: {stats.genderCount.Other}</li>
          </ul>
        </div>

        {/* Status Summary */}
        {["Pending", "Completed", "Cancelled"].map((status) => (
          <div key={status} className="bg-gray-50 border p-4 rounded shadow text-center">
            <h4 className="font-semibold">{status}</h4>
            <p className="text-xl font-bold">{stats.statusCounts[status] || 0}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Upcoming Appointments</h3>
        <ul className="space-y-2">
          {stats.upcoming.map((i) => (
            <li key={i.id} className="border p-2 rounded">
              <strong>{i.title}</strong> — {new Date(i.appointmentDate).toLocaleString()} — ₹{i.cost}
            </li>
          ))}
        </ul>
      </div>

      {/* Top Patients */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Top Patients (by visits)</h3>
        <ul className="space-y-1">
          {stats.topPatients.map((p) => (
            <li key={p.id} className="text-sm">
              {p.name} ({p.gender || "N/A"}) — {p.count} appointments
            </li>
          ))}
        </ul>
      </div>

      <Link to="/all-appointments" className="block text-blue-600 text-sm text-center mt-6">
        🏥 View All Appointments
      </Link>

      <div className="text-center">
        <Link to="/calendar" className="text-blue-600 underline text-lg">
          📅 View Full Calendar
        </Link>
      </div>
    </div>
  );
}
