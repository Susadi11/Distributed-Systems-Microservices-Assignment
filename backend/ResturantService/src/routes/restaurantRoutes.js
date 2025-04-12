const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

// Public routes (no authentication required)
router.get("/", restaurantController.listRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.get("/:id/menu", restaurantController.getRestaurantMenu);
router.get("/:restaurantId/food/:foodId", restaurantController.getFoodItemById);

module.exports = router;