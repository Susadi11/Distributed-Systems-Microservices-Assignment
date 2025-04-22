const Restaurant = require('../models/Restaurant');
// const { sendRegistrationEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');

exports.registerRestaurant = async (req, res) => {
  try {
    const {
      storeName,
      brandName,
      businessType,
      streetAddress,
      floorSuite,
      city,
      state,
      postalCode,
      firstName,
      lastName,
      phoneNumber,
      email,
      termsAccepted,
      // password,
      // confirmPassword,
      countryCode,
      userId // Make sure to extract the userId from the request body
    } = req.body;

    // // Password confirmation check
    // if (password !== confirmPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Passwords do not match'
    //   });
    // }

    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create restaurant object
    const newRestaurant = new Restaurant({
      storeName,
      brandName,
      businessType,
      address: {
        street: streetAddress,
        floorSuite: floorSuite || '',
        city,
        state,
        postalCode
      },
      contact: {
        firstName,
        lastName,
        phone: {
          countryCode: countryCode || '+94',
          number: phoneNumber
        },
        email
      },
      // password: hashedPassword,
      termsAccepted,
      user: userId // Add the userId to the user field
    });

    // Save to database
    const savedRestaurant = await newRestaurant.save();

    res.status(201).json({
      success: true,
      data: {
        id: savedRestaurant._id,
        storeName: savedRestaurant.storeName,
        email: savedRestaurant.contact.email
      },
      message: 'Restaurant registration submitted successfully!'
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
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

