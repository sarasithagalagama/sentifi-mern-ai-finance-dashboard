const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// All routes are protected
router.use(protect);

router.post("/chat", aiController.chat);
router.post("/categorize", aiController.categorize);
router.post(
  "/scan-receipt",
  upload.single("receipt"),
  aiController.scanReceipt
);

module.exports = router;
