const Doctor = require("../models/Doctor");

exports.getAllDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

exports.getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Médecin non trouvé" });
  res.json(doctor);
};

exports.createDoctor = async (req, res) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.status(201).json(doctor);
};

exports.updateDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(doctor);
};

exports.deleteDoctor = async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: "Médecin supprimé" });
};
