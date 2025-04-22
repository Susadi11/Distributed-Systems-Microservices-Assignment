// routes/restaurantProxyRoutes.js
const express = require('express');
const router = express.Router();
const restaurantProxyController = require('../controllers/restaurantProxyController');

// Fetch all restaurants by status (pending, verified, rejected)
router.get('/proxy/restaurants', restaurantProxyController.fetchRestaurants);

// Approve a specific restaurant
router.put('/proxy/restaurants/:id/approve', restaurantProxyController.approveRestaurant);

// Reject a specific restaurant
router.put('/proxy/restaurants/:id/reject', restaurantProxyController.rejectRestaurant);

module.exports = router;
