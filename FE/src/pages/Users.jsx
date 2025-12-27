import { useEffect, useState } from "react";
import api from "../api/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    username: "",
    email: "",
    role: "",
    doctorId: "",
    password: "",
  });

  const loadData = async () => {
    try {
      const usersRes = await api.get("/users");
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || []);
      const doctorsRes = await api.get("/doctors");
      setDoctors(doctorsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addOrUpdateUser = async () => {
    try {
      if (form._id) await api.put(`/users/${form._id}`, form);
      else await api.post("/users", form);
      setForm({ _id: "", username: "", email: "", role: "", doctorId: "", password: "" });
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error saving user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const editUser = (u) => {
    setForm({
      _id: u._id,
      username: u.username,
      email: u.email,
      role: u.role,
      doctorId: u.doctorId?._id || "",
      password: "",
    });
  };

  return (
    <div className="container py-3">
      <h2 className="mb-3">Users (Admin)</h2>

      <div className="mb-4 row g-2">
        <div className="col-md-2">
          <input className="form-control" placeholder="Username" name="username" value={form.username} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Email" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Password" type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="role" value={form.role} onChange={handleChange}>
            <option value="">Role</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
          </select>
        </div>
        {form.role === "doctor" && (
          <div className="col-md-2">
            <select className="form-select" name="doctorId" value={form.doctorId} onChange={handleChange}>
              <option value="">Select Doctor</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>{d.nom} {d.prenom}</option>
              ))}
            </select>
          </div>
        )}
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={addOrUpdateUser}>{form._id ? "Save" : "Add"}</button>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.doctorId ? `${u.doctorId.nom} ${u.doctorId.prenom}` : "-"}</td>
              <td>
                <button className="btn btn-sm btn-warning me-1" onClick={() => editUser(u)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
