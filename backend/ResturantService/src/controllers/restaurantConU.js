const axios = require('axios');
const RESTAURANT_ADMIN_SERVICE_URL = process.env.RESTAURANT_ADMIN_SERVICE_URL || 'http://localhost:5556';

// Existing method (unchanged)
const getAllRestaurants = async (req, res) => {
    try {
        const response = await axios.get(`${RESTAURANT_ADMIN_SERVICE_URL}/api/restaurants/verified`);
        const verifiedRestaurants = response.data.data;

        const categorized = verifiedRestaurants.reduce((acc, restaurant) => {
            const type = restaurant.businessType || 'Other Food Business';
            acc[type] = acc[type] || [];
            acc[type].push(restaurant);
            return acc;
        }, {});

        res.json({
            success: true,
            count: verifiedRestaurants.length,
            data: categorized
        });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch restaurants',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

const getRestaurantMenu = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // 1. Get menu items directly (no restaurant verification)
        const menuResponse = await axios.get(
            `${RESTAURANT_ADMIN_SERVICE_URL}/api/products/restaurant/${restaurantId}`
        );

        res.json({
            success: true,
            menu: menuResponse.data.data || [],
            count: menuResponse.data.data?.length || 0
        });

    } catch (err) {
        console.error('Menu Error:', err);

        if (err.response?.status === 404) {
            return res.status(404).json({
                success: false,
                error: 'Menu not found for this restaurant'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch menu',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = {
    getAllRestaurants,
    getRestaurantMenu  // Export the new method
};