import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const token = localStorage.getItem("token");

export default function App() {
  if (!token) {
    return <Login />;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
