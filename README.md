# 🦷 ENTNT Dental Center Management Dashboard

Welcome to the **ENTNT Dental Center** project — a responsive frontend dashboard built using **React** and **localStorage**. This system allows **Admins (Dentists)** and **Patients** to manage appointments, treatment records, and patient profiles efficiently.

---

## Key Roles

- **Admin (Dentist)**: Can view, add, delete patients, manage appointments, view calendar, revenue, and upload treatment records.
- **Patient**: Can book appointments, view their treatment history, upload files, and see appointment costs.

---

## Features

✅ Login with Role-based Access  
✅ LocalStorage data simulation (no backend)  
✅ Add, Edit, Delete Patients (Admin only)  
✅ Book Appointments with File Upload (Patient)  
✅ Appointment Status Management (Admin)  
✅ Auto-calculated Revenue (based on accepted appointments)  
✅ Calendar View for Admins  
✅ KPI Dashboard (Revenue, Top Patients, Upcoming Appointments)  
✅ Fully Responsive  
✅ Deployed via Vercel

---

## 🧪 Test Credentials

### Admin
- **Email:** `admin@entnt.in`
- **Password:** `admin123`

### Patient (Example)
- **Email:** `john@entnt.in`
- **Password:** `patient123`

---

## 🛠️ Tech Stack

- React (Functional Components)
- React Router
- Context API
- TailwindCSS
- localStorage (data persistence)
- UUID for ID generation
- File upload via base64 encoding

---

##  Getting Started (Local Setup)

```bash
# Install dependencies
npm install

# Start the development server
npm start

 To see outputs navigate to the public -> screenshots -> images

Data is stored in LocalStorage

To see LocalStorage Click on Inspect in Browser -> Applications-> LocalStorage -> localhost 
