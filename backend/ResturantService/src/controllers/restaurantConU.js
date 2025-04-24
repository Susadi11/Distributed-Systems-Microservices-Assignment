const axios = require('axios');
const RESTAURANT_ADMIN_SERVICE_URL = process.env.RESTAURANT_ADMIN_SERVICE_URL || 'http://localhost:5556';

const getAllRestaurants = async (req, res) => {
    try {
        // Get only verified restaurants from AdminService
        const response = await axios.get(`${RESTAURANT_ADMIN_SERVICE_URL}/api/restaurants/verified`);

        const verifiedRestaurants = response.data.data;

        // Categorize by business type
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

module.exports = {
    getAllRestaurants
};