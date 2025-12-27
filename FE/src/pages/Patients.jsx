import { useEffect, useState } from "react";
import api from "../api/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    _id: "", // added to track edit
    nom: "",
    prenom: "",
    dateNaissance: "",
    sexe: "",
    telephone: "",
    adresse: "",
  });

  const loadPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOrUpdatePatient = async () => {
    try {
      if (form._id) {
        // Edit mode: update
        await api.put(`/patients/${form._id}`, {
          nom: form.nom,
          prenom: form.prenom,
          dateNaissance: form.dateNaissance,
          sexe: form.sexe,
          contact: { telephone: form.telephone, adresse: form.adresse },
        });
      } else {
        // Add mode: create
        await api.post("/patients", {
          nom: form.nom,
          prenom: form.prenom,
          dateNaissance: form.dateNaissance,
          sexe: form.sexe,
          contact: { telephone: form.telephone, adresse: form.adresse },
        });
      }
      // Reset form
      setForm({
        _id: "",
        nom: "",
        prenom: "",
        dateNaissance: "",
        sexe: "",
        telephone: "",
        adresse: "",
      });
      loadPatients();
    } catch (err) {
      console.error(err);
      alert("Error saving patient");
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await api.delete(`/patients/${id}`);
      loadPatients();
    } catch (err) {
      console.error(err);
      alert("Error deleting patient");
    }
  };

  const editPatient = (p) => {
    setForm({
      _id: p._id,
      nom: p.nom || "",
      prenom: p.prenom || "",
      dateNaissance: p.dateNaissance ? new Date(p.dateNaissance).toISOString().slice(0,10) : "",
      sexe: p.sexe || "",
      telephone: p.contact?.telephone || "",
      adresse: p.contact?.adresse || "",
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Patients</h2>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                name="nom"
                placeholder="Nom"
                value={form.nom}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <input
                name="prenom"
                placeholder="Prenom"
                value={form.prenom}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <input
                type="date"
                name="dateNaissance"
                value={form.dateNaissance}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <select name="sexe" value={form.sexe} onChange={handleChange} className="form-select">
                <option value="">Sexe</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
            <div className="col-md-4">
              <input
                name="telephone"
                placeholder="Telephone"
                value={form.telephone}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-12">
              <input
                name="adresse"
                placeholder="Adresse"
                value={form.adresse}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-12">
              <button onClick={addOrUpdatePatient} className="btn btn-primary">
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
              <th>Nom</th>
              <th>Prenom</th>
              <th>Date de naissance</th>
              <th>Sexe</th>
              <th>Telephone</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id}>
                <td>{p.nom}</td>
                <td>{p.prenom}</td>
                <td>{new Date(p.dateNaissance).toLocaleDateString()}</td>
                <td>{p.sexe}</td>
                <td>{p.contact?.telephone}</td>
                <td>{p.contact?.adresse}</td>
                <td>
                  <button onClick={() => editPatient(p)} className="btn btn-sm btn-warning me-2">Edit</button>
                  <button onClick={() => deletePatient(p._id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}