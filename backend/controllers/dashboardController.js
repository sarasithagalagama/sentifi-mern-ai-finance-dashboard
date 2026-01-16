const dashboardService = require("../services/dashboardService");

const getDashboardData = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardData(req.user._id);
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};
