require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Patient = require("./models/Patient");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");
const Prescription = require("./models/Prescription");

connectDB();

const seed = async () => {
  try {
    // Nettoyer la base
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});

    // --- Création des docteurs ---
    const doctors = await Doctor.insertMany([
      {
        id: 1,
        nom: "Ali",
        prenom: "Hassan",
        specialite: "Cardiologie",
        contact: { telephone: "0612345671", adresse: "Rabat" }
      },
      {
        id: 2,
        nom: "Sara",
        prenom: "Amal",
        specialite: "Dermatologie",
        contact: { telephone: "0612345672", adresse: "Casablanca" }
      }
    ]);

    // --- Création des patients ---
    const patients = await Patient.insertMany([
      {
        id: 1,
        nom: "Ahmed",
        prenom: "Ali",
        dateNaissance: new Date("1999-06-10"),
        sexe: "M",
        contact: { telephone: "0612345678", adresse: "Rabat" },
        historique_medical: {
          groupe_sanguin: "O+",
          allergies: ["Penicillin"],
          diagnostics_passes: [
            { date: new Date("2023-06-10"), condition: "Grippe", notes: "Traitement terminé" }
          ]
        }
      },
      {
        id: 2,
        nom: "Fatima",
        prenom: "Zahra",
        dateNaissance: new Date("2001-02-15"),
        sexe: "F",
        contact: { telephone: "0612345679", adresse: "Casablanca" },
        historique_medical: {
          groupe_sanguin: "A-",
          allergies: ["None"],
          diagnostics_passes: [
            { date: new Date("2024-01-20"), condition: "Allergie pollen", notes: "Prendre antihistaminique" }
          ]
        }
      }
    ]);

    // --- Création des rendez-vous ---
    await Appointment.insertMany([
      { id: 1, patientId: patients[0].id, doctorId: doctors[0].id, dateRdv: new Date("2025-12-20"), motif: "Check-up cardio" },
      { id: 2, patientId: patients[1].id, doctorId: doctors[1].id, dateRdv: new Date("2025-12-22"), motif: "Dermatite" }
    ]);

    // --- Création des prescriptions ---
    await Prescription.insertMany([
      { id: 1, patientId: patients[0].id, doctorId: doctors[0].id, medicaments: ["Aspirin"], date: new Date("2025-12-20"), instructions: "1x/jour" },
      { id: 2, patientId: patients[1].id, doctorId: doctors[1].id, medicaments: ["Creme hydratante"], date: new Date("2025-12-22"), instructions: "Appliquer 2x/jour" }
    ]);

    console.log("✅ Seed terminé avec succès !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur lors du seed :", err);
    process.exit(1);
  }
};

seed();
