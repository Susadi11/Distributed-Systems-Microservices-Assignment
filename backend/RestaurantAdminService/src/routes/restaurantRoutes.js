// restaurantRoutes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../../../AuthService/src/middleware/authMiddleware');

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: function(_req, _file, cb) {
//     cb(null, 'uploads/restaurants/'); // Make sure this directory exists
//   },
//   filename: function(req, file, cb) {
//     // Use user ID from auth token instead of restaurantId from params
//     cb(null, `restaurant-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// const fileFilter = (_req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// // Allowed roles for restaurant operations
// const restaurantAccess = ['restaurant_owner', 'admin', 'restaurant_admin'];

// router.patch('/profile', authMiddleware(restaurantAccess), upload.single('profileImage'),
//   restaurantController.createRestaurantProfile
// );

// // Get restaurant profile
// router.get(
//   '/profile',
//   authMiddleware(restaurantAccess),
//   restaurantController.getRestaurantProfile
// );

// Restaurant registration
router.post('/', restaurantController.registerRestaurant);

// Get all restaurants (consider adding auth/pagination)
router.get('/', restaurantController.getRestaurants);

console.log('Restaurant routes loaded');

module.exports = router;