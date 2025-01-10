const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('./jobs/fetchCryptoJob'); 
const cryptoRoutes = require('./routes/cryptoRoutes');
const jobs = require('./jobs/fetchCryptoJob');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '16kb' })); // Parse JSON payloads with a size limit
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Parse URL-encoded payloads
app.use(cookieParser()); // Parse cookies

// Routes
app.get('/', (req, res) => { res.send('Hello World!'); });
app.use('/api',cryptoRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

jobs();
