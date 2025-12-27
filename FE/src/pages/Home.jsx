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
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.username || "User"}!</h2>
      <p>Role: {user.role || "N/A"}</p>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 5 }}>
          <h3>Patients</h3>
          <p>{counts.patients}</p>
        </div>
        <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 5 }}>
          <h3>Doctors</h3>
          <p>{counts.doctors}</p>
        </div>
        <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 5 }}>
          <h3>Appointments</h3>
          <p>{counts.appointments}</p>
        </div>
        <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 5 }}>
          <h3>Prescriptions</h3>
          <p>{counts.prescriptions}</p>
        </div>
      </div>
    </div>
  );
}
