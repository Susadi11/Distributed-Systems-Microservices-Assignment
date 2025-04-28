import Delivery from "../models/Delivery.js";

export const createDelivery = async (req, res) => {
  try {
    const { orderId, driverId, restaurantId, customer, status } = req.body;

    const newDelivery = new Delivery({
      orderId,
      driverId,
      restaurantId,
      customer,
      status, // Optional - will default to "pending" if not provided
    });

    const savedDelivery = await newDelivery.save();
    res.status(201).json(savedDelivery);
  } catch (error) {
    console.error("Error creating delivery:", error);
    res.status(500).json({ message: "Failed to create delivery", error: error.message });
  }
};

export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate("driverId", "name email") // Populate driver basic info
      .populate("restaurantId", "name address") // Populate restaurant info
      .populate("customer"); // Populate order/customer info if needed

    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ message: "Failed to fetch deliveries", error: error.message });
  }
};

export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id)
      .populate("driverId", "name email")
      .populate("restaurantId", "name address")
      .populate("customer");

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error("Error fetching delivery:", error);
    res.status(500).json({ message: "Failed to fetch delivery", error: error.message });
  }
};


export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const allowedStatuses = ["pending", "assigned", "picked_up", "en_route", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid delivery status" });
    }

    const updatedDelivery = await Delivery.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json(updatedDelivery);
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ message: "Failed to update delivery", error: error.message });
  }
};


export const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDelivery = await Delivery.findByIdAndDelete(id);

    if (!deletedDelivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    console.error("Error deleting delivery:", error);
    res.status(500).json({ message: "Failed to delete delivery", error: error.message });
  }
};
