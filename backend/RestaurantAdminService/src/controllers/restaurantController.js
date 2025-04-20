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
      password,
      confirmPassword,
      countryCode
    } = req.body;

    // Password confirmation check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create restaurant objectac
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
      password: hashedPassword,
      termsAccepted
    });

    // Save to database
    const savedRestaurant = await newRestaurant.save();

    // // Optional: send confirmation email
    // await sendRegistrationEmail({
    //   email,
    //   name: `${firstName} ${lastName}`,
    //   restaurantName: storeName
    // });

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
    const restaurants = await Restaurant.find();
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurants'
    });
  }
};

// Add more controller methods as needed...