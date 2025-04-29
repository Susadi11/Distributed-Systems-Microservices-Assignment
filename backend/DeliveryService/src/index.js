// src/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import deliveryRoutes from "./routes/deliveryRouter.js";
import startConsumer from "./deliveryConsumer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5554;

app.use(cors());
app.use(express.json());
app.use("/api/deliveries", deliveryRoutes);

async function bootstrap() {
  // 1. Connect to MongoDB
  await mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB Connected");

  // 2. Start your RabbitMQ consumer
  await startConsumer();

  // 3. Start HTTP server
  app.listen(PORT, () => {
    console.log(`🚀 DeliveryService running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ DeliveryService failed to start:", err);
  process.exit(1);
});
