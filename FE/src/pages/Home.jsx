import { useEffect, useState } from "react";
import api from "../api/api";
import {store} from "../store/store";

export default function Home() {
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    prescriptions: 0,
  });

  const user = store?.user || {};

  const loadCounts = async () => {
    try {
      const [patientsRes, doctorsRes, appointmentsRes, prescriptionsRes] = await Promise.all([
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  return (
    <div className="container mt-4">
      <div className="mb-5">
        <h1 className="display-5 fw-bold text-dark">Bienvenue, {user.username || "User"}!</h1>
        <p className="lead text-muted">
          <span className="badge bg-secondary">{user.role || "N/A"}</span>
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                  </svg>
                </div>
              </div>
              <h3 className="h6 text-muted text-uppercase mb-2">Patients</h3>
              <p className="display-6 fw-bold text-primary mb-0">{counts.patients}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-success" viewBox="0 0 16 16">
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                    <path d="M8 7.5a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1"/>
                  </svg>
                </div>
              </div>
              <h3 className="h6 text-muted text-uppercase mb-2">Médecins</h3>
              <p className="display-6 fw-bold text-success mb-0">{counts.doctors}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-warning" viewBox="0 0 16 16">
                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                  </svg>
                </div>
              </div>
              <h3 className="h6 text-muted text-uppercase mb-2">Rendez-vous</h3>
              <p className="display-6 fw-bold text-warning mb-0">{counts.appointments}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-info" viewBox="0 0 16 16">
                    <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
                    <path d="M9.05 8.352V7.078c0-.412-.344-.75-.75-.75H7.3c-.345 0-.631.293-.631.656v.469l-.214.035a1.69 1.69 0 0 0-.915.447l-.213.214a.53.53 0 0 0-.156.374V9h5v-.477a.53.53 0 0 0-.156-.374l-.213-.214a1.69 1.69 0 0 0-.915-.447l-.214-.035v-.101zM10.5 10H5.675l-.219 1.094A.53.53 0 0 0 6 11.625h4c.29 0 .531-.242.544-.531z"/>
                  </svg>
                </div>
              </div>
              <h3 className="h6 text-muted text-uppercase mb-2">Ordonnances</h3>
              <p className="display-6 fw-bold text-info mb-0">{counts.prescriptions}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-3">Vue d'ensemble</h5>
              <p className="text-muted mb-0">
                Système de gestion hospitalière - Tableau de bord principal pour gérer les patients, médecins, rendez-vous et ordonnances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}