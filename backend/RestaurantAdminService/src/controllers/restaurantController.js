const Restaurant = require('../models/Restaurant');
// const { sendRegistrationEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');


exports.createRestaurantProfile = async (req, res) => {
  try {
    // First, check if auth middleware attached the user object
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed - no user found in request'
      });
    }
    
    console.log('User ID from token:', req.user.id);
    console.log('Request body:', req.body);
    console.log('File uploaded:', req.file);
    
    // Extract userId from token (already done by auth middleware)
    const userId = req.user.id;
    
    // Build update object conditionally
    const updateData = {};
    const { description, openTime, closeTime, isOpenNow, cuisineTypes } = req.body;
    
    if (description) updateData.description = description;
    
    if (openTime && closeTime) {
      updateData.openingHours = {
        open: openTime,
        close: closeTime
      };
    }
    
    if (isOpenNow !== undefined) {
      updateData.isOpenNow = isOpenNow === 'true' || isOpenNow === true;
    }
    
    if (cuisineTypes) {
      updateData.cuisineTypes = cuisineTypes.split(',').map(cuisine => cuisine.trim());
    }
    
    // Handle file upload
    if (req.file) {
      const imagePath = `/uploads/restaurants/${req.file.filename}`;
      updateData.$push = { profileImage: imagePath };
    }
    
    const options = {
      new: true, // Return the updated document
      runValidators: true // Run schema validators on update
    };
    
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { user: userId },
      updateData,
      options
    );
    
    if (!updatedRestaurant) {
      return res.status(404).json({
        success: false,
        error: 'No restaurant found for this user'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedRestaurant,
      message: 'Restaurant profile updated successfully'
    });
    
  } catch (error) {
    console.error('Error details:', error);
    console.error('Error updating restaurant profile:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    // Handle multer file upload errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large (max 5MB)'
      });
    }
    
    if (error.message && error.message.includes('Not an image')) {
      return res.status(400).json({
        success: false,
        error: 'Only image files are allowed'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating restaurant profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const pending = await Restaurant.find({ status: 'pending' });
    const verified = await Restaurant.find({ status: 'verified' });
    const rejected = await Restaurant.find({ status: 'rejected' });

    res.status(200).json({
      success: true,
      data: {
        pending,
        verified,
        rejected
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants by status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurants'
    });
  }
};


