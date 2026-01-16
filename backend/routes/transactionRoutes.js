const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { protect } = require("../middleware/auth");
const { validateTransaction } = require("../utils/validators");

// All routes are protected
router.use(protect);

// Analytics route (must be before /:id to avoid conflict)
router.get("/analytics", transactionController.getAnalytics);

// CRUD routes
router
  .route("/")
  .get(transactionController.getTransactions)
  .post(validateTransaction, transactionController.createTransaction);

router
  .route("/:id")
  .get(transactionController.getTransaction)
  .put(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

module.exports = router;
