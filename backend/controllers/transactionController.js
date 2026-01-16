const transactionService = require("../services/transactionService");

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private
 */
const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for logged-in user
 * @access  Private
 */
const getTransactions = async (req, res, next) => {
  try {
    const { transactions, total } = await transactionService.getTransactions(
      req.user._id,
      req.query
    );

    res.json({
      success: true,
      count: transactions.length,
      total,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/transactions/:id
 * @desc    Get a single transaction
 * @access  Private
 */
const getTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
      req.user._id
    );

    res.json({
      success: true,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update a transaction
 * @access  Private
 */
const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.user._id,
      req.body
    );

    res.json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction
 * @access  Private
 */
const deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user._id);

    res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/transactions/analytics
 * @desc    Get transaction analytics
 * @access  Private
 */
const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await transactionService.getAnalytics(
      req.user._id,
      req.query
    );

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getAnalytics,
};
