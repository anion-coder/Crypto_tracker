const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '16kb' })); // Parse JSON payloads with a size limit
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Parse URL-encoded payloads
app.use(cookieParser()); // Parse cookies

// Routes
app.get('/', (req, res) => { res.send('Hello World!'); });

// Connect to MongoDB
mongoose.connect('mongodb+srv://siddhanthmoraje:fImfd9vy48T9LhbS@cluster0.ypc0ggk.mongodb.net/testDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));