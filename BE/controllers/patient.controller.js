const Patient = require("../models/Patient");

exports.getAllPatients = async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
};

exports.getPatientById = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient non trouvé" });
  res.json(patient);
};

exports.createPatient = async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.status(201).json(patient);
};

exports.updatePatient = async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(patient);
};

exports.deletePatient = async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: "Patient supprimé" });
};
