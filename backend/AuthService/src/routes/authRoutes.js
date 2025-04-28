const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, address, phone, deliveryPersonnelDetails } = req.body;

    console.log("Registration attempt:", req.body);

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // If role is delivery_personnel, validate deliveryPersonnelDetails fields
    if (role === "delivery_personnel") {
      const requiredFields = ["vehicleType", "vehicleNumber", "Make", "Model", "year", "DriverLicense"];
      for (const field of requiredFields) {
        if (!deliveryPersonnelDetails || !deliveryPersonnelDetails[field]) {
          return res.status(400).json({ error: `Field ${field} is required for delivery personnel` });
        }
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      address,
      phone
    };

    // Add deliveryPersonnelDetails if role is delivery_personnel
    if (role === "delivery_personnel") {
      userData.deliveryPersonnelDetails = deliveryPersonnelDetails;
    }

    // Create user
    const newUser = await User.create(userData);

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("User created successfully:", newUser);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});


// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      if (!email || !password) {
          return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
      }

      let payload = { id: user._id, role: user.role };
      let userDetails = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          longitude: user.longitude,
          latitude: user.latitude,
          address: user.address,
          phone: user.phone
      };


      if (user.role === 'resturant_admin') {
        try {
            const restaurantServiceUrl = 'http://localhost:5556';
            const restaurantResponse = await axios.get(
                `${restaurantServiceUrl}/api/restaurants/admin/${email}`
            );

            const restaurant = restaurantResponse.data.restaurant;

            if (!restaurant) {
                return res.status(404).json({ 
                    error: "Restaurant registration not found. Please register your restaurant first." 
                });
            }

            if (restaurant.status.toLowerCase() !== 'approved') {
                const statusMessage = restaurant.status.toLowerCase();
                let friendlyMessage = "Your restaurant account is pending approval.";
                
                if (statusMessage === 'pending') {
                    friendlyMessage = "Your restaurant registration is under review. Please wait for approval.";
                } else if (statusMessage === 'rejected') {
                    friendlyMessage = "Your restaurant registration was rejected. Please contact support.";
                } else if (statusMessage === 'suspended') {
                    friendlyMessage = "Your restaurant account is suspended. Please contact support.";
                }
                
                return res.status(403).json({ 
                    error: friendlyMessage,
                    restaurantStatus: restaurant.status 
                });
            }
            
            payload.restaurantId = restaurant._id;
            userDetails.restaurantId = restaurant._id;

        } catch (error) {
            console.error("Error checking restaurant status:", error);
            if (error.response?.status === 404) {
                return res.status(404).json({ 
                    error: "Restaurant registration not found. Please register your restaurant first." 
                });
            }
            return res.status(500).json({ 
                error: "We're having trouble verifying your restaurant. Please try again later." 
            });
        }
    }

      const token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );

      res.json({
          token,
          user: userDetails,
      });
  } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({
          error: "Server error",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
});

// Authenticated Profile Route
router.get("/me", authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
}
);

// Update User
router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete User
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user role distribution
router.get("/user-role-distribution", async (req, res) => {
  try {
    const roleCounts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = roleCounts.map((r) => ({
      name: r._id.charAt(0).toUpperCase() + r._id.slice(1).replace(/_/g, " "),
      value: r.count,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching user role distribution:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user address
router.put('/update-address', authMiddleware(), async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    // Geocode the address using Google Maps API
    const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (!geocodeResponse.data.results.length) {
      return res.status(400).json({ error: "Could not geocode the address" });
    }

    const location = geocodeResponse.data.results[0].geometry.location;
    const formattedAddress = geocodeResponse.data.results[0].formatted_address;

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          address: formattedAddress,
          location: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
          }
        },
        { new: true }
    ).select('-password');

    res.json({
      message: "Address updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get User by ID (excluding password)
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get available delivery personnel within a radius
router.get("/delivery-personnel/available", async (req, res) => {
  try {
    // Extract query parameters
    const { longitude, latitude, radius = 5 } = req.query;
    
    // Validate required parameters
    if (!longitude || !latitude) {
      return res.status(400).json({ error: "Longitude and latitude are required" });
    }

    // Convert string parameters to numbers
    const long = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const searchRadius = parseFloat(radius);

    // Validate parameter formats
    if (isNaN(long) || isNaN(lat) || isNaN(searchRadius)) {
      return res.status(400).json({ error: "Invalid coordinate or radius format" });
    }

    // Find available delivery personnel within the specified radius
    const availableDrivers = await User.find({
      role: 'delivery_personnel',
      'deliveryPersonnelDetails.status': 'Available',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [long, lat]
          },
          $maxDistance: searchRadius * 1000 // Convert km to meters
        }
      }
    }).select("-password");

    res.json({
      count: availableDrivers.length,
      drivers: availableDrivers
    });

  } catch (error) {
    console.error("Error fetching available delivery personnel:", error);
    
    if (error.name === 'MongoError' && error.code === 16755) {
      return res.status(400).json({ error: "Location index not found. Make sure you have created a 2dsphere index on the location field." });
    }
    
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
