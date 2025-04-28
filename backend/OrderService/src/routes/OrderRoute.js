const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../../../AuthService/src/middleware/authMiddleware'); // assuming this is the path

const router = express.Router();

// Route to create a new order (no authentication required)
router.post('/', orderController.createOrder);

// Route to update payment status (authentication required)
router.patch('/:orderId/payment-success', authMiddleware.authenticate, orderController.updatePaymentStatus);

module.exports = router;
