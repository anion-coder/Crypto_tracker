const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { connect } = require('nats');
const cryptoRoutes = require('./routes/cryptoRoutes');
const { storeCryptoStats } = require('./services/cryptoService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => { res.send('Crypto Tracker API Server'); });
app.use('/api', cryptoRoutes);

// Start the server first
app.listen(PORT, () => console.log(`API Server running on http://localhost:${PORT}`));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
}).then(async () => {
    console.log('Connected to MongoDB');
    
    // Start NATS connection
    const nc = await connect({ servers: process.env.NATS_URL });
    console.log('Connected to NATS');
    
    // Subscribe to crypto update events
    const sub = nc.subscribe('crypto.update');
    
    // Handle messages in a non-blocking way
    (async () => {
      for await (const msg of sub) {
        const data = JSON.parse(msg.data);
        if (data.trigger === 'update') {
          console.log('Received update trigger, fetching new crypto data...');
          await storeCryptoStats();
        }
      }
    })().catch(err => console.error('Error in NATS subscription:', err));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err)); 