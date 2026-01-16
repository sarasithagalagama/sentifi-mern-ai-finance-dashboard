const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

/**
 * Extract data from receipt image using Tesseract.js (will be implemented on frontend)
 * This service primarily handles image upload to Cloudinary
 */
const uploadReceiptImage = async (fileBuffer, fileName) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "expense-tracker/receipts",
          public_id: `receipt_${Date.now()}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      );

      // Convert buffer to stream and upload
      Readable.from(fileBuffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Receipt upload error:", error);
    throw new Error("Failed to upload receipt image");
  }
};

/**
 * Delete receipt image from Cloudinary
 */
const deleteReceiptImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Receipt deletion error:", error);
  }
};

/**
 * Parse OCR results (placeholder for client-side Tesseract.js results)
 * The actual OCR will happen on the frontend with Tesseract.js
 * This function validates and structures the data
 */
const parseOCRResults = (ocrData) => {
  const { date, amount, merchantName } = ocrData;

  // Validate and return structured data
  return {
    date: date ? new Date(date) : new Date(),
    amount: amount ? parseFloat(amount) : 0,
    merchantName: merchantName || "Unknown Merchant",
  };
};

module.exports = {
  uploadReceiptImage,
  deleteReceiptImage,
  parseOCRResults,
};
