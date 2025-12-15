const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // auto-increment
  nom: String,
  prenom: String,
  dateNaissance: Date,
  sexe: String,
  contact: {
    telephone: String,
    adresse: String
  },
  historique_medical: {
    groupe_sanguin: String,
    allergies: [String],
    diagnostics_passes: [
      {
        date: Date,
        condition: String,
        notes: String
      }
    ]
  }
});

module.exports = mongoose.model("Patient", patientSchema);
