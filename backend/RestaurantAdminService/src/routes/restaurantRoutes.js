// restaurantRoutes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage configuration for restaurant profile images
const storage = multer.diskStorage({
  destination: function(_req, _file, cb) {
    const uploadDir = 'uploads/restaurants';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(_req, file, cb) {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'restaurant-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize multer with our configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limit to 5MB
  },
  fileFilter: fileFilter
});



router.post('/', upload.single('profileImage'),restaurantController.registerRestaurant);

router.get('/', restaurantController.getRestaurants);



router.get('/user/:userId', restaurantController.getRestaurantByUserId);


router.put('/:id',restaurantController.updateRestaurant);

// Approve a restaurant
router.put('/:id/approve', restaurantController.approveRestaurant);

// Reject a restaurant
router.put('/:id/reject', restaurantController.rejectRestaurant);

console.log('Restaurant routes loaded');

//user side display approved restaurants
router.get('/verified', restaurantController.getVerifiedRestaurants);

module.exports = router;