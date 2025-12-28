const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");

exports.getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.doctorId; // injecté par le token JWT

    const prescriptionsCount = await Prescription.countDocuments({
      doctorId: doctorId,
    });

    const appointmentsCount = await Appointment.countDocuments({
      doctorId: doctorId,
    });

    res.json({
      prescriptions: prescriptionsCount,
      appointments: appointmentsCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur dashboard médecin",
      error: error.message,
    });
  }
};
