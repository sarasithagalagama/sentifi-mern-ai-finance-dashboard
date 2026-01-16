const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getDashboardData } = require("../controllers/dashboardController");
const Goal = require("../models/Goal");

router.use(protect);

router.get("/", getDashboardData);

// Basic CRUD for Goals for the frontend modal (if we implement it)
router.post("/goals", async (req, res, next) => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, goal });
  } catch (err) {
    next(err);
  }
});

router.get("/goals", async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    res.json({ success: true, goals });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
