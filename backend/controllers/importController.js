const csv = require("csv-parser");
const xlsx = require("xlsx");
const { Readable } = require("stream");
const Transaction = require("../models/Transaction");

/**
 * @route   POST /api/import/csv
 * @desc    Import transactions from CSV/Excel file
 * @access  Private
 */
const importCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const fileType = req.file.mimetype;
    let transactions = [];

    if (fileType === "text/csv" || fileType === "application/vnd.ms-excel") {
      // Parse CSV
      transactions = await parseCSV(req.file.buffer);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Parse Excel
      transactions = await parseExcel(req.file.buffer);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Please upload CSV or Excel file.",
      });
    }

    // Validate and create transactions
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const txData of transactions) {
      try {
        await Transaction.create({
          ...txData,
          user: req.user._id,
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: txData,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      message: "Import completed",
      results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Parse CSV file
 */
const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const transactions = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv())
      .on("data", (row) => {
        const transaction = normalizeTransaction(row);
        if (transaction) {
          transactions.push(transaction);
        }
      })
      .on("end", () => {
        resolve(transactions);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

/**
 * Parse Excel file
 */
const parseExcel = (buffer) => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = xlsx.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      const transactions = data
        .map((row) => normalizeTransaction(row))
        .filter((tx) => tx !== null);

      resolve(transactions);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Normalize transaction data from CSV/Excel row
 * Expected columns: Date, Amount, Category, Description, Type, Currency (optional)
 */
const normalizeTransaction = (row) => {
  try {
    // Handle different possible column names (case-insensitive)
    const getField = (aliases) => {
      for (const alias of aliases) {
        const value =
          row[alias] || row[alias.toLowerCase()] || row[alias.toUpperCase()];
        if (value !== undefined && value !== null && value !== "") {
          return value;
        }
      }
      return null;
    };

    const date = getField(["Date", "Transaction Date", "date"]);
    const amount = getField(["Amount", "amount"]);
    const category = getField(["Category", "category"]);
    const description = getField([
      "Description",
      "Memo",
      "Note",
      "description",
    ]);
    const type = getField(["Type", "Transaction Type", "type"]);
    const currency = getField(["Currency", "currency"]) || "USD";

    // Required fields
    if (!date || !amount || !category || !type) {
      return null;
    }

    return {
      date: new Date(date),
      amount: parseFloat(amount),
      category: category.trim(),
      description: description ? description.trim() : "",
      type: type.toLowerCase().includes("income") ? "income" : "expense",
      currency: currency.toUpperCase(),
    };
  } catch (error) {
    console.error("Row normalization error:", error);
    return null;
  }
};

/**
 * @route   GET /api/import/template
 * @desc    Download CSV template
 * @access  Private
 */
const downloadTemplate = (req, res) => {
  const template = `Date,Amount,Category,Description,Type,Currency
2024-01-01,50.00,Food & Dining,Grocery shopping,expense,USD
2024-01-02,3000.00,Income,Monthly salary,income,USD
2024-01-03,20.00,Transportation,Gas station,expense,USD`;

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=transaction-template.csv"
  );
  res.send(template);
};

module.exports = {
  importCSV,
  downloadTemplate,
};
