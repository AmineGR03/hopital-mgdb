const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  patientId: { type: Number, required: true },
  doctorId: { type: Number, required: true },
  medicaments: [String],
  date: Date,
  instructions: String
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
