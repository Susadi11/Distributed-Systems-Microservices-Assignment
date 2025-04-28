import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5559/cart');
            setCart(response.data.cart);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            if (err.response?.status === 404) {
                setCart({ user: user.id, items: [] });
            }
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (item) => {
        try {
            setLoading(true);

            // Extract the image properly
            let imageData = '';
            if (item.images && item.images.length > 0) {
                // Handle base64 data from database object
                if (item.images[0].data) {
                    imageData = `data:${item.images[0].contentType};base64,${item.images[0].data}`;
                }
                // Handle string images (direct URLs or base64 strings)
                else if (typeof item.images[0] === 'string') {
                    if (item.images[0].startsWith('data:image')) {
                        imageData = item.images[0]; // Already formatted base64
                    } else {
                        imageData = `http://localhost:5556${item.images[0]}`; // Local path
                    }
                }
            }

            const payload = {
                productId: item._id || item.productId,
                restaurantId: item.restaurantId || item.restaurant?._id || item.restaurant,
                quantity: item.quantity || 1,
                // Additional fields for display purposes
                price: item.price,
                name: item.productName || item.name,
                image: imageData || '/default-product.png'
            };

            const response = await axios.post('http://localhost:5559/cart/add', payload);
            setCart(response.data.cart);
            return { success: true, cart: response.data.cart };
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add to cart');
            console.error('Add to cart error:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            setLoading(true);
            const response = await axios.put('http://localhost:5559/cart/update', {
                productId,
                quantity: newQuantity
            });

            setCart(response.data.cart);
            return { success: true, cart: response.data.cart };
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update quantity');
            console.error('Update quantity error:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            setLoading(true);
            const response = await axios.delete(`http://localhost:5559/cart/remove/${productId}`);
            setCart(response.data.cart);
            return { success: true, cart: response.data.cart };
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to remove item');
            console.error('Remove from cart error:', err);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            setError(null);

            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('Authentication token not found');
            }

            const response = await axios.delete('http://localhost:5559/cart/clear', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Reset local cart state
            setCart({ user: user?.id, items: [] });
            return { success: true, message: 'Cart cleared successfully' };
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to clear cart';
            setError(errorMsg);
            console.error('Clear cart error:', err);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const getItemQuantity = (productId) => {
        if (!cart || !cart.items) return 0;
        const item = cart.items.find(item =>
            item.productId === productId || item.productId?._id === productId
        );
        return item ? item.quantity : 0;
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            error,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            getItemQuantity,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};