const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const authMiddleware = require('../../../AuthService/src/middleware/authMiddleware');


// Routes
router.post('/',authMiddleware.authorize(['resturant_admin']), productController.createProduct);
router.get('/', authMiddleware.verifyRestaurantAdmin,productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Error handling middleware
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  } else if (err) {
    return res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
  next();
});

//for menu
router.get('/restaurant/:restaurantId', productController.getProductsByRestaurant);

module.exports = router;