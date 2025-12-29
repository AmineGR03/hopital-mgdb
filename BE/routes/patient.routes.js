const router = require("express").Router();
const controller = require("../controllers/patient.controller");
const { authenticateToken, requireStaff, requireReceptionist, authorizeRoles } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Routes accessibles à tout le personnel médical
router.get("/", requireStaff, controller.getAllPatients);
router.get("/:id", requireStaff, controller.getPatientById);

// Routes nécessitant les droits réceptionniste/admin
const canManagePatients = authorizeRoles('receptionist', 'doctor', 'admin');
router.post("/", canManagePatients, controller.createPatient);
router.put("/:id", canManagePatients, controller.updatePatient);
router.delete("/:id", canManagePatients, controller.deletePatient);


module.exports = router;
