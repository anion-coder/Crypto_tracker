const Crypto = require('../models/cryptoModel');

// Controller to handle /stats route
exports.getCryptoStats = async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: 'Coin parameter is required' });
  }

  try {
    // Find the latest record for the coin
    const latestRecord = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

    if (!latestRecord) {
      return res.status(404).json({ error: 'No data found for the requested coin' });
    }

    const { price, marketCap, change24h } = latestRecord.data;

    return res.json({
      price,
      marketCap,
      '24hChange': change24h,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Controller to handle /deviation route
exports.getCryptoDeviation = async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: 'Coin parameter is required' });
  }

  try {
    // Fetch the last 100 records for the coin
    const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);

    if (records.length === 0) {
      return res.status(404).json({ error: 'No data found for the requested coin' });
    }

    // Extract prices from the records
    const prices = records.map(record => record.data.price);

    // Calculate standard deviation
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / prices.length;
    const deviation = Math.sqrt(variance);

    return res.json({ deviation: parseFloat(deviation.toFixed(2)) });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
