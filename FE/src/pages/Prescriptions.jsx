import { useEffect, useState } from "react";
import api from "../api/api";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    _id: "", // added for edit
    patientId: "",
    doctorId: "",
    date: "",
    medicaments: "",
    instructions: "",
  });

  const loadData = async () => {
    try {
      const presRes = await api.get("/prescriptions");
      setPrescriptions(presRes.data);

      const patientsRes = await api.get("/patients");
      setPatients(patientsRes.data);

      const doctorsRes = await api.get("/doctors");
      setDoctors(doctorsRes.data);
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

  const addOrUpdatePrescription = async () => {
    try {
      if (!form.patientId || !form.doctorId || !form.date) {
        return alert("Please fill patient, doctor and date.");
      }

      const payload = {
        patientId: form.patientId,
        doctorId: form.doctorId,
        date: new Date(form.date).toISOString(),
        medicaments: form.medicaments
          ? form.medicaments.split(",").map((m) => m.trim())
          : [],
        instructions: form.instructions || "",
      };

      if (form._id) {
        await api.put(`/prescriptions/${form._id}`, payload);
      } else {
        await api.post("/prescriptions", payload);
      }

      setForm({ _id: "", patientId: "", doctorId: "", date: "", medicaments: "", instructions: "" });
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error saving prescription: " + (err.response?.data?.message || err.message));
    }
  };

  const deletePrescription = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;
    try {
      await api.delete(`/prescriptions/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error deleting prescription");
    }
  };

  const editPrescription = (p) => {
    setForm({
      _id: p._id,
      patientId: p.patientId?._id || "",
      doctorId: p.doctorId?._id || "",
      date: p.date ? new Date(p.date).toISOString().slice(0, 10) : "",
      medicaments: p.medicaments.join(", "),
      instructions: p.instructions || "",
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Prescriptions</h2>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <select name="patientId" value={form.patientId} onChange={handleChange} className="form-select">
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>{p.nom} {p.prenom}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <select name="doctorId" value={form.doctorId} onChange={handleChange} className="form-select">
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>{d.nom} {d.prenom}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <input type="date" name="date" value={form.date} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-4">
              <input
                placeholder="Medicaments (comma)"
                name="medicaments"
                value={form.medicaments}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <input
                placeholder="Instructions"
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-12">
              <button onClick={addOrUpdatePrescription} className="btn btn-primary">
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
              <th>Medicaments</th>
              <th>Instructions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p._id}>
                <td>{p.patientId?.nom} {p.patientId?.prenom}</td>
                <td>{p.doctorId?.nom} {p.doctorId?.prenom}</td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>{p.medicaments.join(", ")}</td>
                <td>{p.instructions}</td>
                <td>
                  <button onClick={() => editPrescription(p)} className="btn btn-sm btn-warning me-2">Edit</button>
                  <button onClick={() => deletePrescription(p._id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}