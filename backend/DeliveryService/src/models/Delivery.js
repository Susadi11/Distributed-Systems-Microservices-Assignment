import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true 
  }, // Order ID from OrderService
  driverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  }, // Driver assigned
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId, 
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
