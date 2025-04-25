const Order = require('../models/OrderModel'); // Adjust path as needed
const mongoose = require('mongoose');

class OrderController {
    // Place a new order
    async createOrder(req, res) {
        try {
            const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
            const customerId = req.user.id; // Get customer ID from authenticated user

            // Validate input
            if (!restaurantId || !items || !totalAmount || !deliveryAddress) {
                return res.status(400).json({ message: 'Missing required order details' });
            }

            const newOrder = new Order({
                customerId,
                restaurantId,
                items,
                totalAmount,
                deliveryAddress,
                orderStatus: 'Pending',
                paymentStatus: 'Pending'
            });

            const savedOrder = await newOrder.save();

            res.status(201).json({ message: 'Order created successfully', order: savedOrder });
        } catch (error) {
            res.status(500).json({ message: 'Error creating order', error: error.message });
        }
    }

    // Get all orders for a customer (logged-in customer)
    async getCustomerOrders(req, res) {
        try {
            const customerId = req.user.id; // Get customer ID from authenticated user

            const orders = await Order.find({ customerId })
                .populate('restaurantId')
                .populate('items.foodItemId')
                .sort({ createdAt: -1 });

            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching customer orders', error: error.message });
        }
    }

    // Get orders for a restaurant
    async getRestaurantOrders(req, res) {
        try {
            const { restaurantId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
                return res.status(400).json({ message: 'Invalid restaurant ID' });
            }

            const orders = await Order.find({ restaurantId })
                .populate('customerId')
                .populate('items.foodItemId')
                .sort({ createdAt: -1 });

            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching restaurant orders', error: error.message });
        }
    }

    // Modify order before confirmation
    async updateOrder(req, res) {
        try {
            const { orderId } = req.params;
            const updateData = req.body;

            // Prevent status updates through this method
            delete updateData.orderStatus;
            delete updateData.paymentStatus;

            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { ...updateData, updatedAt: Date.now() },
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
        } catch (error) {
            res.status(500).json({ message: 'Error updating order', error: error.message });
        }
    }

    // Update order status (for restaurant/delivery)
    async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { orderStatus, paymentStatus } = req.body;

            const updateData = { updatedAt: Date.now() };

            if (orderStatus) {
                updateData.orderStatus = orderStatus;
            }

            if (paymentStatus) {
                updateData.paymentStatus = paymentStatus;
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                updateData,
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
        } catch (error) {
            res.status(500).json({ message: 'Error updating order status', error: error.message });
        }
    }

    // View order history (logged-in customer)
    async getOrderHistory(req, res) {
        try {
            const customerId = req.user.id; // Get customer ID from authenticated user

            const orders = await Order.find({ customerId, orderStatus: 'Completed' })
                .populate('restaurantId')
                .populate('items.foodItemId')
                .sort({ createdAt: -1 });

            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching order history', error: error.message });
        }
    }
}

module.exports = OrderController;