const Appointment = require("../models/Appointment");

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patientId').populate('doctorId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('patientId').populate('doctorId');
    if (!appointment) return res.status(404).json({ message: "Rendez-vous non trouvé" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    await appointment.populate('patientId');
    await appointment.populate('doctorId');
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('patientId').populate('doctorId');
    if (!appointment) return res.status(404).json({ message: "Rendez-vous non trouvé" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Rendez-vous non trouvé" });
    res.json({ message: "Rendez-vous supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
