const axios = require('axios');
const Crypto = require('../models/cryptoModel');
const cron = require('node-cron');

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
  },
  timeout: 5000 // Add timeout to prevent hanging
});

const COINS = ['bitcoin', 'matic-network', 'ethereum'];

// ...existing code...

const fetchCryptoData = async () => {
    console.log('Fetching crypto data...', new Date().toISOString());
    
    try {
      const response = await api.get('/coins/markets', {
        params: {
          ids: COINS.join(','),
          vs_currency: 'usd',
        }
      });
  
      const documents = response.data.map(coinData => ({
        coin: coinData.id,
        data: {
          price: coinData.current_price,
          marketCap: coinData.market_cap,
          change24h: coinData.price_change_percentage_24h,
        },
        timestamp: new Date()  // This will be unique for each insertion
      }));
  
      const result = await Crypto.insertMany(documents);
    console.log(`Inserted ${result.length} new documents at ${new Date().toISOString()}`);
      
    } catch (error) {
      console.error('Error in fetchCryptoData:', error);
      throw error; // Propagate error for proper handling
    }
  };
  
  // Initialize cron job
  const initCronJob = async() => {
    try {
      // Immediate first fetch
      console.log('[INITIAL] Starting initial data fetch...');
      await fetchCryptoData();


      console.log('Starting cron job...');
      cron.schedule('*/5 * * * *', async () => {  // Run every 5 minutes
        try {
          await fetchCryptoData();
        } catch (error) {
          console.error('Cron job execution failed:', error);
        }
      });
    } catch (error) {
      console.error('Error scheduling cron job:', error);
    }
  };
  
  module.exports = initCronJob;