import { useState } from "react";
import { store } from "../store/store";
import api from "../api/api";

export default function Profile() {
  const user = store.user;

  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    try {
      await api.put("/auth/change-password", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      alert("Profile updated successfully");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, username: form.username, email: form.email })
      );
      store.user = { ...user, username: form.username, email: form.email };
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="container py-3" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Profile</h2>
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
        <label className="form-label">New Password:</label>
        <input
          className="form-control"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
      </div>
      <button className="btn btn-primary" onClick={updateProfile}>
        Update
      </button>
    </div>
  );
}
