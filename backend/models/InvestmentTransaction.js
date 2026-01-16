const mongoose = require("mongoose");

const investmentTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    asset: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Buy", "Sell", "Dividend"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "Completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InvestmentTransaction",
  investmentTransactionSchema
);
