const express = require('express');
const CartController = require('../controllers/CartController');
const authMiddleware = require('../../../AuthService/src/middleware/authMiddleware');
const router = express.Router();
const cartController = new CartController();

router.post('/add', authMiddleware(), cartController.addToCart.bind(cartController));
router.get('/', authMiddleware(), cartController.getCart.bind(cartController));
router.put('/update', authMiddleware(), cartController.updateCartItem.bind(cartController));
router.delete('/remove/:productId', authMiddleware(), cartController.removeCartItem.bind(cartController));

module.exports = router;