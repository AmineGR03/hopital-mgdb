require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const prescriptionRoutes = require("./routes/prescription.routes");

const app = express();

// --- Middleware ---
app.use(cors()); // Autoriser le frontend
app.use(express.json()); // Parse JSON

// --- Connect to MongoDB ---
connectDB();

// --- Routes ---
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// --- Default route ---
app.get("/", (req, res) => {
  res.send("🏥 Hospital API is running!");
});

// --- Error handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
