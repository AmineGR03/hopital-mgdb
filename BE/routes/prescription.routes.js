const router = require("express").Router();
const controller = require("../controllers/prescription.controller");

router.get("/", controller.getAllPrescriptions);
router.get("/:id", controller.getPrescriptionById);
router.post("/", controller.createPrescription);
router.put("/:id", controller.updatePrescription);
router.delete("/:id", controller.deletePrescription);

module.exports = router;
