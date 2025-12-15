const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  specialite: String,
  contact: {
    telephone: String,
    adresse: String
  }
});

module.exports = mongoose.model("Doctor", DoctorSchema);
