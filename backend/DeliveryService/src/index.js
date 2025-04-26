require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5555;
const MONGOURI = process.env.MONGOURI;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  app.use(express.json());
  
  // Import your routes
//   app.use("/drivers", require("./routes/driverRoutes"));
//   app.use("/deliveries", require("./routes/deliveryRoutes"));
  
  // Connect to MongoDB (separate DB inside same cluster)
  mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("🚚 DeliveryService connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 DeliveryService running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error in DeliveryService:", err.message);
    process.exit(1);
  });
