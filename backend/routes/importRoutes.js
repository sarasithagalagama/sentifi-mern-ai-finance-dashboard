const express = require("express");
const router = express.Router();
const importController = require("../controllers/importController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// All routes are protected
router.use(protect);

router.post("/csv", upload.single("file"), importController.importCSV);
router.get("/template", importController.downloadTemplate);

module.exports = router;
