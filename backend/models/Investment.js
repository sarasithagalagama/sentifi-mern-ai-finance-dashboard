const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String, // e.g., "Stocks", "Crypto" or "Tesla", "Bitcoin"
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);
