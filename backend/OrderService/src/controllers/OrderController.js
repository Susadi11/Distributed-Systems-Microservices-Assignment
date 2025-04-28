const Order = require('../models/OrderModel');
const User = require('../../../AuthService/src/models/User'); // Import User model to access user data

exports.createOrder = async (req, res) => {
    try {
        // Extract data from request body sent by frontend checkout
        const orderData = req.body;

        // Get user ID from authentication token
        if (req.user) {
            orderData.user = req.user._id;
        } else {
            // If testing without authentication, you may need to ensure user ID exists
            if (!orderData.user) {
                // Find user by name or other identifier if needed
                try {
                    const user = await User.findOne({ name: orderData.userName });
                    if (user) {
                        orderData.user = user._id;
                    } else {
                        return res.status(400).json({ message: 'User not found' });
                    }
                } catch (err) {
                    console.error('Error finding user:', err);
                    return res.status(400).json({ message: 'User ID is required' });
                }
            }
        }

        // Create the new order with the data from checkout
        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        // Return success response that matches what the frontend expects
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: savedOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: error.message
            });
        }

        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};
// controllers/orderController.js
exports.getRestaurantOrders = async (req, res) => {
    try {
        const restaurantId = req.user.restaurantId;
        const { status } = req.query;

        const query = { 
            'items.restaurant': restaurantId,
            ...(status && { status })
        };

        const orders = await Order.find(query)
            // Remove .populate('user') completely
            .populate('items.productId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const restaurantId = req.user.restaurantId;
        const { orderId } = req.params;
        const { status } = req.body;

        if (!restaurantId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Restaurant association required.'
            });
        }

        // Verify the order belongs to this restaurant
        const order = await Order.findOne({
            _id: orderId,
            'items.restaurant': restaurantId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or not associated with your restaurant'
            });
        }

        // Validate status transition
        const validTransitions = {
            'confirmed': ['preparing', 'canceled'],
            'preparing': ['picked-up', 'canceled'],
            'picked-up': ['delivered'],
            // Other status transitions as needed
        };

        if (!validTransitions[order.status]?.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status transition from ${order.status} to ${status}`
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};