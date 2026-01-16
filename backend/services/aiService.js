const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "demo-key");

/**
 * Get financial advice from Gemini AI
 */
const getFinancialAdvice = async (userQuery, transactionHistory = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare context from transaction history
    const context = prepareTransactionContext(transactionHistory);

    const prompt = `You are a helpful financial advisor assistant. Based on the user's transaction history and their question, provide personalized financial advice.

Transaction Summary:
${context}

User Question: ${userQuery}

Please provide clear, actionable advice. Be concise and friendly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini AI error:", error);

    // Fallback response if API fails
    return "I'm currently unable to process your request. Please make sure your Gemini API key is configured correctly and you have an active internet connection.";
  }
};

/**
 * Categorize a transaction using AI
 */
const categorizeTransaction = async (merchantName, description = "") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Categorize this transaction into ONE of these categories:
- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Personal Care
- Other

Merchant: ${merchantName}
Description: ${description}

Respond with ONLY the category name, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const category = response.text().trim();

    return category;
  } catch (error) {
    console.error("Categorization error:", error);
    return "Other"; // Default category
  }
};

/**
 * Prepare transaction context for AI
 */
const prepareTransactionContext = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return "No transaction history available.";
  }

  // Group by category
  const categoryTotals = {};
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((t) => {
    if (t.type === "expense") {
      totalExpenses += t.convertedAmount || t.amount;
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + (t.convertedAmount || t.amount);
    } else {
      totalIncome += t.convertedAmount || t.amount;
    }
  });

  let context = `Total Income: $${totalIncome.toFixed(2)}\n`;
  context += `Total Expenses: $${totalExpenses.toFixed(2)}\n`;
  context += `Net: $${(totalIncome - totalExpenses).toFixed(2)}\n\n`;
  context += "Spending by Category:\n";

  Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, amount]) => {
      const percentage = ((amount / totalExpenses) * 100).toFixed(1);
      context += `- ${category}: $${amount.toFixed(2)} (${percentage}%)\n`;
    });

  return context;
};

module.exports = {
  getFinancialAdvice,
  categorizeTransaction,
};
