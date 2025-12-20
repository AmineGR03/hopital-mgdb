const Prescription = require("../models/Prescription");

exports.getAllPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find();
  res.json(prescriptions);
};

exports.getPrescriptionById = async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) return res.status(404).json({ message: "Prescription non trouvée" });
  res.json(prescription);
};

exports.createPrescription = async (req, res) => {
  const prescription = new Prescription(req.body);
  await prescription.save();
  res.status(201).json(prescription);
};

exports.updatePrescription = async (req, res) => {
  const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prescription);
};

exports.deletePrescription = async (req, res) => {
  await Prescription.findByIdAndDelete(req.params.id);
  res.json({ message: "Prescription supprimée" });
};
