import { useEffect, useState } from "react";
import api from "../api/api";
import { store } from "../store/store";

export default function Prescriptions() {
  const user = store.user;

  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    _id: "",
    patientId: "",
    doctorId: user.role === "doctor" ? user.doctorId : "",
    date: "",
    medicaments: "",
    instructions: "",
  });

const loadData = async () => {
  try {
    // Récupérer toutes les prescriptions
    const presRes = await api.get("/prescriptions");

    // Récupérer l'ID du docteur en string pour comparaison
    const doctorIdStr = user.doctorId?._id ? String(user.doctorId._id) : String(user.doctorId);

    // Filtrer uniquement les prescriptions du docteur connecté
    const filteredPrescriptions =
      user.role === "doctor"
        ? presRes.data.filter((p) => String(p.doctorId?._id) === doctorIdStr)
        : presRes.data;

    setPrescriptions(filteredPrescriptions);

    // Récupérer les patients et médecins pour les dropdowns
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
      if (!form.patientId || !form.date) {
        return alert("Veuillez remplir le patient et la date");
      }

      const payload = {
        patientId: form.patientId,
        doctorId: user.role === "doctor" ? user.doctorId : form.doctorId,
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

      setForm({
        _id: "",
        patientId: "",
        doctorId: user.role === "doctor" ? user.doctorId : "",
        date: "",
        medicaments: "",
        instructions: "",
      });

      loadData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const deletePrescription = async (id) => {
    if (!window.confirm("Supprimer cette prescription ?")) return;
    try {
      await api.delete(`/prescriptions/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const editPrescription = (p) => {
    setForm({
      _id: p._id,
      patientId: p.patientId?._id || "",
      doctorId: user.role === "doctor" ? user.doctorId : p.doctorId?._id || "",
      date: p.date ? new Date(p.date).toISOString().slice(0, 10) : "",
      medicaments: p.medicaments.join(", "),
      instructions: p.instructions || "",
    });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Prescriptions</h2>

      {/* FORM */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-6">
              <select
                className="form-select"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
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
                  className="form-select"
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
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

            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-8">
              <input
                className="form-control"
                placeholder="Médicaments (séparés par virgule)"
                name="medicaments"
                value={form.medicaments}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <input
                className="form-control"
                placeholder="Instructions"
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <button
                className={`btn ${form._id ? "btn-warning" : "btn-primary"}`}
                onClick={addOrUpdatePrescription}
              >
                {form._id ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Patient</th>
            <th>Médecin</th>
            <th>Date</th>
            <th>Médicaments</th>
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
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => editPrescription(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deletePrescription(p._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
