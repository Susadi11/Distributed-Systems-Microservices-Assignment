const Order = require('../models/OrderModel');
const User = require('../../../AuthService/src/models/User');
const {
    publishOrderCreated,
    publishOrderUpdated,
    publishOrderCancelled
} = require('../services/orderEventPublisher');
const mongoose = require('mongoose');
const { getChannel } = require('../rabbit');

exports.createOrder = async (req, res) => {
    try {
        // Extract data from request body sent by frontend checkout
        const orderData = req.body;

        // Log received data for debugging
        console.log('Received order data:', JSON.stringify(orderData, null, 2));

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
                        return res.status(400).json({
                            success: false,
                            message: 'User not found',
                            details: 'Could not find user with the provided username'
                        });
                    }
                } catch (err) {
                    console.error('Error finding user:', err);
                    return res.status(400).json({
                        success: false,
                        message: 'User ID is required',
                        details: err.message
                    });
                }
            }
        }

        // Verify the data before creating the order
        if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                details: 'Order must have at least one item'
            });
        }

        // Make sure all required fields in items are present
        for (let i = 0; i < orderData.items.length; i++) {
            const item = orderData.items[i];
            if (!item.productId || !item.quantity || !item.price || !item.name || !item.restaurant) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    details: `Item at index ${i} is missing required fields`,
                    item
                });
            }
        }

        // Validate delivery address
        if (!orderData.deliveryAddress ||
            !orderData.deliveryAddress.name ||
            !orderData.deliveryAddress.description ||
            !orderData.deliveryAddress.street ||
            !orderData.deliveryAddress.coordinates ||
            !Array.isArray(orderData.deliveryAddress.coordinates) ||
            orderData.deliveryAddress.coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                details: 'Delivery address is invalid or missing required fields',
                address: orderData.deliveryAddress
            });
        }

        // For card payments, set initial payment status
        if (orderData.paymentMethod === 'card') {
            orderData.paymentStatus = 'pending';
            orderData.status = 'payment_pending';
        }

        // Set default deliveryStatus if not provided
        if (!orderData.deliveryStatus) {
            orderData.deliveryStatus = 'finding-driver';
        }

        // Create the new order with the data from checkout
        const newOrder = new Order(orderData);

        // Attempt to save and catch any validation errors
        try {
            const savedOrder = await newOrder.save();
          
            // ─── RabbitMQ publish ───
            try {
              const channel = getChannel();
              channel.sendToQueue(
                'order_queue',
                Buffer.from(JSON.stringify({
                  orderId:      savedOrder._id,
                  userId:       savedOrder.user,
                  restaurantId: savedOrder.items[0].restaurant,
                  items:        savedOrder.items,
                  totalAmount:  savedOrder.totalAmount,
                  deliveryAddress: savedOrder.deliveryAddress,
                  status:       savedOrder.status,
                  paymentStatus: savedOrder.paymentStatus,
                  deliveryStatus:savedOrder.deliveryStatus,
                  createdAt:    savedOrder.createdAt
                })),
                { persistent: true }
              );
              console.log('Order created event published successfully');
            } catch (mqError) {
              console.error('Failed to publish order created event:', mqError);
              // fallback: log or store for retry
            }
            // ────────────────────────
          
            // send response back to client
            res.status(201).json({
              success: true,
              message: 'Order created successfully',
              order: savedOrder
            });
          } catch (validationError) {
            // … existing error handling …
          }          
    } catch (error) {
        console.error('Error creating order:', error);

        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentIntentId } = req.body;

        if (!orderId || !paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID and Payment Intent ID are required'
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                paymentId: paymentIntentId,
                paymentStatus: 'completed',
                status: 'confirmed'
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Publish order updated event to RabbitMQ
        try {
            await publishOrderUpdated({
                orderId: updatedOrder._id,
                newStatus: updatedOrder.status,
                paymentStatus: updatedOrder.paymentStatus,
                deliveryStatus: updatedOrder.deliveryStatus,
                updatedAt: updatedOrder.updatedAt
            });

            console.log('Order updated event published successfully');
        } catch (mqError) {
            console.error('Failed to publish order updated event:', mqError);
            // Implement fallback mechanism here
        }

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update payment status',
            error: error.message
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Order ID and status are required'
            });
        }

        // Update this list to match the schema enum values
        const validStatuses = ['confirmed', 'preparing', 'ready_for_delivery', 'out_for_delivery', 'canceled', 'pending', 'payment_pending'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Publish order updated event to RabbitMQ
        try {
            await publishOrderUpdated({
                orderId: updatedOrder._id,
                newStatus: updatedOrder.status,
                deliveryStatus: updatedOrder.deliveryStatus,
                updatedAt: updatedOrder.updatedAt
            });

            console.log('Order status update event published successfully');
        } catch (mqError) {
            console.error('Failed to publish order status update event:', mqError);
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
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

exports.getOrdersByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        console.log('Received request for restaurant orders with ID:', restaurantId);

        // Validate restaurant ID - more permissive validation
        if (!restaurantId || restaurantId.trim() === '') {
            console.log('Restaurant ID is empty or undefined');
            return res.status(400).json({
                success: false,
                message: 'Restaurant ID is required'
            });
        }

        let restaurantObjectId;
        try {
            // Try to convert to ObjectId
            restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);
            console.log('Converted to valid ObjectId:', restaurantObjectId);
        } catch (err) {
            console.log('Failed to convert to ObjectId:', err.message);
            return res.status(400).json({
                success: false,
                message: 'Invalid restaurant ID format'
            });
        }

        // Get query parameters for filtering
        const { status, deliveryStatus, startDate, endDate, limit = 20, page = 1 } = req.query;

        // Build query object - check both main restaurant field and items.restaurant
        const query = {
            $or: [
                { restaurant: restaurantObjectId },
                { 'items.restaurant': restaurantObjectId }
            ],
            ...(status && { status }),
            ...(deliveryStatus && { deliveryStatus }),
            ...(startDate && { createdAt: { $gte: new Date(startDate) } }),
            ...(endDate && { createdAt: { $lte: new Date(endDate) } })
        };

        console.log('Query for orders:', JSON.stringify(query));

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get orders with populated user information
        const orders = await Order.find(query)
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email phone'); // populate user info

        console.log(`Found ${orders.length} orders for restaurant`);

        // Get total count for pagination
        const totalOrders = await Order.countDocuments(query);

        // Format response
        const formattedOrders = orders.map(order => ({
            ...order.toObject(),
            user: order.user || { name: order.userName } // fallback to userName if user not populated
        }));

        res.status(200).json({
            success: true,
            count: orders.length,
            total: totalOrders,
            page: parseInt(page),
            pages: Math.ceil(totalOrders / limit),
            orders: formattedOrders
        });
    } catch (error) {
        console.error('Error fetching restaurant orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};