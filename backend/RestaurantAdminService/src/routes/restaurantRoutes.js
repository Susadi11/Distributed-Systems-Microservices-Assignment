// restaurantRoutes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');



router.post('/',restaurantController.registerRestaurant);

router.get('/', restaurantController.getRestaurants);

// // Route to find restaurant by email
// router.get('/email/:email', restaurantController.findRestaurantByEmail);
router.get('/email/:email', restaurantController.findRestaurantByEmail);
router.get('/admin/:email', restaurantController.findRestaurantByAdminEmail);


router.get('/user/:userId', restaurantController.getRestaurantByUserId);


router.put('/:id',restaurantController.updateRestaurant);

// Approve a restaurant
router.put('/:id/approve', restaurantController.approveRestaurant);

// Reject a restaurant
router.put('/:id/reject', restaurantController.rejectRestaurant);

console.log('Restaurant routes loaded');

//user side display approved restaurants
router.get('/verified', restaurantController.getVerifiedRestaurants);

//user side display pending restaurants
router.get('/pending', restaurantController.getPendingRestaurants);

module.exports = router;