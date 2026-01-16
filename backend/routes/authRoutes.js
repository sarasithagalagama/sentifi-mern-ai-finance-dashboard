const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validateRegister, validateLogin } = require("../utils/validators");

// Public routes
router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/refresh", authController.refresh);

// Protected routes
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);
router.put("/profile", protect, authController.updateProfile);

module.exports = router;
