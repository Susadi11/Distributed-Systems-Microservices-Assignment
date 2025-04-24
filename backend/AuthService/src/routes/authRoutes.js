const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, address, phone, deliveryPersonnelDetails } = req.body;
    console.log("Registration attempt:", { name, email, role });

    // Validate input
    if (!name || !email || !password || !address || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // If role is delivery_personnel, validate deliveryPersonnelDetails fields
    if (role === "delivery_personnel") {
      const requiredFields = ["vehicleType", "vehicleNumber", "Make", "Model", "year", "DriverLicense", "longitude", "latitude"];
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

    // Generate JWT token
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        longitude: user.longitude,
        latitude: user.latitude,
        address: user.address,
        phone: user.phone
      }
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

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { address },
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

module.exports = router;
