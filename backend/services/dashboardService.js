const Transaction = require("../models/Transaction");
const Investment = require("../models/Investment");
const Goal = require("../models/Goal");

/**
 * Get Dashboard Overview Data
 */
const getDashboardData = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // 1. Total Balance (Income - Expenses + Initial/Adjustments if any)
  // For simplicity: Sum of all income transactions - Sum of all expense transactions
  const allTransactions = await Transaction.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);

  const totalIncome =
    allTransactions.find((t) => t._id === "income")?.total || 0;
  // Expenses are stored as negative or we should check logic.
  // Looking at frontend mock: amount: -14.99. So they are signed.
  // Wait, in Transaction.js schema validation: "Amount must be positive".
  // Let's check the controller/service logic.
  // In `transactionService.js`: `const createTransaction = ...`
  // It doesn't flip sign. But frontend Transaction.tsx shows: `amount: -14.99` in mock.
  // Real data might be positive stored, and type determines sign.
  // Let's assume stored as positive for 'amount' field, and 'type'='expense'.

  const totalExpense =
    allTransactions.find((t) => t._id === "expense")?.total || 0;

  // Total Balance (Cash Flow)
  const cashBalance = totalIncome - totalExpense;

  // 2. Net Worth = Cash Balance + Investment Value
  const portfolio = await Investment.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$value" } } },
  ]);
  const investmentValue = portfolio[0]?.total || 0;
  const netWorth = cashBalance + investmentValue;

  // 3. Monthly Expenses
  const monthlyExpenses = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const monthlyExpenseTotal = monthlyExpenses[0]?.total || 0;

  // 4. Savings Goal Progress (Average of all goals or Total Target vs Total Saved)
  const goals = await Goal.find({ user: userId });
  let totalTarget = 0;
  let totalSaved = 0;
  goals.forEach((g) => {
    totalTarget += g.targetAmount;
    totalSaved += g.currentAmount;
  });
  const savingsPercentage =
    totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  // 5. Expense Breakdown (Pie Chart)
  const expenseBreakdown = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: "$category", value: { $sum: "$amount" } } },
    { $sort: { value: -1 } },
    { $limit: 5 },
  ]);

  // Map colors loosely
  const colors = ["#4ade80", "#22c55e", "#86efac", "#16a34a", "#bbf7d0"];
  const expenseChartData = expenseBreakdown.map((item, index) => ({
    name: item._id,
    value: item.value,
    color: colors[index % colors.length],
  }));

  // 6. Income vs Expense (Bar Chart) - This Month
  const monthlyIncome = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "income",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const monthlyIncomeTotal = monthlyIncome[0]?.total || 0;

  const incomeVsExpenseData = [
    { name: "Income", value: monthlyIncomeTotal, fill: "#22c55e" },
    { name: "Expenses", value: monthlyExpenseTotal, fill: "#86efac" },
  ];

  // 7. Upcoming Bills (Recurring Expenses)
  // For now, let's just find recurring expenses.
  // In a real app we'd calculate next due date.
  // We'll mock "Days Left" logic based on current day vs transaction day.
  const recurringBills = await Transaction.find({
    user: userId,
    type: "expense",
    isRecurring: true,
  }).limit(5);

  const upcomingBills = recurringBills
    .map((bill) => {
      const billDate = new Date(bill.date);
      const dayOfMonth = billDate.getDate();
      const currentDay = now.getDate();

      let daysLeft = dayOfMonth - currentDay;
      if (daysLeft < 0) daysLeft += 30; // Rough approximation for next month

      return {
        name: bill.description || bill.merchantName || bill.category,
        amount: bill.amount,
        daysLeft: daysLeft,
        date: dayOfMonth,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  // 8. Annual Trends (Last 12 Months)
  const annualData = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const monthStats = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: mStart, $lte: mEnd } } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const inc = monthStats.find((s) => s._id === "income")?.total || 0;
    const exp = monthStats.find((s) => s._id === "expense")?.total || 0;

    const monthName = d.toLocaleString("default", { month: "short" });
    annualData.push({ name: monthName, income: inc, expense: exp });
  }

  return {
    overview: {
      totalBalance: cashBalance,
      monthlyExpenses: monthlyExpenseTotal,
      savingsPercentage,
      netWorth,
    },
    charts: {
      expenseBreakdown: expenseChartData,
      incomeVsExpense: incomeVsExpenseData,
      annualData, // Added here
    },
    goals,
    upcomingBills,
  };
};

module.exports = {
  getDashboardData,
};
