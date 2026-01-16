const investmentService = require("../services/investmentService");

const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await investmentService.getPortfolio(req.user._id);
    res.json({ success: true, portfolio });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await investmentService.getTransactions(req.user._id);
    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

const createInvestment = async (req, res, next) => {
  try {
    const investment = await investmentService.createInvestment(
      req.user._id,
      req.body
    );
    res.status(201).json({ success: true, investment });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const transaction = await investmentService.createTransaction(
      req.user._id,
      req.body
    );
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPortfolio,
  getTransactions,
  createInvestment,
  createTransaction,
};
