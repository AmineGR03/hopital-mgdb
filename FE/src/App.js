import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Prescriptions from "./pages/Prescriptions";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from "./store/store";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = store.user;

  if (!user) return <Navigate to="/" replace />; // pas connecté
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // pas autorisé
  }

  return children;
};

export default function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Login />;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

       
        <Route path="/appointments" element={
          <ProtectedRoute allowedRoles={['admin','doctor','receptionist']}>
            <Appointments />
          </ProtectedRoute>
        } />

        <Route path="/patients" element={
          <ProtectedRoute allowedRoles={['admin','doctor','receptionist']}>
            <Patients />
          </ProtectedRoute>
        } />

        <Route path="/doctors" element={
          <ProtectedRoute allowedRoles={['admin','receptionist']}>
            <Doctors />
          </ProtectedRoute>
        } />

        <Route path="/prescriptions" element={
          <ProtectedRoute allowedRoles={['admin','doctor']}>
            <Prescriptions />
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
