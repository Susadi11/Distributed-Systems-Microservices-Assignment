const axios = require('axios');
const Cart = require('../models/Cart');

// Configure services URLs
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:5558';
const RESTAURANT_ADMIN_SERVICE_URL = process.env.RESTAURANT_ADMIN_SERVICE_URL || 'http://localhost:5556';

exports.addToCart = async (req, res) => {
    try {
        const { productId, restaurantId, quantity = 1 } = req.body;
        const userId = req.user.id;

        if (!productId || !restaurantId) {
            return res.status(400).json({ success: false, error: 'Both productId and restaurantId are required' });
        }

        let product;
        try {
            const response = await axios.get(`${RESTAURANT_ADMIN_SERVICE_URL}/api/products/${productId}`);
            if (response.data && response.data._id) {
                product = response.data;
            } else if (response.data && response.data.data) {
                product = response.data.data;
            } else {
                const menuResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/restaurants/${restaurantId}/menu`);
                product = menuResponse.data.data.find(p => p._id === productId);
                if (!product) {
                    return res.status(404).json({ success: false, error: 'Product not found in restaurant menu' });
                }
            }
        } catch (err) {
            console.error('Product Fetch Error:', {
                message: err.message,
                url: err.config?.url,
                status: err.response?.status,
                data: err.response?.data
            });

            if (err.response?.status === 404) {
                return res.status(404).json({ success: false, error: 'Product not found' });
            }

            return res.status(503).json({
                success: false,
                error: 'Failed to connect to restaurant services',
                details: process.env.NODE_ENV === 'development' ? {
                    adminService: RESTAURANT_ADMIN_SERVICE_URL,
                    mainService: RESTAURANT_SERVICE_URL,
                    error: err.message
                } : undefined
            });
        }

        if (!product.price || !product.productName) {
            console.error('Invalid product data received:', product);
            return res.status(502).json({ success: false, error: 'Invalid product data received from service' });
        }

        const cartItem = {
            productId: product._id,
            quantity: quantity,
            price: product.price,
            name: product.productName,
            image: product.images?.[0]?.data
                ? `data:${product.images[0].contentType};base64,${product.images[0].data}`
                : typeof product.images?.[0] === 'string'
                    ? product.images[0].startsWith('data:image')
                        ? product.images[0]
                        : `http://localhost:5556${product.images[0]}`
                    : '/default-product.png',
            restaurant: product.restaurant || restaurantId
        };

        let cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId, items: [] });

        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId.toString()
        );

        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push(cartItem);
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart: {
                _id: cart._id,
                user: cart.user,
                items: cart.items,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt
            }
        });

    } catch (err) {
        console.error('Add to Cart Error:', err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });

        return res.status(200).json({
            success: true,
            cart: cart || {
                user: req.user.id,
                items: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    } catch (err) {
        console.error('Get Cart Error:', err);
        return res.status(500).json({ success: false, error: 'Failed to fetch cart' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ success: false, error: 'Both productId and quantity are required' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId.toString()
        );

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, error: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = Math.max(1, quantity);

        await cart.save();

        return res.status(200).json({ success: true, message: 'Cart item updated', cart: cart });

    } catch (err) {
        console.error('Update cart error:', err);
        return res.status(500).json({ success: false, error: 'Failed to update cart item' });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ success: false, error: 'Product ID is required' });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId.toString()
        );

        await cart.save();

        return res.status(200).json({ success: true, message: 'Item removed from cart', cart: cart });

    } catch (err) {
        console.error('Remove from cart error:', err);
        return res.status(500).json({ success: false, error: 'Failed to remove item from cart' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }

        return res.status(200).json({ success: true, message: 'Cart cleared successfully', cart });

    } catch (err) {
        console.error('Clear cart error:', err);
        return res.status(500).json({ success: false, error: 'Failed to clear cart' });
    }
};
