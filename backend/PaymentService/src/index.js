const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for PaymentService'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/', paymentRoutes);

// Start server
const PORT = process.env.PORT || 5552;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PaymentService running on http://0.0.0.0:${PORT}`);
});
