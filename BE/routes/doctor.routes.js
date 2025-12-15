const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctor.controller");

router.get("/", controller.getAllDoctors);
router.post("/", controller.createDoctor);

module.exports = router;
