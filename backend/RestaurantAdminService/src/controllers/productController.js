const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
  try {
    // Extract user and restaurant IDs from the authenticated request
    const { userId, restaurantId } = req.user;

    // Extract base64 images from request
    let images = [];
    if (req.body.images && Array.isArray(req.body.images)) {
      images = req.body.images.map(img => ({
        contentType: img.contentType,
        data: img.data,
        name: img.name
      }));
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
      images: images,
      restaurant: restaurantId,
      user: userId // Include the userId here
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
    }).populate('restaurant', 'name');

    // Ensure proper formatting of base64 images for frontend
    const formattedProducts = products.map(product => {
      const productObj = product.toObject();

      // If there are images with data field, ensure they're properly formatted
      if (productObj.images && productObj.images.length > 0) {
        // Keep the original format which will be properly handled by the frontend
      }

      return productObj;
    });

    res.json({
      success: true,
      count: formattedProducts.length,
      data: formattedProducts
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