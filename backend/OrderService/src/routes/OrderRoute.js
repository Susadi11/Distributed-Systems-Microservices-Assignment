const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../../../AuthService/src/middleware/authMiddleware'); // Adjust the path as necessary

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/restaurant', authMiddleware.verifyRestaurantAdmin, orderController.getRestaurantOrders);
router.patch('/:orderId/status', authMiddleware.verifyRestaurantAdmin, orderController.updateOrderStatus);

module.exports = router;