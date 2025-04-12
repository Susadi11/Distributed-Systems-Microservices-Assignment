const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path as necessary

const router = express.Router();

// backend/AuthService/src/routes/authRoutes.js
router.post("/register", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      console.log('Registration attempt:', { name, email, role });
  
      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const newUser = await User.create({ 
        name, 
        email, 
        password: hashedPassword, 
        role: role || 'customer' 
      });
  
      // Generate token
      const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      console.log('User created successfully:', newUser);
      res.status(201).json({ 
        message: "User registered successfully",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
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
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const user = await User.findOne({ email }).select('+password');
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
  
      // Don't send password back
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
  
      res.json({ 
        token, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
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
// Add this to your authRoutes.js
router.get('/me', authMiddleware(), async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });


module.exports = router;
