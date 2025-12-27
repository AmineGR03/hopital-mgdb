import { Link } from "react-router-dom";
import { store } from "../store/store";

export default function Navbar() {
  const user = store.user;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3 px-3">
      <Link className="navbar-brand" to="/">Dashboard</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/appointments">Appointments</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/patients">Patients</Link>
          </li>
          {user.role !== "doctor" && (
            <li className="nav-item">
              <Link className="nav-link" to="/doctors">Doctors</Link>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link" to="/prescriptions">Prescriptions</Link>
          </li>
          {user.role === "admin" && (
            <li className="nav-item">
              <Link className="nav-link" to="/users">Users</Link>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link" to="/profile">Profile</Link>
          </li>
        </ul>
        <button
          className="btn btn-outline-light"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}