import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true 
  }, // Order ID from OrderService
  driverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Driver",
    required: true 
  }, // Driver assigned
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Restaurant",
    required: true 
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order",
    required: true 
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "picked_up", "en_route", "delivered", "cancelled"],
    default: "pending"
  }
}, { timestamps: true }); // Adds createdAt, updatedAt automatically

const Delivery = mongoose.model("Delivery", DeliverySchema);

export default Delivery;
