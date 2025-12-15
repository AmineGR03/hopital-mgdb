const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  dateRdv: Date,
  motif: String
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
