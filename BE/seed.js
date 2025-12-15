require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Patient = require("./models/patient");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");
const Prescription = require("./models/Prescription");

connectDB();

const seed = async () => {
  try {
    // Nettoyer la base
    await Patient.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    await Prescription.deleteMany();

    // --- Création des docteurs avec id auto-incrémenté ---
    const doctor1 = await Doctor.create({
      id: 1,
      nom: "Ali",
      prenom: "Hassan",
      specialite: "Cardiologie",
      contact: { telephone: "0612345671", adresse: "Rabat" }
    });

    const doctor2 = await Doctor.create({
      id: 2,
      nom: "Sara",
      prenom: "Amal",
      specialite: "Dermatologie",
      contact: { telephone: "0612345672", adresse: "Casablanca" }
    });

    // --- Création des patients avec id auto-incrémenté ---
    const patient1 = await Patient.create({
      id: 1,
      nom: "Ahmed",
      prenom: "Ali",
      dateNaissance: "1999-06-10",
      sexe: "M",
      contact: { telephone: "0612345678", adresse: "Rabat" },
      historique_medical: {
        groupe_sanguin: "O+",
        allergies: ["Penicillin"],
        diagnostics_passes: [
          { date: "2023-06-10", condition: "Grippe", notes: "Traitement terminé" }
        ]
      }
    });

    const patient2 = await Patient.create({
      id: 2,
      nom: "Fatima",
      prenom: "Zahra",
      dateNaissance: "2001-02-15",
      sexe: "F",
      contact: { telephone: "0612345679", adresse: "Casablanca" },
      historique_medical: {
        groupe_sanguin: "A-",
        allergies: ["None"],
        diagnostics_passes: [
          { date: "2024-01-20", condition: "Allergie pollen", notes: "Prendre antihistaminique" }
        ]
      }
    });

    // --- Création des rendez-vous avec id auto-incrémenté ---
    await Appointment.create([
      { id: 1, patientId: patient1.id, doctorId: doctor1.id, dateRdv: "2025-12-20", motif: "Check-up cardio" },
      { id: 2, patientId: patient2.id, doctorId: doctor2.id, dateRdv: "2025-12-22", motif: "Dermatite" }
    ]);

    // --- Création des prescriptions avec id auto-incrémenté ---
    await Prescription.create([
      { id: 1, patientId: patient1.id, doctorId: doctor1.id, medicaments: ["Aspirin"], date: "2025-12-20", instructions: "1x/jour" },
      { id: 2, patientId: patient2.id, doctorId: doctor2.id, medicaments: ["Creme hydratante"], date: "2025-12-22", instructions: "Appliquer 2x/jour" }
    ]);

    console.log("Seed terminé avec ids numériques !");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
