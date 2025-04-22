const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// @route   POST api/restaurants
// @desc    Register a new restaurant
// @access  Public
router.post('/', restaurantController.registerRestaurant);

// @route   GET api/restaurants
// @desc    Get all restaurants
// @access  Public (or make it private if needed)
router.get('/', restaurantController.getRestaurants);

// Approve a restaurant
router.put('/:id/approve', restaurantController.approveRestaurant);

// Reject a restaurant
router.put('/:id/reject', restaurantController.rejectRestaurant);


module.exports = router;