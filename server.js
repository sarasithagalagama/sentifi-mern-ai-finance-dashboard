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
app.use(helmet());

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

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "MERN Expense Tracker API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      transactions: "/api/transactions",
      budgets: "/api/budgets",
      ai: "/api/ai",
      import: "/api/import",
      investments: "/api/investments",
      dashboard: "/api/dashboard",
    },
  });
});

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Start Server
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
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  // Close server & exit process
  process.exit(1);
});
