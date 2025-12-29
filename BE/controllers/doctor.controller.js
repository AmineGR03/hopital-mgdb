const Doctor = require("../models/Doctor");

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Médecin non trouvé" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: "Médecin non trouvé" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateOwnDoctor = async (req, res) => {
  try {
    // Check if the user is a doctor and has a doctorId
    if (req.user.role !== 'doctor' || !req.user.doctorId) {
      return res.status(403).json({ message: "Accès non autorisé - vous n'êtes pas un médecin" });
    }

    // Ensure the doctor can only update their own record
    if (req.params.id !== req.user.doctorId.toString()) {
      return res.status(403).json({ message: "Vous ne pouvez modifier que vos propres informations" });
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: "Médecin non trouvé" });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Médecin non trouvé" });
    res.json({ message: "Médecin supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
