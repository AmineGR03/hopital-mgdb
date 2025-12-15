const Patient = require("../models/patient");

exports.createPatient = async (req, res) => {
  try {
    // Récupérer le dernier id
    const lastPatient = await Patient.findOne().sort({ id: -1 });
    const newId = lastPatient ? lastPatient.id + 1 : 1;

    const patient = new Patient({ id: newId, ...req.body });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find(); // récupère tous les patients
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getPatientDetails = async (req, res) => {
  const patientId = req.params.id;

  try {
    const patientDetails = await Patient.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(patientId) } },
      {
        $lookup: {
          from: "appointments",
          localField: "_id",
          foreignField: "patientId",
          as: "appointments"
        }
      },
      {
        $lookup: {
          from: "prescriptions",
          localField: "_id",
          foreignField: "patientId",
          as: "prescriptions"
        }
      }
    ]);

    if (!patientDetails.length) return res.status(404).json({ message: "Patient non trouvé" });

    res.json(patientDetails[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
