const Investment = require("../models/Investment");
const InvestmentTransaction = require("../models/InvestmentTransaction");

const getPortfolio = async (userId) => {
  return await Investment.find({ user: userId });
};

const getTransactions = async (userId) => {
  return await InvestmentTransaction.find({ user: userId }).sort({ date: -1 });
};

const createInvestment = async (userId, data) => {
  // If investment with same name exists, update it? Or just create new?
  // For simplicity, let's just create new or update if ID exists (frontend logic).
  // Actually, normally portfolio is aggregated. But let's keep it simple: List of items.
  return await Investment.create({ ...data, user: userId });
};

const createTransaction = async (userId, data) => {
  return await InvestmentTransaction.create({ ...data, user: userId });
};

module.exports = {
  getPortfolio,
  getTransactions,
  createInvestment,
  createTransaction,
};
