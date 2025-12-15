const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointment.controller");

router.get("/", controller.getAllAppointments);
router.post("/", controller.createAppointment);

module.exports = router;
