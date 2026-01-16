const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense", "both"],
      default: "both",
    },
    icon: {
      type: String,
      // Emoji or icon class for UI
    },
    isDefault: {
      type: Boolean,
      default: false,
      // System-provided categories
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
