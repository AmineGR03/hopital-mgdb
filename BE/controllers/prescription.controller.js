const Prescription = require("../models/Prescription");

exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patientId')
      .populate('doctorId');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('patientId').populate('doctorId');
    if (!prescription) return res.status(404).json({ message: "Prescription non trouvée" });
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    await prescription.populate('patientId');
    await prescription.populate('doctorId');
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('patientId').populate('doctorId');
    if (!prescription) return res.status(404).json({ message: "Prescription non trouvée" });
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ message: "Prescription non trouvée" });
    res.json({ message: "Prescription supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
