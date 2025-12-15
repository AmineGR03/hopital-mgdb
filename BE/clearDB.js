require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Patient = require("./models/patient");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");
const Prescription = require("./models/Prescription");

connectDB();

const clear = async () => {
  await Patient.deleteMany();
  await Doctor.deleteMany();
  await Appointment.deleteMany();
  await Prescription.deleteMany();
  console.log("Toutes les collections ont été vidées !");
  process.exit();
};

clear();
