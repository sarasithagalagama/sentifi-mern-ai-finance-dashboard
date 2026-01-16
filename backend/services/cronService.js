const cron = require("node-cron");
const Transaction = require("../models/Transaction");

/**
 * Initialize cron jobs
 */
const initCronJobs = () => {
  // Run daily at midnight to create recurring transactions
  cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Running recurring transactions cron job...");
    await createRecurringTransactions();
  });

  console.log("✅ Cron jobs initialized");
};

/**
 * Create recurring transactions
 */
const createRecurringTransactions = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all recurring transactions
    const recurringTransactions = await Transaction.find({
      isRecurring: true,
      recurringFrequency: { $ne: null },
    });

    for (const template of recurringTransactions) {
      const lastDate = new Date(template.date);
      const shouldCreate = checkIfShouldCreate(
        lastDate,
        today,
        template.recurringFrequency
      );

      if (shouldCreate) {
        // Create new transaction based on template
        const newTransaction = new Transaction({
          user: template.user,
          amount: template.amount,
          category: template.category,
          description: template.description,
          date: today,
          type: template.type,
          currency: template.currency,
          convertedAmount: template.convertedAmount,
          isRecurring: false, // The created transaction is not recurring itself
          merchantName: template.merchantName,
          aiCategorized: template.aiCategorized,
        });

        await newTransaction.save();

        // Update the template's date to today
        template.date = today;
        await template.save();

        console.log(
          `✅ Created recurring transaction: ${template.description}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Recurring transactions cron error:", error);
  }
};

/**
 * Check if a recurring transaction should be created today
 */
const checkIfShouldCreate = (lastDate, today, frequency) => {
  const daysDifference = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

  switch (frequency) {
    case "daily":
      return daysDifference >= 1;
    case "weekly":
      return daysDifference >= 7;
    case "monthly":
      // Check if it's the same day of the month or later
      const lastDay = lastDate.getDate();
      const currentDay = today.getDate();
      const monthDiff =
        (today.getFullYear() - lastDate.getFullYear()) * 12 +
        (today.getMonth() - lastDate.getMonth());
      return monthDiff >= 1 && currentDay >= lastDay;
    default:
      return false;
  }
};

module.exports = {
  initCronJobs,
  createRecurringTransactions,
};
