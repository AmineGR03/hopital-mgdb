const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  patientId: { type: Number, required: true },
  doctorId: { type: Number, required: true },
  dateRdv: Date,
  motif: String
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
