// controllers/restaurantProxyController.js
const axios = require('axios');

exports.fetchRestaurants = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.RESTAURANT_SERVICE_BASE_URL}/api/restaurants`);

    // Optional: validate structure if needed
    if (
      response.data?.data?.pending &&
      response.data?.data?.verified &&
      response.data?.data?.rejected
    ) {
      res.status(200).json(response.data);
    } else {
      res.status(502).json({ message: 'Unexpected response format from RestaurantAdminService' });
    }

  } catch (error) {
    console.error('Error calling RestaurantAdminService:', error.message);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch restaurants from RestaurantAdminService';

    res.status(status).json({ message });
  }
};
