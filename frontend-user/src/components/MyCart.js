import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MyCart = () => {
    const { cart, loading, error, updateQuantity, removeFromCart, fetchCart } = useCart();
    const { user } = useAuth();
    const [specialNotes, setSpecialNotes] = useState('');

    // Fetch cart data when component mounts or user changes
    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]);

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        await updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = async (productId) => {
        await removeFromCart(productId);
    };

    if (loading && !cart) {
        return (
            <div className="min-h-screen bg-white py-28 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white py-28 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Error loading your cart: {error}</p>
                    <button
                        onClick={fetchCart}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Calculate subtotal
    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

    // Calculate delivery fee based on subtotal
    const calculateDeliveryFee = (amount) => {
        if (amount <= 500) {
            return 100;
        } else {
            return 100 + (0.1 * amount);
        }
    };

    const deliveryFee = calculateDeliveryFee(subtotal);
    const serviceFee = 150;
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const total = subtotal + deliveryFee + serviceFee + taxAmount;

    return (
        <div className="min-h-screen bg-white py-28">
            {/* Cart Content */}
            <div className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Cart Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Your Items
                        </h2>
                        {cart?.items?.length > 0 && (
                            <Link
                                to="/menu"
                                className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">Add Items</span>
                            </Link>
                        )}
                    </div>
                    {!cart?.items?.length ? (
                        <div className="text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-600 mb-4">Your cart is empty.</p>
                            <Link
                                to="/menu"
                                className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Browse Menu
                            </Link>
                        </div>
                    ) : (
                        <>
                            <ul className="space-y-4">
                                {cart.items.map((item) => (
                                    <li
                                        key={item.productId}
                                        className="flex items-center border-b py-4 last:border-b-0"
                                    >
                                        <div
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                                            <img
                                                src={
                                                    item.image && item.image.startsWith('data:image')
                                                        ? item.image  // Already formatted base64
                                                        : item.image && item.image.startsWith('http')
                                                            ? item.image  // Already formatted URL
                                                            : '/default-food.png'  // Fallback
                                                }
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/default-food.png';
                                                }}
                                            />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-md font-semibold text-gray-800 line-clamp-1">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 line-clamp-1">
                                                        {item.description || 'No description available'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {item.restaurant?.name || 'Restaurant'} - {item.category || 'Category'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                                    aria-label={`Remove ${item.name}`}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="mt-2 flex justify-between items-center">
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(item.productId, item.quantity - 1)
                                                        }
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                        aria-label={`Decrease quantity of ${item.name}`}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-3 py-1 text-gray-800 font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(item.productId, item.quantity + 1)
                                                        }
                                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                        aria-label={`Increase quantity of ${item.name}`}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-gray-800 font-semibold">
                                                    Rs {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {/* Right Side: Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Order Summary
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>Rs {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span>Rs {deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Service Fee</span>
                            <span>Rs {serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (8%)</span>
                            <span>Rs {taxAmount.toFixed(2)}</span>
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>Rs {total.toFixed(2)}</span>
                        </div>

                        {/* Special Notes Textarea */}
                        <div className="mt-4">
                            <label htmlFor="special-notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Special Instructions (Allergies, Requests, etc.)
                            </label>
                            <textarea
                                id="special-notes"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                                placeholder="e.g. No peanuts, Extra spicy, Leave at door..."
                                value={specialNotes}
                                onChange={(e) => setSpecialNotes(e.target.value)}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Please mention any dietary restrictions or special requests.
                            </p>
                        </div>

                        <Link to="/checkout">
                            <button
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md mt-6 transition-colors"
                                disabled={!cart?.items?.length}
                            >
                                Proceed to Checkout
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCart;