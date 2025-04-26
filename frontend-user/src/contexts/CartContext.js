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
            const response = await axios.post('http://localhost:5559/cart/add', {
                productId: item._id || item.productId,
                quantity: 1,
                price: item.price,
                name: item.productName || item.name,
                image: item.images?.[0] || '',
                restaurant: item.restaurant
            });

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
            await axios.delete('http://localhost:5559/cart/clear');
            setCart({ user: user?.id, items: [] });
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to clear cart');
            console.error('Clear cart error:', err);
            return { success: false, error: err.message };
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