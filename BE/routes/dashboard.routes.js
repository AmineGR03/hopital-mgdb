const router = require("express").Router();
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const { authenticateToken, requireDoctor } = require("../middleware/auth");

router.get("/doctor", authenticateToken, requireDoctor, async (req, res) => {
  try {
    if (!req.user.doctorId) {
      return res.json({
        appointments: 0,
        prescriptions: 0,
        patients: 0
      });
    }

    const doctorId = req.user.doctorId._id;

    const appointments = await Appointment.countDocuments({ doctorId });
    const prescriptions = await Prescription.countDocuments({ doctorId });

    const patients = await Appointment.distinct("patientId", { doctorId });

    res.json({
      appointments,
      prescriptions,
      patients: patients.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
});

module.exports = router;
