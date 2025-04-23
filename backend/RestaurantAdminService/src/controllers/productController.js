const Product = require('../models/Product');
const path = require('path'); // Add this line to import the path module

exports.createProduct = async (req, res) => {
  try {
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => {
        // Create URL-friendly path for database
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
      user: req.body.userId // Assuming userId is passed in the request body
    });
    
    const savedProduct = await product.save();
    console.log('Saved to DB:', savedProduct); // Debug saved document
    
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
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