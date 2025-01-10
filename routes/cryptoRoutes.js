const express = require('express');
const cryptoController = require('../controllers/cryptoController');

const router = express.Router();

// Route to get the latest cryptocurrency data
router.get('/stats', cryptoController.getCryptoStats);

// Route to get standard deviation of the last 100 prices
router.get('/deviation', cryptoController.getCryptoDeviation);

module.exports = router;
