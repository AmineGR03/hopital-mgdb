const router = require("express").Router();
const controller = require("../controllers/doctor.controller");

router.get("/", controller.getAllDoctors);
router.get("/:id", controller.getDoctorById);
router.post("/", controller.createDoctor);
router.put("/:id", controller.updateDoctor);
router.delete("/:id", controller.deleteDoctor);

module.exports = router;
