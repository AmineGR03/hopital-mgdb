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
        // Dashboard médecin
        const res = await api.get("/dashboard/doctor");
        setCounts({
          patients: res.data.patients,
          doctors: 0,
          appointments: res.data.appointments,
          prescriptions: res.data.prescriptions,
        });
      } else {
        // Dashboard global admin / staff
        const res = await api.get("/dashboard");
        setCounts({
          patients: res.data.patients,
          doctors: res.data.doctors,
          appointments: res.data.appointments,
          prescriptions: res.data.prescriptions,
        });
      }
    } catch (err) {
      console.error("Failed to load dashboard counts:", err);
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
            ? "Tableau de bord du médecin"
            : "Tableau de bord général"}
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="row g-4">
        {/* Appointments */}
        <div className="col-md-3">
          <Link to="/appointments" className="text-decoration-none">
            <div className="card shadow-sm border-0 text-center h-100">
              <div className="card-body">
                <div className="fs-1">📅</div>
                <h6 className="text-muted mt-2">Appointments</h6>
                <p className="fw-bold text-primary mb-0">View / Edit</p>
                <p className="fw-bold "> Accedez au rendez-vous</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Patients */}
        <div className="col-md-3">
          <Link to="/patients" className="text-decoration-none">
            <div className="card shadow-sm border-0 text-center h-100">
              <div className="card-body">
                <div className="fs-1">🧑‍🤝‍🧑</div>
                <h6 className="text-muted mt-2">
                  {user.role === "doctor" ? "My Patients" : "Patients"}
                </h6>
                <p className="fw-bold text-primary mb-0">View / Edit</p>
                <p className="fw-bold "> Accedez aux patients</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Prescriptions */}
        <div className="col-md-3">
          <Link to="/prescriptions" className="text-decoration-none">
            <div className="card shadow-sm border-0 text-center h-100">
              <div className="card-body">
                <div className="fs-1">💊</div>
                <h6 className="text-muted mt-2">Prescriptions</h6>
                <p className="fw-bold text-primary mb-0">View / Edit</p>
                <p className="fw-bold "> Accedez aux prescriptions</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Profile */}
        <div className="col-md-3">
          <Link to="/profile" className="text-decoration-none">
            <div className="card shadow-sm border-0 text-center h-100">
              <div className="card-body">
                <div className="fs-1">👤</div>
                <h6 className="text-muted mt-2">Profile</h6>
                <p className="fw-bold text-primary mb-0 mt-1 ">View / Edit</p>
                <p className="fw-bold "> Accedez a votre profile</p>
                
              </div>
            </div>
          </Link>
        </div>

        {/* Doctors (Admin only) */}
        {user.role !== "doctor" && (
          <div className="col-md-3">
            <Link to="/doctors" className="text-decoration-none">
              <div className="card shadow-sm border-0 text-center h-100">
                <div className="card-body">
                  <div className="fs-1">👨‍⚕️</div>
                  <h6 className="text-muted mt-2">Doctors</h6>
                  <p className="fw-bold text-primary mb-0 mt-1 ">View / Edit</p>
                  <h2 className="fw-bold">Accedez aux médecins</h2>
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
