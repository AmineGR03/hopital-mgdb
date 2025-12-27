const router = require("express").Router();
const controller = require("../controllers/appointment.controller");
const { authenticateToken, requireStaff, requireReceptionist, authorizeRoles } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Routes accessibles à tout le personnel médical
router.get("/", requireStaff, controller.getAllAppointments);
router.get("/:id", requireStaff, controller.getAppointmentById);

// Routes nécessitant les droits réceptionniste/admin ou doctor/admin
const canManageAppointments = authorizeRoles('receptionist', 'doctor', 'admin');
router.post("/", canManageAppointments, controller.createAppointment);
router.put("/:id", canManageAppointments, controller.updateAppointment);
router.delete("/:id", canManageAppointments, controller.deleteAppointment);

module.exports = router;
