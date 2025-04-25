import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import food1 from '../images/food1.jpeg';
import food4 from '../images/food4.jpeg';
import food6 from '../images/food6.jpeg';

const MyCart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Special Chinese Fried Rice',
            price: 1650,
            quantity: 1,
            image: food1,
            description: 'With chicken, pork, prawns, sausages, cuttlefish and eggs',
            foodCategory: 'Main Course',
            restaurant: 'Golden Wok',
            prepTime: '20-25 min',
        },
        {
            id: 2,
            name: 'Chicken Cheese Kottu',
            price: 1100,
            quantity: 2,
            image: food4,
            description: 'Chopped roti with chicken and melted cheese',
            foodCategory: 'Street Food',
            restaurant: 'Kottu House',
            prepTime: '15-20 min',
        },
        {
            id: 3,
            name: 'Fresh Lime Juice',
            price: 250,
            quantity: 1,
            image: food6,
            description: 'Freshly squeezed lime with sugar and mint',
            foodCategory: 'Beverage',
            restaurant: 'Juice Bar',
            prepTime: '5-10 min',
        },
    ]);

    const [specialNotes, setSpecialNotes] = useState('');

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const deliveryFee = 250;
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
                        {cartItems.length > 0 && (
                            <Link
                                to="/menu"
                                className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">Add Items</span>
                            </Link>
                        )}
                    </div>
                    {cartItems.length === 0 ? (
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
                                {cartItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center border-b py-4 last:border-b-0"
                                    >
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-md font-semibold text-gray-800 line-clamp-1">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 line-clamp-1">
                                                        {item.description}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {item.restaurant} - {item.foodCategory}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
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
                                                            updateQuantity(item.id, item.quantity - 1)
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
                                                            updateQuantity(item.id, item.quantity + 1)
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
                            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md mt-6 transition-colors">
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