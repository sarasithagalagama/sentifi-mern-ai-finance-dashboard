const aiService = require("../services/aiService");
const ocrService = require("../services/ocrService");
const transactionService = require("../services/transactionService");

/**
 * @route   POST /api/ai/chat
 * @desc    Get financial advice from AI
 * @access  Private
 */
const chat = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // Get user's recent transactions for context (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { transactions } = await transactionService.getTransactions(
      req.user._id,
      {
        startDate: thirtyDaysAgo.toISOString(),
        limit: 1000,
      }
    );

    const advice = await aiService.getFinancialAdvice(query, transactions);

    res.json({
      success: true,
      advice,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/categorize
 * @desc    Auto-categorize a transaction
 * @access  Private
 */
const categorize = async (req, res, next) => {
  try {
    const { merchantName, description } = req.body;

    if (!merchantName) {
      return res.status(400).json({
        success: false,
        message: "Merchant name is required",
      });
    }

    const category = await aiService.categorizeTransaction(
      merchantName,
      description
    );

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/ai/scan-receipt
 * @desc    Upload receipt image
 * @access  Private
 */
const scanReceipt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Receipt image is required",
      });
    }

    // Upload to Cloudinary
    const uploadResult = await ocrService.uploadReceiptImage(
      req.file.buffer,
      req.file.originalname
    );

    // Parse OCR data if provided from frontend
    let extractedData = {};
    if (req.body.ocrData) {
      try {
        const ocrData = JSON.parse(req.body.ocrData);
        extractedData = ocrService.parseOCRResults(ocrData);
      } catch (e) {
        console.error("OCR data parse error:", e);
      }
    }

    res.json({
      success: true,
      message: "Receipt uploaded successfully",
      receiptUrl: uploadResult.url,
      extractedData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  categorize,
  scanReceipt,
};
