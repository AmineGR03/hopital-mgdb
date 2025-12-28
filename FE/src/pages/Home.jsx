import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { store } from "../store/store";

export default function Home() {
  const user = store.user;

  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    prescriptions: 0,
  });

  const loadCounts = async () => {
    try {
      if (user.role === "doctor") {
        const res = await api.get("/dashboard/doctor");
        setCounts({
          patients: 0,
          doctors: 0,
          appointments: res.data.appointments,
          prescriptions: res.data.prescriptions,
        });
      } else {
        const [patientsRes, doctorsRes, appointmentsRes, prescriptionsRes] =
          await Promise.all([
            api.get("/patients"),
            api.get("/doctors"),
            api.get("/appointments"),
            api.get("/prescriptions"),
          ]);

        setCounts({
          patients: patientsRes.data.length,
          doctors: doctorsRes.data.length,
          appointments: appointmentsRes.data.length,
          prescriptions: prescriptionsRes.data.length,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">
          👋 Bienvenue, <span className="text-primary">{user.username}</span>
        </h2>
        <p className="text-muted">
          {user.role === "doctor"
            ? "Tableau de bord personnel"
            : "Tableau de bord général du système"}
        </p>
      </div>

      {/* Cards navigation */}
      <div className="row g-4">
        {/* Appointments */}
        <div className="col-md-3">
          <Link to="/appointments" className="text-decoration-none">
            <div className="card shadow-sm border-0 h-100 text-center hover">
              <div className="card-body">
                <div className="fs-1">📅</div>
                <h6 className="text-muted mt-2">Appointments</h6>
                <h2 className="fw-bold">{counts.appointments}</h2>
              </div>
            </div>
          </Link>
        </div>

        {/* Patients */}
        {user.role !== "doctor" && (
          <div className="col-md-3">
            <Link to="/patients" className="text-decoration-none">
              <div className="card shadow-sm border-0 h-100 text-center">
                <div className="card-body">
                  <div className="fs-1">🧑‍🤝‍🧑</div>
                  <h6 className="text-muted mt-2">Patients</h6>
                  <h2 className="fw-bold">{counts.patients}</h2>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Prescriptions */}
        <div className="col-md-3">
          <Link to="/prescriptions" className="text-decoration-none">
            <div className="card shadow-sm border-0 h-100 text-center">
              <div className="card-body">
                <div className="fs-1">💊</div>
                <h6 className="text-muted mt-2">Prescriptions</h6>
                <h2 className="fw-bold">{counts.prescriptions}</h2>
              </div>
            </div>
          </Link>
        </div>

        {/* Profile */}
        <div className="col-md-3">
          <Link to="/profile" className="text-decoration-none">
            <div className="card shadow-sm border-0 h-100 text-center">
              <div className="card-body">
                <div className="fs-1">👤</div>
                <h6 className="text-muted mt-2">Profile</h6>
                <p className="fw-bold text-primary mb-0">View / Edit</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Doctors (admin only) */}
        {user.role !== "doctor" && (
          <div className="col-md-3">
            <Link to="/doctors" className="text-decoration-none">
              <div className="card shadow-sm border-0 h-100 text-center">
                <div className="card-body">
                  <div className="fs-1">👨‍⚕️</div>
                  <h6 className="text-muted mt-2">Doctors</h6>
                  <h2 className="fw-bold">{counts.doctors}</h2>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 text-center text-muted small">
        Clinic Management System • Role: <b>{user.role}</b>
      </div>
    </div>
  );
}
