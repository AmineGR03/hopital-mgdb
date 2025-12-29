  const mongoose = require("mongoose");

  const PatientSchema = new mongoose.Schema({
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
        { date: Date, condition: String, notes: String }
      ]
    }
  });

  module.exports = mongoose.model("Patient", PatientSchema);
