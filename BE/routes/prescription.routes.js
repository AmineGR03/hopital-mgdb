const router = require("express").Router();
const controller = require("../controllers/prescription.controller");
const { authenticateToken, requireStaff, requireDoctor } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Routes accessibles à tout le personnel médical
router.get("/", requireStaff, controller.getAllPrescriptions);
router.get("/:id", requireStaff, controller.getPrescriptionById);

// Routes nécessitant les droits médecin/admin (prescriptions sont créées par les médecins)
router.post("/", requireDoctor, controller.createPrescription);
router.put("/:id", requireDoctor, controller.updatePrescription);
router.delete("/:id", requireDoctor, controller.deletePrescription);

module.exports = router;
