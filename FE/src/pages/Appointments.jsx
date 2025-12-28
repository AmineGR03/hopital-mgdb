import { useEffect, useState } from "react";
import api from "../api/api";
import { store } from "../store/store";

export default function Appointments() {
  const user = store.user;

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    _id: "",
    patientId: "",
    doctorId: user.role === "doctor" ? user.doctorId : "",
    dateRdv: "",
    motif: "",
  });

const loadData = async () => {
  try {
    
    const appRes = await api.get("/appointments");

    
    const doctorIdStr = user.doctorId?._id ? String(user.doctorId._id) : String(user.doctorId);

    
    const filteredAppointments =
      user.role === "doctor"
        ? appRes.data.filter((a) => String(a.doctorId?._id) === doctorIdStr)
        : appRes.data;

    setAppointments(filteredAppointments);

    
    const patRes = await api.get("/patients");
    setPatients(patRes.data);

    const docRes = await api.get("/doctors");
    setDoctors(docRes.data);
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOrUpdateAppointment = async () => {
    try {
      if (!form.patientId || !form.dateRdv) {
        return alert("Patient et date obligatoires");
      }

      const payload = {
        patientId: form.patientId,
        doctorId: user.role === "doctor" ? user.doctorId : form.doctorId,
        dateRdv: new Date(form.dateRdv).toISOString(),
        motif: form.motif,
      };

      if (form._id) {
        await api.put(`/appointments/${form._id}`, payload);
      } else {
        await api.post("/appointments", payload);
      }

      setForm({
        _id: "",
        patientId: "",
        doctorId: user.role === "doctor" ? user.doctorId : "",
        dateRdv: "",
        motif: "",
      });

      loadData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Supprimer ce rendez-vous ?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression");
    }
  };

  const editAppointment = (a) => {
    setForm({
      _id: a._id,
      patientId: a.patientId?._id || "",
      doctorId:
        user.role === "doctor" ? user.doctorId : a.doctorId?._id || "",
      dateRdv: a.dateRdv
        ? new Date(a.dateRdv).toISOString().slice(0, 16)
        : "",
      motif: a.motif || "",
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Appointments</h2>

      {/* FORM */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Sélectionner un patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nom} {p.prenom}
                  </option>
                ))}
              </select>
            </div>

            {user.role !== "doctor" && (
              <div className="col-md-6">
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Sélectionner un médecin</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.nom} {d.prenom}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-md-6">
              <input
                type="datetime-local"
                name="dateRdv"
                value={form.dateRdv}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <input
                name="motif"
                placeholder="Motif"
                value={form.motif}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-12">
              <button
                onClick={addOrUpdateAppointment}
                className={`btn ${
                  form._id ? "btn-warning" : "btn-primary"
                }`}
              >
                {form._id ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Patient</th>
                <th>Médecin</th>
                <th>Date</th>
                <th>Motif</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patientId?.nom} {a.patientId?.prenom}</td>
                  <td>{a.doctorId?.nom} {a.doctorId?.prenom}</td>
                  <td>{new Date(a.dateRdv).toLocaleString()}</td>
                  <td>{a.motif}</td>
                  <td>{a.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => editAppointment(a)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteAppointment(a._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    Aucun rendez-vous
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
