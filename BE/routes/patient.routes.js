const router = require("express").Router();
const controller = require("../controllers/patient.controller");

router.get("/", controller.getAllPatients);
router.get("/:id", controller.getPatientById);
router.post("/", controller.createPatient);
router.put("/:id", controller.updatePatient);
router.delete("/:id", controller.deletePatient);

module.exports = router;
