require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const connectDB = require("./backend/config/db");
const { errorHandler, notFound } = require("./backend/middleware/errorHandler");
const { initCronJobs } = require("./backend/services/cronService");

// Import routes
const authRoutes = require("./backend/routes/authRoutes");
const transactionRoutes = require("./backend/routes/transactionRoutes");
const budgetRoutes = require("./backend/routes/budgetRoutes");
const aiRoutes = require("./backend/routes/aiRoutes");
const importRoutes = require("./backend/routes/importRoutes");
const investmentRoutes = require("./backend/routes/investmentRoutes");
const dashboardRoutes = require("./backend/routes/dashboardRoutes");

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Initialize Cron Jobs
initCronJobs();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/import", importRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", require("./backend/routes/reportRoutes"));
app.use("/api/reports", require("./backend/routes/reportRoutes"));

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend
const path = require("path");
if (process.env.NODE_ENV === "production") {
  // Use process.cwd() for Vercel environment
  app.use(express.static(path.join(process.cwd(), "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(process.cwd(), "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      message: "MERN Expense Tracker API",
      version: "1.0.0",
    });
  });
}

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Start Server only if not running in Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   🚀 MERN Expense Tracker Server                     ║
  ║                                                       ║
  ║   Environment: ${
    process.env.NODE_ENV || "development"
  }                              ║
  ║   Port: ${PORT}                                          ║
  ║   URL: http://localhost:${PORT}                        ║
  ║                                                       ║
  ║   ╚═══════════════════════════════════════════════════════╝
    `);
  });
}

module.exports = app;

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  // Close server & exit process
  process.exit(1);
});
