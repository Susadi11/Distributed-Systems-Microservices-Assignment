import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Check, Gift, MapPin, Clock, ChevronDown, Info, ChevronRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Initialize Mapbox
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Checkout = () => {
    const { user } = useAuth();
    const { cart, loading, error, fetchCart } = useCart();
    const [deliveryOption, setDeliveryOption] = useState('door');
    const [useUberOne, setUseUberOne] = useState(false);
    const [usePromotion, setUsePromotion] = useState(true);
    const [instructions, setInstructions] = useState('');
    const [showPaymentMethods, setShowPaymentMethods] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);

    // Default to SLIIT coordinates if no user location
    const [position, setPosition] = useState(
        user?.location?.coordinates
            ? [user.location.coordinates[0], user.location.coordinates[1]] // [lng, lat]
            : [79.9730, 6.9147]
    );

    const [address, setAddress] = useState({
        name: user?.address ? 'Your Address' : 'SLIIT Main Building',
        description: user?.address || 'Sri Lanka Institute of Information Technology, Malabe Campus',
        street: user?.address?.split(',')[0] || 'New Kandy Rd, Malabe'
    });

    const navigate = useNavigate();

    // Calculate delivery fee based on subtotal
    const calculateDeliveryFee = (subtotal) => {
        const baseFee = 100; // Base delivery fee
        if (subtotal <= 500) {
            return baseFee;
        } else {
            // 10% of subtotal above 500, added to base fee
            return baseFee + (0.1 * (subtotal - 500));
        }
    };

    // Calculate order summary from cart
    const calculateOrderSummary = () => {
        if (!cart || !cart.items) {
            return {
                items: [],
                subtotal: 0,
                tax: 0,
                promotion: 0,
                deliveryFee: 0,
                serviceFee: 150.00,
                uberOneSavings: 0
            };
        }

        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; // 8% tax
        const promotion = usePromotion ? Math.min(500, subtotal * 0.1) : 0; // 10% off up to 500
        const deliveryFee = calculateDeliveryFee(subtotal);

        return {
            items: cart.items,
            subtotal,
            tax,
            promotion,
            deliveryFee,
            serviceFee: 150.00,
            uberOneSavings: useUberOne ? 161.50 : 0
        };
    };

    // Fetch cart data when component mounts
    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user, fetchCart]);

    // Initialize map when component mounts
    useEffect(() => {
        if (!mapboxgl.accessToken) {
            console.error("Mapbox token not configured");
            return;
        }

        if (map.current) return; // Initialize map only once

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: position,
            zoom: 15
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Create initial marker
        marker.current = new mapboxgl.Marker({ color: '#FF0000' })
            .setLngLat(position)
            .setPopup(new mapboxgl.Popup().setHTML(`<strong>${address.name}</strong><br>${address.description}`))
            .addTo(map.current);

        // Cleanup on unmount
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Update marker and map when position changes
    useEffect(() => {
        if (map.current && marker.current) {
            marker.current.setLngLat(position);
            map.current.flyTo({
                center: position,
                essential: true
            });

            // Update popup content
            const popup = new mapboxgl.Popup().setHTML(`<strong>${address.name}</strong><br>${address.description}`);
            marker.current.setPopup(popup);
        }
    }, [position, address]);

    // Update position when user data changes
    useEffect(() => {
        if (user?.location?.coordinates) {
            setPosition([user.location.coordinates[0], user.location.coordinates[1]]);
            if (user.address) {
                setAddress({
                    name: 'Your Address',
                    description: user.address,
                    street: user.address.split(',')[0] || user.address
                });
            }
        }
    }, [user]);

    // Redirect to cart if it's empty
    useEffect(() => {
        if (cart && cart.items && cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const orderSummary = calculateOrderSummary();
    const phoneNumber = user?.phone || '+94 71 415 1567';

    const total = orderSummary.subtotal + orderSummary.tax - orderSummary.promotion +
        orderSummary.deliveryFee + orderSummary.serviceFee - orderSummary.uberOneSavings;

    // Loading state
    if (loading && !cart) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
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

    const handlePlaceOrder = () => {
        // Here you would handle the order submission
        navigate('/pending');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Delivery Information */}
                    <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-sm">
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>

                            <div className="flex items-start gap-3 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <MapPin className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{address.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {address.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{address.street}</p>
                                    <button
                                        className="text-red-600 text-sm font-medium mt-2 flex items-center"
                                        onClick={() => navigate('/update-address')}
                                    >
                                        Edit location <ChevronDown className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Mapbox Map Container */}
                            <div className="h-64 rounded-lg overflow-hidden border border-gray-200 mb-4">
                                <div ref={mapContainer} className="h-full w-full" />
                            </div>
                        </div>

                        {/* Delivery Options */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery options</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={() => setDeliveryOption('door')}
                                    className={`p-4 border rounded-lg text-left ${deliveryOption === 'door' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                >
                                    <div className="flex items-center">
                                        {deliveryOption === 'door' && (
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium block">Meet at my door</span>
                                            <p className="text-sm text-gray-600 mt-1">Add delivery instructions</p>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setDeliveryOption('lobby')}
                                    className={`p-4 border rounded-lg text-left ${deliveryOption === 'lobby' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                >
                                    <div className="flex items-center">
                                        {deliveryOption === 'lobby' && (
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-medium block">Meet at Outside</span>
                                            <p className="text-sm text-gray-600 mt-1">Building reception</p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {deliveryOption && (
                                <div className="mt-4">
                                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                                        Delivery instructions
                                    </label>
                                    <textarea
                                        id="instructions"
                                        placeholder="e.g. Call when you arrive, leave at security desk"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        rows={3}
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                    />
                                    <p className="text-base font-medium text-gray-700 mt-2">{phoneNumber}</p>
                                </div>
                            )}
                        </div>

                        {/* Delivery Time */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                    <div>
                                        <h3 className="font-medium text-gray-900">Delivery time</h3>
                                        <p className="text-sm text-gray-600">25-35 min</p>
                                    </div>
                                </div>
                                <button className="text-blue-600 text-sm font-medium">Change</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-20">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>

                        {orderSummary.items.length > 0 && (
                            <div className="mb-6">
                                <div className="space-y-3">
                                    {orderSummary.items.map((item) => (
                                        <div key={item.productId} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-gray-800 font-medium">{item.quantity}x</span>
                                                <span className="text-gray-800 ml-2">{item.name}</span>
                                            </div>
                                            <span className="text-gray-800">LKR {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <button
                                        className="text-red-600 text-sm font-medium flex items-center"
                                        onClick={() => navigate('/cart')}
                                    >
                                        Edit items
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900">LKR {orderSummary.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (8%)</span>
                                <span className="text-gray-900">LKR {orderSummary.tax.toFixed(2)}</span>
                            </div>
                            {orderSummary.promotion > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Promotion</span>
                                    <span className="text-red-600">- LKR {orderSummary.promotion.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery fee</span>
                                <span className="text-gray-900">LKR {orderSummary.deliveryFee.toFixed(2)}</span>
                                {orderSummary.subtotal > 500 && (
                                    <span className="text-xs text-gray-500">(Base 100 + 10% of LKR {orderSummary.subtotal - 500})</span>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Service fee</span>
                                <span className="text-gray-900">LKR {orderSummary.serviceFee.toFixed(2)}</span>
                            </div>
                            {orderSummary.uberOneSavings > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Uber One savings</span>
                                    <span className="text-green-600">- LKR {orderSummary.uberOneSavings.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        {/* Promotions */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="promotion"
                                        checked={usePromotion}
                                        onChange={() => setUsePromotion(!usePromotion)}
                                        className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                    />
                                    <label htmlFor="promotion" className="ml-2 text-sm text-gray-900">
                                        Save LKR {calculateOrderSummary().promotion.toFixed(2)} with promotions
                                    </label>
                                </div>
                                <Info className="w-4 h-4 text-gray-400"/>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-200 pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Total</span>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-gray-900">LKR {total.toFixed(2)}</p>
                                    {usePromotion && orderSummary.promotion > 0 && (
                                        <p className="text-sm text-gray-500 line-through">LKR {(total + orderSummary.promotion).toFixed(2)}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <div className="mb-6 border-t border-gray-200 pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment method</h3>

                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowPaymentMethods(!showPaymentMethods)}
                                    className="w-full flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center">
                                        {selectedPaymentMethod === 'cash' ? (
                                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                                <Check className="w-4 h-4 text-red-600"/>
                                            </div>
                                        ) : (
                                            <CreditCard className="w-6 h-6 text-gray-500 mr-3"/>
                                        )}
                                        <span className="font-medium">
                                          {selectedPaymentMethod === 'cash' ? 'Cash' : 'Credit/Debit Card'}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400"/>
                                </button>

                                {showPaymentMethods && (
                                    <div className="space-y-2 mt-2">
                                        <button
                                            onClick={() => {
                                                setSelectedPaymentMethod('cash');
                                                setShowPaymentMethods(false);
                                            }}
                                            className={`w-full text-left p-4 border rounded-lg flex items-center ${selectedPaymentMethod === 'cash' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                        >
                                            {selectedPaymentMethod === 'cash' && (
                                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                                    <Check className="w-3 h-3 text-white"/>
                                                </div>
                                            )}
                                            <span>Cash</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate('/select-payment');
                                            }}
                                            className={`w-full text-left p-4 border rounded-lg flex items-center ${selectedPaymentMethod === 'card' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                                        >
                                            {selectedPaymentMethod === 'card' && (
                                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                                    <Check className="w-3 h-3 text-white"/>
                                                </div>
                                            )}
                                            <span>Credit/Debit Card</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors"
                            disabled={orderSummary.items.length === 0}
                        >
                            Place order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;