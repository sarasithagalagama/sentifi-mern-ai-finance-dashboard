const axios = require("axios");

// Cache for exchange rates (1 hour TTL)
let rateCache = {
  rates: null,
  timestamp: null,
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetch latest exchange rates
 */
const fetchExchangeRates = async () => {
  try {
    // Check cache first
    if (rateCache.rates && Date.now() - rateCache.timestamp < CACHE_DURATION) {
      return rateCache.rates;
    }

    // Using ExchangeRate-API.com (free tier)
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    const response = await axios.get(baseUrl);

    if (response.data.result === "success") {
      rateCache.rates = response.data.conversion_rates;
      rateCache.timestamp = Date.now();
      return rateCache.rates;
    } else {
      throw new Error("Failed to fetch exchange rates");
    }
  } catch (error) {
    console.error("Exchange rate fetch error:", error.message);

    // If cache exists, use it even if expired
    if (rateCache.rates) {
      console.log("Using cached exchange rates");
      return rateCache.rates;
    }

    // Fallback to default rates (1:1)
    console.log("Using fallback exchange rates");
    return { USD: 1 };
  }
};

/**
 * Convert amount from one currency to another
 */
const convertCurrency = async (
  amount,
  fromCurrency = "USD",
  toCurrency = "USD"
) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rates = await fetchExchangeRates();

  // All rates are based on USD, so we need to convert through USD
  const amountInUSD =
    fromCurrency === "USD" ? amount : amount / (rates[fromCurrency] || 1);
  const convertedAmount =
    toCurrency === "USD" ? amountInUSD : amountInUSD * (rates[toCurrency] || 1);

  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

/**
 * Get available currencies
 */
const getAvailableCurrencies = async () => {
  const rates = await fetchExchangeRates();
  return Object.keys(rates);
};

module.exports = {
  fetchExchangeRates,
  convertCurrency,
  getAvailableCurrencies,
};
