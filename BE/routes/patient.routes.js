const router = require("express").Router();
const controller = require("../controllers/patient.controller");
const { authenticateToken, requireStaff, requireReceptionist } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Routes accessibles à tout le personnel médical
router.get("/", requireStaff, controller.getAllPatients);
router.get("/:id", requireStaff, controller.getPatientById);

// Routes nécessitant les droits réceptionniste/admin
router.post("/", requireReceptionist, controller.createPatient);
router.put("/:id", requireReceptionist, controller.updatePatient);
router.delete("/:id", requireReceptionist, controller.deletePatient);

module.exports = router;
