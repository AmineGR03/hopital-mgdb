const router = require("express").Router();
const controller = require("../controllers/doctor.controller");
const { authenticateToken, requireStaff, requireReceptionist } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Routes accessibles à tout le personnel médical
router.get("/", requireStaff, controller.getAllDoctors);
router.get("/:id", requireStaff, controller.getDoctorById);

// Routes nécessitant les droits réceptionniste/admin
router.post("/", requireReceptionist, controller.createDoctor);
router.put("/:id", requireReceptionist, controller.updateDoctor);
router.delete("/:id", requireReceptionist, controller.deleteDoctor);

module.exports = router;
