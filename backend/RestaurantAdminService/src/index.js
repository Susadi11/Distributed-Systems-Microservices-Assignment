require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const path = require('path');
const connectDB = require('./db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public/restaurant', express.static(path.join(__dirname, 'public/restaurant')));


// Routes
app.use('/api/products', productRoutes);
app.use('/api/restaurants', restaurantRoutes);


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5556; // Changed port

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    // You could automatically try another port here
    const newPort = Number(PORT) + 1;
    console.log(`Trying port ${newPort} instead`);
    app.listen(newPort);
  } else {
    console.error('Server error:', error);
  }
});