require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const restaurantRoutes = require("../src/routes/resRouU");

const app = express();
const PORT = process.env.PORT || 5558;
const MONGOURI = process.env.MONGOURI;

// Middleware
app.use(express.json());


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('App connected to the database');
        app.listen(PORT, () => {
            console.log(`App is listening to port : ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });

// Routes
app.use("/restaurants", restaurantRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
});

module.exports = app;