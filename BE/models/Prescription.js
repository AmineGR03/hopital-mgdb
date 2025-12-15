const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  medicaments: [String],
  date: Date,
  instructions: String
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
