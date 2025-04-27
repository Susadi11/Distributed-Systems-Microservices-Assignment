// index.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import deliveryRoutes from "./routes/deliveryRouter.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5554;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/deliveries", deliveryRoutes); // ✅ Mount the delivery routes

// Database Connection
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((error) => {
  console.error("❌ MongoDB connection failed:", error.message);
});
