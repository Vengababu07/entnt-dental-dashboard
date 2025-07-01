# 🦷 ENTNT Dental Center Management Dashboard

Welcome to the **ENTNT Dental Center** project — a responsive frontend dashboard built using **React** and **localStorage**. This system allows **Admins (Dentists)** and **Patients** to manage appointments, treatment records, and patient profiles efficiently.

---

Setup Instructions
Clone Repository
git clone https://github.com/your-username/entnt-dental-dashboard.git
cd entnt-dental-dashboard

**Install Dependencies
npm install

**Run the App
npm start

**Build for Production
npm run build
**Default Users
**Credentials are stored in localStorage under the key users.
**Admin
Email: admin@entnt.in
Password: admin123

**Patient
Email: john@entnt.in
Password: patient123

Admins can add new patients and appointments.

**Core Features
Authentication (Simulated)
Email/password login
Role-based access (Admin/Patient)
Session persistence via localStorage
Admin Dashboard
View KPIs: revenue, appointments, patients
Manage all patients and their details
Add, update, and delete appointments
Upload treatment files (base64)
Patient Dashboard
Book new appointments
View history and upcoming visits
See cost, treatment info, and uploaded files
Calendar View
Weekly/monthly view of all appointments
Invoice Generator
Print-friendly invoice for each appointment

**Technical Decisions
State Management:
Used React Context API for lightweight authentication and role-based access.

**Data Handling:
All data (users, patients, incidents) is persisted via localStorage. File uploads are stored as base64 strings.

**Styling:
TailwindCSS used for consistent design and rapid development.

Routing:
Protected routes implemented using a custom ProtectedRoute wrapper with role restrictions.

**Responsiveness:
Fully responsive layout tested on desktop and mobile.

**Known Issues
Data is device-bound. Since localStorage is used, data won’t sync across devices unless manually seeded.
No actual backend: user registration or reset password is simulated only.
File uploads are stored in base64 and may increase localStorage size for larger files.

Screenshots
Located in the /screenshots folder or attached to the GitHub repository

Deployment
Deployed via Vercel. Any git push to main triggers auto deployment.
