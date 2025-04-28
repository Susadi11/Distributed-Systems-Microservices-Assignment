require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rabbitMQInstance = require('./utils/rabbitmq'); // Changed import

const app = express();
const PORT = process.env.PORT || 5559;
const MONGOURI = process.env.MONGOURI;

// Add these middleware before routes
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize RabbitMQ connection
rabbitMQInstance.connect().then(() => {
    console.log('RabbitMQ connected successfully');
}).catch(err => {
    console.error('Failed to connect to RabbitMQ:', err);
});

const cartRoutes = require("./routes/CartRoutes");
const orderRoutes = require("./routes/OrderRoute");

mongoose
    .connect(MONGOURI)
    .then(() => {
        console.log('App connected to the database');
        app.listen(PORT, () => {
            console.log(`App is listening to port : ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;