const budgetService = require("../services/budgetService");

/**
 * @route   POST /api/budgets
 * @desc    Create or update a budget
 * @access  Private
 */
const createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createOrUpdateBudget(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Budget created/updated successfully",
      budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/budgets
 * @desc    Get all budgets for logged-in user
 * @access  Private
 */
const getBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetService.getBudgets(req.user._id, req.query);

    res.json({
      success: true,
      count: budgets.length,
      budgets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/budgets/notifications
 * @desc    Get budget notifications
 * @access  Private
 */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await budgetService.getBudgetNotifications(
      req.user._id
    );

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/budgets/:id
 * @desc    Get a single budget
 * @access  Private
 */
const getBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.getBudgetById(
      req.params.id,
      req.user._id
    );

    res.json({
      success: true,
      budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/budgets/:id
 * @desc    Delete a budget
 * @access  Private
 */
const deleteBudget = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.params.id, req.user._id);

    res.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudget,
  deleteBudget,
  getNotifications,
};
