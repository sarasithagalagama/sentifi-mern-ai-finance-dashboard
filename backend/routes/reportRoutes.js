const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const dashboardService = require("../services/dashboardService");
const emailService = require("../services/emailService");
const aiService = require("../services/aiService");

router.post("/send", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch Dashboard Data
    const dashboardData = await dashboardService.getDashboardData(userId);

    // 2. Get AI Summary if not available
    // For now, we'll assume a generic message if AI isn't called here,
    // or we could quickly ask AI for a 1-sentence summary of this data
    // Let's rely on dashboard data having some context or generating fresh advice
    let advice = "Great job managing your finances this month!";
    try {
      // Optional: Get fresh short advice based on the totals
      const context = `Income: ${dashboardData.overview.totalIncome}, Expenses: ${dashboardData.overview.totalExpenses}`;
      const aiResponse = await aiService.getFinancialAdvice(
        userId,
        `Give me a very short 1 sentence summary of my finances: ${context}`
      );
      if (aiResponse && aiResponse.advice) advice = aiResponse.advice;
    } catch (err) {
      console.log("AI specific advice failed, using default");
    }

    // 3. Prepare Data Packet
    const reportData = {
      totalIncome: dashboardData.overview.totalIncome,
      totalExpenses: dashboardData.overview.totalExpenses,
      savings:
        dashboardData.overview.totalIncome -
        dashboardData.overview.totalExpenses,
      aiAdvice: advice,
    };

    // 4. Send Email
    await emailService.sendFinancialReport(req.user, reportData);

    res.json({ success: true, message: "Report sent successfully" });
  } catch (error) {
    console.error("Report API Error:", error);
    res.status(500).json({ message: "Failed to send report" });
  }
});

module.exports = router;
