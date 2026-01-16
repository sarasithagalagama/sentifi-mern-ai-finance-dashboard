const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const currencyService = require("./currencyService");

/**
 * Create a new transaction
 */
const createTransaction = async (userId, transactionData) => {
  const { amount, currency } = transactionData;

  // Get user's default currency and convert if needed
  const convertedAmount = await currencyService.convertCurrency(
    amount,
    currency,
    "USD"
  );

  const transaction = await Transaction.create({
    ...transactionData,
    user: userId,
    convertedAmount,
  });

  // Update budget if it's an expense
  if (transaction.type === "expense") {
    await updateBudgetSpending(userId, transaction.category, transaction.date);
  }

  return transaction;
};

/**
 * Get all transactions for a user with filters
 */
const getTransactions = async (userId, filters = {}) => {
  const {
    category,
    type,
    startDate,
    endDate,
    search,
    limit = 100,
    skip = 0,
  } = filters;

  const query = { user: userId };

  if (category) query.category = category;
  if (type) query.type = type;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (search) {
    query.$or = [
      { description: { $regex: search, $options: "i" } },
      { merchantName: { $regex: search, $options: "i" } },
    ];
  }

  const transactions = await Transaction.find(query)
    .sort({ date: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await Transaction.countDocuments(query);

  return { transactions, total };
};

/**
 * Get a single transaction
 */
const getTransactionById = async (transactionId, userId) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction;
};

/**
 * Update a transaction
 */
const updateTransaction = async (transactionId, userId, updateData) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const oldCategory = transaction.category;
  const oldType = transaction.type;
  const oldAmount = transaction.convertedAmount;

  // Update transaction
  Object.assign(transaction, updateData);

  // Recalculate converted amount if amount or currency changed
  if (updateData.amount || updateData.currency) {
    transaction.convertedAmount = await currencyService.convertCurrency(
      transaction.amount,
      transaction.currency,
      "USD"
    );
  }

  await transaction.save();

  // Update budgets if category or amount changed
  if (transaction.type === "expense") {
    if (oldType === "expense" && oldCategory !== transaction.category) {
      // Category changed - update both old and new budget
      await updateBudgetSpending(userId, oldCategory, transaction.date);
      await updateBudgetSpending(
        userId,
        transaction.category,
        transaction.date
      );
    } else {
      // Amount changed - update current budget
      await updateBudgetSpending(
        userId,
        transaction.category,
        transaction.date
      );
    }
  }

  return transaction;
};

/**
 * Delete a transaction
 */
const deleteTransaction = async (transactionId, userId) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  await transaction.deleteOne();

  // Update budget
  if (transaction.type === "expense") {
    await updateBudgetSpending(userId, transaction.category, transaction.date);
  }

  return transaction;
};

/**
 * Get transaction analytics
 */
const getAnalytics = async (userId, filters = {}) => {
  const { startDate, endDate } = filters;

  const matchStage = { user: userId };
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  // Spending by category
  const categoryStats = await Transaction.aggregate([
    { $match: { ...matchStage, type: "expense" } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$convertedAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  // Monthly trends
  const monthlyTrends = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          type: "$type",
        },
        total: { $sum: "$convertedAmount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Total income and expenses
  const summary = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$convertedAmount" },
      },
    },
  ]);

  return {
    categoryStats,
    monthlyTrends,
    summary,
  };
};

/**
 * Helper function to update budget spending
 */
const updateBudgetSpending = async (userId, category, date) => {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Calculate total spending for this category in this month
  const result = await Transaction.aggregate([
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

  const currentSpending = result[0]?.total || 0;

  // Update budget
  await Budget.findOneAndUpdate(
    { user: userId, category, month: monthStart },
    { currentSpending },
    { upsert: false }
  );
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getAnalytics,
};
