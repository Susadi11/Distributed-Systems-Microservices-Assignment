const express = require('express');
const orderController = require('../controllers/OrderController');
const authMiddleware = require('../../../AuthService/src/middleware/authMiddleware'); // assuming this is the path

const router = express.Router();

// Route to create a new order (no authentication required)
router.post('/', orderController.createOrder);

// Route to update payment status (authentication required)
router.patch('/:orderId/payment-success', authMiddleware.authenticate, orderController.updatePaymentStatus);
router.get('/restaurant/:restaurantId', orderController.getOrdersByRestaurant);

router.get('/payments/restaurant/:restaurantId', orderController.getPaymentsDataByRestaurant);


// Add route for restaurant to update order status
router.patch('/:orderId/status', orderController.updateOrderStatus);

module.exports = router;
