const express = require("express");
const router = express.Router();
const controller = require("../controllers/patient.controller");

router.post("/", controller.createPatient);
router.get("/", controller.getAllPatients);
router.get("/:id/details", async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);

    const patient = await Patient.findOne({ id: patientId }).lean();
    if (!patient) return res.status(404).json({ message: "Patient non trouvé" });

    const appointments = await Appointment.aggregate([
      { $match: { patientId: patientId } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "id",
          as: "doctor"
        }
      },
      { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } }
    ]);

    const prescriptions = await Prescription.aggregate([
      { $match: { patientId: patientId } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "id",
          as: "doctor"
        }
      },
      { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } }
    ]);

    res.json({ ...patient, appointments, prescriptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
