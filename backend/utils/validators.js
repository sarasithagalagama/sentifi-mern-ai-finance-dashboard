const { body, param, query, validationResult } = require("express-validator");

/**
 * Validation middleware to check for errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

/**
 * User registration validation rules
 */
const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validate,
];

/**
 * User login validation rules
 */
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

/**
 * Transaction validation rules
 */
const validateTransaction = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Type must be either income or expense"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("currency")
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency code must be 3 characters"),
  validate,
];

/**
 * Budget validation rules
 */
const validateBudget = [
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("monthlyLimit")
    .notEmpty()
    .withMessage("Monthly limit is required")
    .isFloat({ min: 0 })
    .withMessage("Monthly limit must be a positive number"),
  body("month")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date"),
  validate,
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateTransaction,
  validateBudget,
};
