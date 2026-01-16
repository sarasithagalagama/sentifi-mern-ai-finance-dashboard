const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const { protect } = require("../middleware/auth");
const { validateBudget } = require("../utils/validators");

// All routes are protected
router.use(protect);

// Notifications route (before /:id)
router.get("/notifications", budgetController.getNotifications);

// CRUD routes
router
  .route("/")
  .get(budgetController.getBudgets)
  .post(validateBudget, budgetController.createBudget);

router
  .route("/:id")
  .get(budgetController.getBudget)
  .delete(budgetController.deleteBudget);

module.exports = router;
