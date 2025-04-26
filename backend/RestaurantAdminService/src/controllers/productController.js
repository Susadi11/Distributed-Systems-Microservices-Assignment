const Product = require('../models/Product');
const path = require('path'); // Add this line to import the path module
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
  try {
    // Extract user and restaurant IDs from the authenticated request
    const { userId, restaurantId } = req.user;
    
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => {
        return `/uploads/${path.basename(file.path)}`;
      });
    }
    
    const product = new Product({
      productName: req.body.productName,
      category: req.body.category,
      currency: req.body.currency || 'USD',
      quantity: Number(req.body.quantity),
      price: Number(req.body.price),
      description: req.body.description || '',
      status: req.body.status || 'available',
      discount: req.body.discount === 'true' || req.body.discount === true,
      images: imagePaths,
      restaurant: restaurantId, // This will come from the token
      user: userId // This will come from the token
    });
    
    const savedProduct = await product.save();
    console.log('Saved to DB:', savedProduct);
    
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: err.message });
  }
};
// In your productController.js
exports.getAllProducts = async (req, res) => {
  try {
    console.log('User from token:', req.user); // Debug logging
    
    if (!req.user?.restaurantId) {
      console.error('No restaurantId in user token');
      return res.status(400).json({ error: "Restaurant ID is required" });
    }
    
    console.log('Looking for products with restaurant ID:', req.user.restaurantId);
    
    // This should be "restaurant", not "restaurantId"
    const products = await Product.find({ restaurant: req.user.restaurantId });
    
    console.log('Found products:', products.length); // Debug logging
    console.log('First product (if any):', products[0]); // See structure of first product
    
    res.status(200).json(products);
  } catch (err) {
    console.error('Error in getAllProducts:', err);
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//for menu
exports.getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Validate restaurantId format (optional but recommended)
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid restaurant ID format'
      });
    }

    // Find available products for this restaurant
    const products = await Product.find({
      restaurant: restaurantId,
      status: 'available'
    }).populate('restaurant', 'name'); // Optional: Include basic restaurant info

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (err) {
    console.error('Error fetching restaurant products:', err);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching menu',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};