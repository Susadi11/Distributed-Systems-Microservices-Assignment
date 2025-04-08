const express = require('express');
const router = express.Router();
const orderController = new OrderController();

// Middleware for authentication and role-based access could be added here
// Example: const { authenticate, authorizeCustomer, authorizeRestaurant } = require('../middleware/auth');

router.post('/orders', orderController.createOrder);
router.get('/customers/:customerId/orders', orderController.getCustomerOrders);
router.get('/restaurants/:restaurantId/orders', orderController.getRestaurantOrders);
router.put('/orders/:orderId', orderController.updateOrder);
router.patch('/orders/:orderId/status', orderController.updateOrderStatus);
router.get('/customers/:customerId/history', orderController.getOrderHistory);

module.exports = router;