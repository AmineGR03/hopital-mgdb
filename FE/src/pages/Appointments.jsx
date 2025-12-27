import { useEffect, useState } from "react";
import api from "../api/api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    _id: "", // added to track edit
    patientId: "",
    doctorId: "",
    dateRdv: "",
    motif: "",
  });

  // Load appointments
  const loadAppointments = async () => {
    try {
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load patients & doctors for select dropdown
  const loadPatientsAndDoctors = async () => {
    try {
      const patientsRes = await api.get("/patients");
      setPatients(patientsRes.data);

      const doctorsRes = await api.get("/doctors");
      setDoctors(doctorsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAppointments();
    loadPatientsAndDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update appointment
  const addOrUpdateAppointment = async () => {
    try {
      if (form._id) {
        // Edit mode: update
        await api.put(`/appointments/${form._id}`, form);
      } else {
        // Add mode: create
        await api.post("/appointments", form);
      }
      // Reset form
      setForm({ _id: "", patientId: "", doctorId: "", dateRdv: "", motif: "" });
      loadAppointments();
    } catch (err) {
      console.error(err);
      alert("Error saving appointment");
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      loadAppointments();
    } catch (err) {
      console.error(err);
      alert("Error deleting appointment");
    }
  };

  // Populate form for editing
  const editAppointment = (a) => {
    setForm({
      _id: a._id,
      patientId: a.patientId?._id || "",
      doctorId: a.doctorId?._id || "",
      dateRdv: a.dateRdv ? new Date(a.dateRdv).toISOString().slice(0,16) : "",
      motif: a.motif || "",
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Appointments</h2>

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
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nom} {p.prenom}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.nom} {d.prenom} ({d.specialite})
                  </option>
                ))}
              </select>
            </div>
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
                type="text"
                placeholder="Motif"
                name="motif"
                value={form.motif}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-12">
              <button onClick={addOrUpdateAppointment} className="btn btn-primary">
                {form._id ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Motif</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>
                  {a.patientId?.nom} {a.patientId?.prenom}
                </td>
                <td>
                  {a.doctorId?.nom} {a.doctorId?.prenom}
                </td>
                <td>{new Date(a.dateRdv).toLocaleString()}</td>
                <td>{a.motif}</td>
                <td>{a.status}</td>
                <td>
                  <button onClick={() => editAppointment(a)} className="btn btn-sm btn-warning me-2">Edit</button>
                  <button onClick={() => deleteAppointment(a._id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}