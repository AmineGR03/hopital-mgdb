const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medicaments: [String],
  date: Date,
  validityDays: { type: Number, default: 30 },
  instructions: String
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
