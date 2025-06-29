import { useEffect, useState } from "react";
import { getData } from "../services/storage";
import { Link } from "react-router-dom";
import AddPatientForm from "../components/AddPatientForm";
import { useAuth } from "../context/AuthContext"; // Logout support

export default function Dashboard() {
  const { logout } = useAuth(); //  use logout
  const [showAddForm, setShowAddForm] = useState(false);

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    statusCounts: { Pending: 0, Completed: 0, Cancelled: 0 },
    topPatients: [],
    upcoming: [],
    genderCount: { Male: 0, Female: 0, Other: 0 },
  });

  const loadStats = () => {
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
      .filter((i) => new Date(i.appointmentDate) > new Date())
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
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-extrabold text-center text-blue-700 drop-shadow-md">
        🦷 Admin Dashboard - ENTNT Dental Center
      </h2>

      {/* ➕ Add Patient Toggle */}
      <div className="text-right mb-4">
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? "Close Form" : "➕ Add New Patient"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-4 rounded shadow">
          <AddPatientForm
            onPatientAdded={() => {
              setShowAddForm(false);
              loadStats(); // 🔄 Refresh dashboard stats
            }}
          />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded shadow p-6 text-center">
          <h3 className="text-lg font-semibold">Total Patients</h3>
          <p className="text-4xl font-bold">{stats.totalPatients}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded shadow p-6 text-center">
          <h3 className="text-lg font-semibold">Total Appointments</h3>
          <p className="text-4xl font-bold">{stats.totalAppointments}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded shadow p-6 text-center">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-4xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Gender + Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-4 text-center">
          <h4 className="font-semibold mb-2">👥 Gender Breakdown</h4>
          <ul className="text-sm space-y-1">
            <li className="text-blue-600"> Male: {stats.genderCount.Male}</li>
            <li className="text-pink-600"> Female: {stats.genderCount.Female}</li>
            <li className="text-purple-600"> Other: {stats.genderCount.Other}</li>
          </ul>
        </div>

        {["Pending", "Completed", "Cancelled"].map((status) => {
          const emoji = {
            Pending: "⏳",
            Completed: "✅",
            Cancelled: "❌",
          }[status];
          return (
            <div key={status} className="bg-white border p-4 rounded shadow text-center">
              <h4 className="font-semibold text-lg">
                {emoji} {status}
              </h4>
              <p className="text-xl font-bold">{stats.statusCounts[status] || 0}</p>
            </div>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">📅 Upcoming Appointments</h3>
        {stats.upcoming.length === 0 ? (
          <p className="text-gray-600 italic">No upcoming appointments</p>
        ) : (
          <ul className="space-y-2">
            {stats.upcoming.map((i) => (
              <li key={i.id} className="border p-2 rounded">
                <strong>{i.title}</strong> —{" "}
                {new Date(i.appointmentDate).toLocaleString()} — ₹{i.cost}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Top Patients */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">🏆 Top Patients (by visits)</h3>
        {stats.topPatients.length === 0 ? (
          <p className="text-gray-600 italic">No patient records found</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {stats.topPatients.map((p) => (
              <li key={p.id}>
                {p.name} ({p.gender || "N/A"}) — {p.count} appointments
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation */}
      <div className="text-center space-y-2">
        <Link to="/all-appointments" className="text-blue-700 font-semibold underline block">
          🏥 View All Appointments
        </Link>
        <Link to="/calendar" className="text-purple-600 font-semibold underline block">
          📅 View Full Calendar
        </Link>
      </div>

      {/* Logout Button */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          🔒 Logout
        </button>
      </div>
    </div>
  );
}
