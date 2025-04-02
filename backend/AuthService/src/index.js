//index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5555;
const MONGOURI = process.env.MONGOURI;

app.use(cors()); // Allows cross-origin requests
app.use(express.json());

// Import Routes
app.use("/auth", require("./routes/authRoutes"));

// Database Connection
mongoose
    .connect(MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1); // Stop server if DB connection fails
    });

module.exports = app;
