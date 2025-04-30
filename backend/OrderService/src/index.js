require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectRabbit } = require('./rabbit');
const cartRoutes = require('./routes/CartRoutes');
const orderRoutes = require('./routes/OrderRoute');

const app = express();
const PORT = process.env.PORT || 5559;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// Single bootstrap: connect DB, RabbitMQ, then start HTTP server
async function bootstrap() {
  await mongoose.connect(process.env.MONGOURI);
  console.log('🗄️  Connected to MongoDB');

  const channel = await connectRabbit();
  await channel.assertQueue('order_queue', { durable: true });
  console.log('Connected to RabbitMQ & asserted order_queue');

  app.listen(PORT, () => {
    console.log(`OrderService listening on port ${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error('Failed to start OrderService:', err);
  process.exit(1);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: err.message });
});
