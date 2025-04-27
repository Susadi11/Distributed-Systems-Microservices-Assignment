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