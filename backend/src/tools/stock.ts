import axios from "axios";

export const fetchStock = async (input: string): Promise<string> => {
  let ticker = input.trim().toUpperCase();
  
  try {
    const parsed = JSON.parse(input);
    if (parsed.ticker) {
      ticker = parsed.ticker.toUpperCase();
    } else if (parsed.symbol) {
      ticker = parsed.symbol.toUpperCase();
    }
  } catch {
    // Not JSON, use raw string
  }

  if (!ticker) {
    return "Error: Please provide a valid stock ticker symbol (e.g., 'AAPL', 'MSFT', 'TSLA').";
  }

  try {
    // Yahoo Finance v8 chart endpoint (publicly accessible, no auth required)
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`, {
      params: {
        interval: "1d",
        range: "1d"
      },
      headers: {
        // Simple User-Agent to avoid basic blocks
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      timeout: 8000
    });

    const result = response.data?.chart?.result?.[0];
    if (!result || !result.meta) {
      return `Could not find stock data for ticker: ${ticker}`;
    }

    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const currency = meta.currency;
    const exchange = meta.exchangeName;
    const instrumentType = meta.instrumentType; // e.g., EQUITY, CRYPTOCURRENCY
    
    const change = currentPrice - previousClose;
    const percentChange = (change / previousClose) * 100;
    
    const sign = change >= 0 ? "+" : "";

    return [
      `Market Data for ${ticker} (${exchange} - ${instrumentType}):`,
      `Current Price: ${currentPrice.toFixed(2)} ${currency}`,
      `Change: ${sign}${change.toFixed(2)} (${sign}${percentChange.toFixed(2)}%)`,
      `Previous Close: ${previousClose.toFixed(2)} ${currency}`,
    ].join("\n");

  } catch (error: any) {
    if (error.response?.status === 404) {
      return `Stock ticker '${ticker}' not found. Please ensure it is a valid Yahoo Finance symbol.`;
    }
    console.error("[stock tool] Error:", error.message);
    return `Failed to fetch stock data for ${ticker}: ${error.message}`;
  }
};
