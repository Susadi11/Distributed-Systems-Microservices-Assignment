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
// controllers/restaurantProxyController.js

exports.approveRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.put(
      `${process.env.RESTAURANT_SERVICE_BASE_URL}/api/restaurants/${id}/approve`
    );
    // After approving, update the status and send back the response
    res.status(200).json({ ...response.data, status: 'approved' });
  } catch (error) {
    console.error(`Error approving restaurant ${id}:`, error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to approve restaurant';
    res.status(status).json({ message });
  }
};

exports.rejectRestaurant = async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  try {
    const response = await axios.put(
      `${process.env.RESTAURANT_SERVICE_BASE_URL}/api/restaurants/${id}/reject`,
      { rejectionReason }
    );
    // After rejecting, update the status and send back the response
    res.status(200).json({ ...response.data, status: 'rejected' });
  } catch (error) {
    console.error(`Error rejecting restaurant ${id}:`, error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to reject restaurant';
    res.status(status).json({ message });
  }
};
