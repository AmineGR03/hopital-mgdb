const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  dateRdv: { type: Date, required: true },
  motif: { type: String, required: true },
  status: { type: String, default: 'planifié' }
});

module.exports = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
