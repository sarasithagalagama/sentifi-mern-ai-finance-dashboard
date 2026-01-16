const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    monthlyLimit: {
      type: Number,
      required: [true, "Please provide a monthly limit"],
      min: [0, "Limit must be positive"],
    },
    currentSpending: {
      type: Number,
      default: 0,
      min: [0, "Spending cannot be negative"],
    },
    month: {
      type: Date,
      required: true,
      // Store as first day of the month
    },
    notificationSent: {
      at80Percent: {
        type: Boolean,
        default: false,
      },
      at100Percent: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one budget per category per month per user
budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
