const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

/**
 * Create or update a budget
 */
const createOrUpdateBudget = async (userId, budgetData) => {
  const { category, monthlyLimit, month } = budgetData;

  // Normalize month to first day of month
  const monthStart = month ? new Date(month) : new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Calculate current spending for this category this month
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  monthEnd.setDate(0);

  const spendingResult = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        category,
        type: "expense",
        date: { $gte: monthStart, $lte: monthEnd },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$convertedAmount" },
      },
    },
  ]);

  const currentSpending = spendingResult[0]?.total || 0;

  // Create or update budget
  const budget = await Budget.findOneAndUpdate(
    { user: userId, category, month: monthStart },
    {
      user: userId,
      category,
      monthlyLimit,
      month: monthStart,
      currentSpending,
    },
    { new: true, upsert: true, runValidators: true }
  );

  // Check notification thresholds
  await checkBudgetNotifications(budget);

  return budget;
};

/**
 * Get all budgets for a user
 */
const getBudgets = async (userId, filters = {}) => {
  const { month } = filters;

  const query = { user: userId };

  if (month) {
    const monthStart = new Date(month);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    query.month = monthStart;
  }

  const budgets = await Budget.find(query).sort({ category: 1 });

  return budgets;
};

/**
 * Get a single budget
 */
const getBudgetById = async (budgetId, userId) => {
  const budget = await Budget.findOne({ _id: budgetId, user: userId });

  if (!budget) {
    throw new Error("Budget not found");
  }

  return budget;
};

/**
 * Delete a budget
 */
const deleteBudget = async (budgetId, userId) => {
  const budget = await Budget.findOne({ _id: budgetId, user: userId });

  if (!budget) {
    throw new Error("Budget not found");
  }

  await budget.deleteOne();

  return budget;
};

/**
 * Check if budget notifications should be sent
 */
const checkBudgetNotifications = async (budget) => {
  const percentage = (budget.currentSpending / budget.monthlyLimit) * 100;

  const notifications = [];

  if (percentage >= 100 && !budget.notificationSent.at100Percent) {
    budget.notificationSent.at100Percent = true;
    notifications.push({
      level: "danger",
      message: `You've exceeded your budget for ${budget.category}!`,
    });
  } else if (percentage >= 80 && !budget.notificationSent.at80Percent) {
    budget.notificationSent.at80Percent = true;
    notifications.push({
      level: "warning",
      message: `You've reached 80% of your budget for ${budget.category}.`,
    });
  }

  if (notifications.length > 0) {
    await budget.save();
  }

  return notifications;
};

/**
 * Get budget notifications for user
 */
const getBudgetNotifications = async (userId) => {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const budgets = await Budget.find({
    user: userId,
    month: currentMonth,
  });

  const notifications = [];

  budgets.forEach((budget) => {
    const percentage = (budget.currentSpending / budget.monthlyLimit) * 100;

    if (percentage >= 100) {
      notifications.push({
        level: "danger",
        category: budget.category,
        message: `Budget exceeded for ${budget.category}`,
        percentage: Math.round(percentage),
      });
    } else if (percentage >= 80) {
      notifications.push({
        level: "warning",
        category: budget.category,
        message: `${Math.round(percentage)}% of budget used for ${
          budget.category
        }`,
        percentage: Math.round(percentage),
      });
    }
  });

  return notifications;
};

module.exports = {
  createOrUpdateBudget,
  getBudgets,
  getBudgetById,
  deleteBudget,
  getBudgetNotifications,
};
