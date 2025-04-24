const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantConU');


router.get('/', restaurantController.getAllRestaurants);

module.exports = router;