const Restaurant = require("../models/Restaurant");

// List all available restaurants (with category filtering)
exports.listRestaurants = async (req, res) => {
    try {
        const { category } = req.query;
        const query = { isActive: true };

        if (category) {
            query.cuisineType = { $regex: new RegExp(category, "i") };
        }

        const restaurants = await Restaurant.find(query)
            .select("name description cuisineType imageUrl openingHours")
            .lean();

        res.json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error while fetching restaurants"
        });
    }
};

// Get restaurant details by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            _id: req.params.id,
            isActive: true
        }).select("-__v").lean();

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                error: "Restaurant not found or not available"
            });
        }

        res.json({ success: true, data: restaurant });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error while fetching restaurant details"
        });
    }
};

// Get restaurant's full menu
exports.getRestaurantMenu = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            _id: req.params.id,
            isActive: true
        }).select("menu").lean();

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                error: "Restaurant not found or not available"
            });
        }

        res.json({
            success: true,
            data: {
                menu: restaurant.menu.filter(item => item.isAvailable)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error while fetching menu"
        });
    }
};

// Get specific food item details
exports.getFoodItemById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne(
            {
                _id: req.params.restaurantId,
                isActive: true,
                "menu._id": req.params.foodId,
                "menu.isAvailable": true
            },
            { "menu.$": 1 }
        ).lean();

        if (!restaurant || !restaurant.menu || restaurant.menu.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Food item not found or not available"
            });
        }

        res.json({ success: true, data: restaurant.menu[0] });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error while fetching food item"
        });
    }
};