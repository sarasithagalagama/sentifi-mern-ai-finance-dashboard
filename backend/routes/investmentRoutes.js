const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getPortfolio,
  getTransactions,
  createInvestment,
  createTransaction,
} = require("../controllers/investmentController");

router.use(protect);

router.get("/portfolio", getPortfolio);
router.post("/portfolio", createInvestment);

router.get("/transactions", getTransactions);
router.post("/transactions", createTransaction);

module.exports = router;
