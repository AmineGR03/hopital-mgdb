const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  nom: String,
  prenom: String,
  specialite: String,
  contact: {
    telephone: String,
    adresse: String
  }
});

module.exports = mongoose.model("Doctor", DoctorSchema);
