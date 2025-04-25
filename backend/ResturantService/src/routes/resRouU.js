const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantConU');

// Existing route
router.get('/', restaurantController.getAllRestaurants);

// NEW route for getting restaurant menu
router.get('/:restaurantId/menu', restaurantController.getRestaurantMenu);

module.exports = router;