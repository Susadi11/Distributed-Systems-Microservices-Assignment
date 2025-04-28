const express = require('express');
const cartController = require('../controllers/CartController');
const authMiddleware = require('../../../AuthService/src/middleware/authMiddleware');
const router = express.Router();

router.post('/add', authMiddleware(), cartController.addToCart);
router.get('/', authMiddleware(), cartController.getCart);
router.put('/update', authMiddleware(), cartController.updateCartItem);
router.delete('/remove/:productId', authMiddleware(), cartController.removeCartItem);
router.delete('/clear', authMiddleware(), cartController.clearCart);

module.exports = router;
