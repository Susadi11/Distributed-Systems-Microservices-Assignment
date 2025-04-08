import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Plus, Minus } from 'lucide-react';
import food1 from '../images/food1.jpeg'
import food4 from '../images/food4.jpeg'
import food6 from '../images/food6.jpeg'

const MyCart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Special Chinese Fried Rice',
            price: 1650,
            quantity: 1,
            image: food1,
            description: 'With chicken, pork, prawns, sausages, cuttlefish and eggs'
        },
        {
            id: 2,
            name: 'Chicken Cheese Kottu',
            price: 1100,
            quantity: 2,
            image: food4,
            description: 'Chopped roti with chicken and melted cheese'
        },
        {
            id: 3,
            name: 'Fresh Lime Juice',
            price: 250,
            quantity: 1,
            image: food6,
            description: 'Freshly squeezed lime with sugar and mint'
        }
    ]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 250;
    const serviceFee = 150;
    const total = subtotal + deliveryFee + serviceFee;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10 px-4 sm:px-6">
                <div className="container mx-auto py-4">
                    <div className="flex items-center justify-between">
                        <button className="flex items-center text-gray-700 hover:text-gray-900">
                            <ChevronLeft className="w-6 h-6 mr-1" />
                            <span className="font-medium hidden sm:inline">Back to Menu</span>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center">
                            <ShoppingCart className="w-5 h-5 mr-2 text-red-600" />
                            My Cart ({cartItems.length})
                        </h1>
                        <div className="w-6"></div>
                    </div>
                </div>
            </div>

            {/* Cart Content */}
            <div className="container mx-auto px-4 sm:px-6 py-6">
                {cartItems.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart feels lonely</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Your favorite dishes are waiting. Start adding some delicious items to your cart!
                        </p>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md">
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="space-y-4 mb-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 flex transition-all hover:shadow-sm">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                                        <img
                                            src={`../../images/${item.image}.jpeg`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="mt-auto flex justify-between items-center">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-2 sm:px-3 py-1 text-gray-900 font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <span className="font-semibold text-gray-900">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                                    <span className="text-gray-900">LKR {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="text-gray-900">LKR {deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service Fee</span>
                                    <span className="text-gray-900">LKR {serviceFee.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-gray-200 my-3"></div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-lg text-gray-900">Total</span>
                                    <span className="font-bold text-lg text-red-600">LKR {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button - Sticky on Mobile */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg sm:static sm:shadow-none px-4 sm:px-0 py-3 sm:py-0">
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-md transition-colors sm:rounded-lg">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyCart;