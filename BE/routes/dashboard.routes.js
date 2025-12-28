const router = require("express").Router();
const { authenticateToken, requireDoctor } = require("../middleware/auth");
const controller = require("../controllers/dashboard.controller");

router.use(authenticateToken);

// Dashboard médecin
router.get("/doctor", requireDoctor, controller.getDoctorDashboard);

module.exports = router;
