const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');



exports.registerRestaurant = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = {
      storeName: 'Store name',
      brandName: 'Brand name',
      businessType: 'Business type',
      firstName: 'First name',
      lastName: 'Last name',
      phoneNumber: 'Phone number',
      storeAddress: 'Street address',  // This matches the form field name
      city: 'City',
      state: 'State',
      postalCode: 'Postal code',
      email: 'Email',
      userId: 'User ID'
    };

    // Check for missing fields
    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !req.body[field])
      .map(([_, label]) => label);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(req.body.phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number (10-15 digits)'
      });
    }

    // Create new restaurant
    const newRestaurant = new Restaurant({
      storeName: req.body.storeName,
      brandName: req.body.brandName,
      businessType: req.body.businessType,
      address: {
        street: req.body.storeAddress,  // Changed from streetAddress to storeAddress
        floorSuite: req.body.floorSuite || '',
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode
      },
      contact: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: {
          countryCode: req.body.countryCode || '+94',
          number: req.body.phoneNumber
        },
        email: req.body.email
      },
      termsAccepted: req.body.termsAccepted,
      user: req.body.userId
    });

    // Handle file upload
    if (req.file) {
      newRestaurant.profileImage = [`/${req.file.path.replace(/\\/g, '/')}`];
    }

    // Save restaurant
    const savedRestaurant = await newRestaurant.save();

    // Generate new JWT with restaurant_id
    const enhancedToken = jwt.sign(
      {
        userId: req.body.userId,
        restaurantId: savedRestaurant._id,
        role: 'restaurant_admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        token: enhancedToken,
        restaurant: {
          id: savedRestaurant._id,
          storeName: savedRestaurant.storeName,
          email: savedRestaurant.contact.email,
          profileImage: savedRestaurant.profileImage
        }
      },
      message: 'Restaurant registered successfully!'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Get restaurant by user ID

exports.getRestaurantByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Received userId:', userId);
    console.log('Is userId a valid ObjectId?', mongoose.Types.ObjectId.isValid(userId));

    let restaurant;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      const objectId = new mongoose.Types.ObjectId(userId); // Use 'new' here
      console.log('Trying to find restaurant with ObjectId:', objectId);
      restaurant = await Restaurant.findOne({ user: objectId });
      console.log('Restaurant found (ObjectId):', restaurant);
    }

    if (!restaurant) {
      console.log('Trying to find restaurant with userId as string:', userId);
      restaurant = await Restaurant.findOne({ user: userId });
      console.log('Restaurant found (string):', restaurant);
    }

    if (!restaurant) {
      console.log('Trying with $or condition...');
      restaurant = await Restaurant.findOne({
        $or: [
          { user: userId },
          { user: new mongoose.Types.ObjectId(userId) }, // Use 'new' here
          { userId: userId },
          { userId: new mongoose.Types.ObjectId(userId) } // Use 'new' here
        ]
      });
      console.log('Restaurant found ($or):', restaurant);
    }

    if (!restaurant) {
      console.log('No restaurant found for userId:', userId);
      return res.status(404).json({
        success: false,
        message: 'No restaurant found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurant'
    });
  }
};



exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      storeName,
      brandName,
      businessType,
      address, // Receive the whole address object
      contact, // Receive the whole contact object
      openingHours,
      isOpenNow,
      cuisineTypes,
      profileImage
    } = req.body;

    // Basic input validation (check for the existence of essential fields)
    if (!storeName || !brandName || !businessType) {
      return res.status(400).json({
        success: false,
        message: 'Store name, brand name, and business type are required.'
      });
    }

    // Construct the update object.  Handles nested objects and optional fields.
    const updateData = {
      storeName,
      brandName,
      businessType,
      openingHours, // Use what is sent, or leave as is.
      isOpenNow,
      cuisineTypes,
      profileImage
    };

    // Handle address updates.
    if (address) {
      updateData.address = {
        street: address.street,
        floorSuite: address.floorSuite,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
      };
    }

    // Handle contact updates
    if (contact) {
      updateData.contact = {
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: {
          countryCode: contact.phone?.countryCode,  //Use optional chaining.
          number: contact.phone?.number,
        },
      };
    }
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateData,  // Use the constructed updateData object.
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedRestaurant
    });
  } catch (error) {
    console.error('Update error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during update'
    });
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const { status } = req.query;

    // Always filter by status (default to approved if not specified)
    const filter = status ? { status } : { status: 'approved' };

    const restaurants = await Restaurant.find(filter)
        .select('-password -__v')
        .lean();

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants // Return a flat array
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurants',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Approve restaurant
exports.approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status: 'verified' },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Reject restaurant
exports.rejectRestaurant = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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

//user side display verified restaurants
exports.getVerifiedRestaurants = async (req, res) => {
  try {
    const verified = await Restaurant.find({ status: 'verified' })
        .select('-__v -password')
        .lean();

    res.status(200).json({
      success: true,
      count: verified.length,
      data: verified
    });
  } catch (error) {
    console.error('Error fetching verified restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching verified restaurants'
    });
  }
};
