import { useEffect, useState } from "react";
import api from "../api/api";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    _id: "", // added to track edit
    nom: "",
    prenom: "",
    specialite: "",
    telephone: "",
    adresse: "",
  });

  const loadDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOrUpdateDoctor = async () => {
    try {
      if (form._id) {
        // Edit mode: update
        await api.put(`/doctors/${form._id}`, {
          nom: form.nom,
          prenom: form.prenom,
          specialite: form.specialite,
          contact: { telephone: form.telephone, adresse: form.adresse },
        });
      } else {
        // Add mode: create
        await api.post("/doctors", {
          nom: form.nom,
          prenom: form.prenom,
          specialite: form.specialite,
          contact: { telephone: form.telephone, adresse: form.adresse },
        });
      }
      // Reset form
      setForm({ _id: "", nom: "", prenom: "", specialite: "", telephone: "", adresse: "" });
      loadDoctors();
    } catch (err) {
      console.error(err);
      alert("Error saving doctor");
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await api.delete(`/doctors/${id}`);
      loadDoctors();
    } catch (err) {
      console.error(err);
      alert("Error deleting doctor");
    }
  };

  const editDoctor = (d) => {
    setForm({
      _id: d._id,
      nom: d.nom || "",
      prenom: d.prenom || "",
      specialite: d.specialite || "",
      telephone: d.contact?.telephone || "",
      adresse: d.contact?.adresse || "",
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Doctors</h2>

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
                name="specialite"
                placeholder="Specialite"
                value={form.specialite}
                onChange={handleChange}
                className="form-control"
              />
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
            <div className="col-md-4">
              <input
                name="adresse"
                placeholder="Adresse"
                value={form.adresse}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-12">
              <button onClick={addOrUpdateDoctor} className="btn btn-primary">
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
              <th>Specialite</th>
              <th>Telephone</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d._id}>
                <td>{d.nom}</td>
                <td>{d.prenom}</td>
                <td>{d.specialite}</td>
                <td>{d.contact?.telephone}</td>
                <td>{d.contact?.adresse}</td>
                <td>
                  <button onClick={() => editDoctor(d)} className="btn btn-sm btn-warning me-2">Edit</button>
                  <button onClick={() => deleteDoctor(d._id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}