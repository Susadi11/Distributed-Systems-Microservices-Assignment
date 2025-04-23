const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');


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
      countryCode,
      userId 
    } = req.body;

    // Create new restaurant object
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
      termsAccepted,
      user: userId
    });

    // Add profile image if it was uploaded
    if (req.file) {
      // Store the path to the uploaded file
      newRestaurant.profileImage = [`/${req.file.path.replace(/\\/g, '/')}`];
    }

    // Save to database
    const savedRestaurant = await newRestaurant.save();

    res.status(201).json({
      success: true,
      data: {
        id: savedRestaurant._id,
        storeName: savedRestaurant.storeName,
        email: savedRestaurant.contact.email,
        profileImage: savedRestaurant.profileImage
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

