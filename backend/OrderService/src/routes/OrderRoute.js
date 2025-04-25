const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authenticateUser, authorizeRole } = require('../../../AuthService/src/middleware/authMiddleware');

const orderController = new OrderController();

// Place a new order (requires customer authentication)
router.post('/orders', authenticateUser, authorizeRole(['customer']), orderController.createOrder);

// Get all orders for a customer (requires customer authentication)
router.get('/customers/orders', authenticateUser, authorizeRole(['customer']), orderController.getCustomerOrders);

// Get orders for a restaurant (no specific role requirement mentioned, adjust as needed)
router.get('/restaurants/:restaurantId/orders', authenticateUser, authorizeRole(['resturant_admin', 'admin']), orderController.getRestaurantOrders);

// Modify order before confirmation (requires customer authentication)
router.put('/orders/:orderId', authenticateUser, authorizeRole(['customer']), orderController.updateOrder);

// Update order status (requires restaurant admin or delivery personnel authentication)
router.patch('/orders/:orderId/status', authenticateUser, authorizeRole(['resturant_admin', 'delivery_personnel', 'admin']), orderController.updateOrderStatus);

// View order history (requires customer authentication)
router.get('/customers/history', authenticateUser, authorizeRole(['customer']), orderController.getOrderHistory);

module.exports = router;