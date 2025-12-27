require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const User = require("./models/User");
const bcrypt = require('bcryptjs');
const Patient = require("./models/Patient");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");
const Prescription = require("./models/Prescription");

connectDB();

const seed = async () => {
  try {
    console.log("🧹 Nettoyage de la base de données...");

    // --- Supprimer les collections si elles existent ---
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (let coll of collections) {
      if (["prescriptions", "appointments", "users", "patients", "doctors"].includes(coll.name)) {
        await mongoose.connection.db.dropCollection(coll.name);
        console.log(`Collection '${coll.name}' supprimée ✅`);
      }
    }

    console.log("👨‍⚕️ Création des médecins...");

    const doctors = await Doctor.insertMany([
      {
        nom: "Ali",
        prenom: "Hassan",
        specialite: "Cardiologie",
        contact: { telephone: "0612345671", adresse: "Rabat" }
      },
      {
        nom: "Sara",
        prenom: "Amal",
        specialite: "Dermatologie",
        contact: { telephone: "0612345672", adresse: "Casablanca" }
      }
    ]);

    console.log("👥 Création des patients...");

    const patients = await Patient.insertMany([
      {
        nom: "Ahmed",
        prenom: "Ali",
        dateNaissance: new Date("1999-06-10"),
        sexe: "Homme",
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
        nom: "Fatima",
        prenom: "Zahra",
        dateNaissance: new Date("2001-02-15"),
        sexe: "Femme",
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

    console.log("👤 Création des utilisateurs avec rôles...");

    const users = [];
    const userData = [
      { username: "admin", email: "admin@hopital.ma", password: "admin123", role: "admin", isActive: true },
      { username: "reception", email: "reception@hopital.ma", password: "reception123", role: "receptionist", isActive: true },
      { username: "dr_ali", email: "ali.hassan@hopital.ma", password: "doctor123", role: "doctor", doctorId: doctors[0]._id, isActive: true },
      { username: "dr_sara", email: "sara.amal@hopital.ma", password: "doctor123", role: "doctor", doctorId: doctors[1]._id, isActive: true }
    ];

    for (const userInfo of userData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userInfo.password, salt);
      const user = new User({ ...userInfo, password: hashedPassword });
      await user.save();
      users.push(user);
    }

    console.log("📅 Création des rendez-vous...");

    await Appointment.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        dateRdv: new Date("2025-12-20T10:00:00"),
        motif: "Check-up cardio",
        status: "planifié"
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        dateRdv: new Date("2025-12-22T14:30:00"),
        motif: "Dermatite",
        status: "planifié"
      }
    ]);

    console.log("💊 Création des prescriptions...");

    await Prescription.insertMany([
      {
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        medicaments: ["Aspirin 100mg"],
        date: new Date("2025-12-20"),
        validityDays: 30,
        instructions: "Prendre 1 comprimé par jour après les repas"
      },
      {
        patientId: patients[1]._id,
        doctorId: doctors[1]._id,
        medicaments: ["Crème hydratante dermatologique", "Antihistaminique oral"],
        date: new Date("2025-12-22"),
        validityDays: 15,
        instructions: "Appliquer la crème 2x/jour sur les zones affectées. Prendre l'antihistaminique 1x/jour le soir."
      }
    ]);

    console.log("✅ Seed terminé avec succès !");
    console.log("\n🔐 Comptes utilisateurs créés :");
    console.log("👑 Admin: admin / admin123");
    console.log("🏥 Réceptionniste: reception / reception123");
    console.log("👨‍⚕️ Médecin Ali: dr_ali / doctor123");
    console.log("👩‍⚕️ Médecin Sara: dr_sara / doctor123");

    process.exit();
  } catch (err) {
    console.error("❌ Erreur lors du seed :", err);
    process.exit(1);
  }
};

seed();
