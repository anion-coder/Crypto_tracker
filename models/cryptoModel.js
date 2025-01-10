const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  coin: { 
    type: String, 
    required: true 
}, 
  data: {
    price: { 
        type: Number, 
        required: true 
    },
    marketCap: { 
        type: Number, 
        required: true 
    },
    change24h: { 
        type: Number, 
        required: true 
    },
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
}, 
});

// Index the data by coin and timestamp
cryptoSchema.index({ coin: 1, timestamp: -1 });

const Crypto = mongoose.model('Crypto', cryptoSchema);
module.exports = Crypto;
