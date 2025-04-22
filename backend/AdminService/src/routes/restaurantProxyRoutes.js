// routes/restaurantProxyRoutes.js
const express = require('express');
const router = express.Router();
const restaurantProxyController = require('../controllers/restaurantProxyController');

router.get('/proxy/restaurants', restaurantProxyController.fetchRestaurants);

module.exports = router;
