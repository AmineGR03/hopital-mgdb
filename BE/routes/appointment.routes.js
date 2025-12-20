const router = require("express").Router();
const controller = require("../controllers/appointment.controller");

router.get("/", controller.getAllAppointments);
router.get("/:id", controller.getAppointmentById);
router.post("/", controller.createAppointment);
router.put("/:id", controller.updateAppointment);
router.delete("/:id", controller.deleteAppointment);

module.exports = router;
