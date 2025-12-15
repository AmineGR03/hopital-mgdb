const Prescription = require("../models/Prescription");

exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("patientId")
      .populate("doctorId");
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
