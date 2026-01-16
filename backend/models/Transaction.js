const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: [0.01, "Amount must be positive"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
      default: Date.now,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Please specify transaction type"],
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    convertedAmount: {
      type: Number,
      // Amount converted to user's base currency
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", null],
      default: null,
    },
    merchantName: {
      type: String,
      trim: true,
    },
    receiptUrl: {
      type: String,
    },
    aiCategorized: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Failed"],
      default: "Completed",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
