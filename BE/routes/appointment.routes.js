const router = require("express").Router();
const controller = require("../controllers/appointment.controller");
const { authenticateToken, requireStaff, requireReceptionist } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Routes accessibles à tout le personnel médical
router.get("/", requireStaff, controller.getAllAppointments);
router.get("/:id", requireStaff, controller.getAppointmentById);

// Routes nécessitant les droits réceptionniste/admin
router.post("/", requireReceptionist, controller.createAppointment);
router.put("/:id", requireReceptionist, controller.updateAppointment);
router.delete("/:id", requireReceptionist, controller.deleteAppointment);

module.exports = router;
