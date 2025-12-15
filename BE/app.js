const express = require("express");
const cors = require("cors");
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const prescriptionRoutes = require("./routes/prescription.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/prescriptions", prescriptionRoutes);

module.exports = app;
