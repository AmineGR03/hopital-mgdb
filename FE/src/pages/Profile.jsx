import { useState, useEffect } from "react";
import { store } from "../store/store";
import api from "../api/api";

export default function Profile() {
  const user = store.user;

  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
    password: "",
    currentPassword: "",
  });

  const [doctorForm, setDoctorForm] = useState({
    nom: "",
    prenom: "",
    specialite: "",
    telephone: "",
    adresse: "",
  });

  const [doctorData, setDoctorData] = useState(null);

  // Load doctor data if user is a doctor
  useEffect(() => {
    if (user.role === 'doctor' && user.doctorId) {
      loadDoctorData();
    }
  }, [user]);

  const loadDoctorData = async () => {
    try {
      if (!user.doctorId) {
        console.error("User has no doctorId");
        return;
      }

      const doctorId = user.doctorId._id || user.doctorId.toString();
      const res = await api.get(`/doctors/${doctorId}`);

      setDoctorData(res.data);
      setDoctorForm({
        nom: res.data.nom || "",
        prenom: res.data.prenom || "",
        specialite: res.data.specialite || "",
        telephone: res.data.contact?.telephone || "",
        adresse: res.data.contact?.adresse || "",
      });
    } catch (err) {
      console.error("Error loading doctor data:", err.response?.data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password' && !value.trim()) {
      // Clear currentPassword when password is cleared
      setForm({ ...form, password: '', currentPassword: '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDoctorChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    try {
      const updateData = {
        username: form.username,
        email: form.email,
      };

      // Only include password and currentPassword if password is provided
      if (form.password.trim()) {
        if (!form.currentPassword.trim()) {
          alert("Veuillez saisir votre mot de passe actuel pour changer le mot de passe");
          return;
        }
        updateData.password = form.password;
        updateData.currentPassword = form.currentPassword;
      }

      const response = await api.put("/auth/change-password", updateData);
      alert("Profile updated successfully");

      // Update local storage and store with the response data
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        store.user = response.data.user;
      }

      // Clear password fields after successful update
      setForm(prev => ({
        ...prev,
        password: '',
        currentPassword: ''
      }));
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Error updating profile";
      alert(errorMessage);
    }
  };

  const updateDoctorProfile = async () => {
    try {
      const doctorId = user.doctorId._id || user.doctorId.toString();
      await api.put(`/doctors/profile/${doctorId}`, {
        nom: doctorForm.nom,
        prenom: doctorForm.prenom,
        specialite: doctorForm.specialite,
        contact: {
          telephone: doctorForm.telephone,
          adresse: doctorForm.adresse
        },
      });
      alert("Doctor information updated successfully");
      loadDoctorData(); // Reload doctor data to reflect changes
    } catch (err) {
      console.error(err);
      alert("Error updating doctor information");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="container py-3" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Profile</h2>

      {/* User Account Information */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Account Information</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <input
              className="form-control"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">New Password (optional):</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave empty to keep current password"
            />
          </div>
          {form.password.trim() && (
            <div className="mb-3">
              <label className="form-label">Current Password:</label>
              <input
                className="form-control"
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                required
              />
            </div>
          )}
          <button className="btn btn-primary" onClick={updateProfile}>
            Update Account
          </button>
        </div>
      </div>

      {/* Doctor Information (only for doctors) */}
      {user.role === 'doctor' && (
        <div className="card">
          <div className="card-header">
            <h5>Professional Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nom:</label>
                <input
                  className="form-control"
                  name="nom"
                  value={doctorForm.nom}
                  onChange={handleDoctorChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Prénom:</label>
                <input
                  className="form-control"
                  name="prenom"
                  value={doctorForm.prenom}
                  onChange={handleDoctorChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Spécialité:</label>
              <input
                className="form-control"
                name="specialite"
                value={doctorForm.specialite}
                onChange={handleDoctorChange}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Téléphone:</label>
                <input
                  className="form-control"
                  name="telephone"
                  value={doctorForm.telephone}
                  onChange={handleDoctorChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Adresse:</label>
                <input
                  className="form-control"
                  name="adresse"
                  value={doctorForm.adresse}
                  onChange={handleDoctorChange}
                />
              </div>
            </div>
            <button className="btn btn-success" onClick={updateDoctorProfile}>
              Update Professional Info
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
