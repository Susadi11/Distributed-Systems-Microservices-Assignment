import React, { useState, useEffect, useRef } from 'react';
import { Check, Gift, MapPin, Clock, ChevronDown, Info, ChevronRight, CreditCard } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// Make sure the token is set before any mapbox operations
mapboxgl.accessToken = MAPBOX_TOKEN;

const Checkout = () => {
    const [deliveryOption, setDeliveryOption] = useState('door');
    const [useUberOne, setUseUberOne] = useState(false);
    const [usePromotion, setUsePromotion] = useState(true);
    const [instructions, setInstructions] = useState('');
    const [showPaymentMethods, setShowPaymentMethods] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
    const [position, setPosition] = useState([79.9730, 6.9147]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [address, setAddress] = useState({
        name: 'SLIIT Main Building',
        description: 'Sri Lanka Institute of Information Technology, Malabe Campus',
        street: 'New Kandy Rd, Malabe'
    });
    const navigate = useNavigate();
    const mapContainer = useRef(null);
    const map = useRef(null);

    const orderSummary = {
        items: [
            { name: 'Barista Express', quantity: 1, price: 1250 }
        ],
        subtotal: 1250,
        promotion: 500,
        deliveryFee: 99,
        serviceFee: 62.50,
        uberOneSavings: 161.50
    };

    const phoneNumber = '+94 71 415 1567';

    const total = orderSummary.subtotal - orderSummary.promotion +
        orderSummary.deliveryFee + orderSummary.serviceFee;

    // Verify token is valid before initializing map
    useEffect(() => {
        if (!mapboxgl.accessToken || mapboxgl.accessToken === "pk.ey") {
            console.error("Invalid Mapbox token. Please provide a complete token.");
            setMapError(true);
            return;
        }

        // Continue with map initialization if token is valid
        if (map.current) return; // Initialize map only once

        try {
            if (mapContainer.current) {
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: position, // [lng, lat]
                    zoom: 15
                });

                // Add navigation controls
                map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

                // Create a marker
                const marker = new mapboxgl.Marker({ color: '#FF0000' })
                    .setLngLat(position)
                    .setPopup(new mapboxgl.Popup().setHTML(`<strong>${address.name}</strong><br>${address.description}`))
                    .addTo(map.current);

                // Try to get user location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const userLocation = [pos.coords.longitude, pos.coords.latitude];
                            setPosition(userLocation);
                            map.current.flyTo({
                                center: userLocation,
                                zoom: 16,
                                essential: true
                            });
                            marker.setLngLat(userLocation);
                        },
                        (error) => {
                            console.error("Location access denied or not available:", error);
                        }
                    );
                }

                map.current.on('load', () => {
                    setMapLoaded(true);
                });

                map.current.on('error', (e) => {
                    console.error("Mapbox error:", e);
                    setMapError(true);
                });
            }
        } catch (error) {
            console.error("Error initializing Mapbox:", error);
            setMapError(true);
        }
    }, []);

    // Update marker position when position changes
    useEffect(() => {
        if (map.current && mapLoaded && !mapError) {
            try {
                // Remove previous markers
                const markers = document.getElementsByClassName('mapboxgl-marker');
                if (markers.length > 0) {
                    Array.from(markers).forEach(marker => marker.remove());
                }

                // Add new marker
                new mapboxgl.Marker({ color: '#FF0000' })
                    .setLngLat(position)
                    .setPopup(new mapboxgl.Popup().setHTML(`<strong>${address.name}</strong><br>${address.description}`))
                    .addTo(map.current);
            } catch (error) {
                console.error("Error updating marker:", error);
            }
        }
    }, [position, mapLoaded, address, mapError]);

    return (
        <div className="min-h-screen bg-gray-50 pt-16"> {/* Added pt-16 for navbar space */}
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Delivery Information */}
                    <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-sm">
                        {/* Enhanced Location Section with Map */}
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
                                    <button className="text-red-600 text-sm font-medium mt-2 flex items-center">
                                        Edit location <ChevronDown className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Interactive Map with Mapbox */}
                            <div className="h-64 rounded-lg overflow-hidden border border-gray-200 mb-4 relative" style={{ zIndex: 0 }}>
                                {/* Error state for map */}
                                {mapError && (
                                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center flex-col p-4">
                                        <p className="text-red-600 font-medium mb-2">Unable to load map</p>
                                        <p className="text-sm text-center text-gray-600">Please check your Mapbox token configuration</p>
                                    </div>
                                )}

                                {/* Loading state */}
                                {!mapLoaded && !mapError && (
                                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                        <p>Loading map...</p>
                                    </div>
                                )}

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
                                            <span className="font-medium block">Meet in lobby</span>
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
                    <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-20" style={{ zIndex: 0 }}> {/* Added z-index to prevent navbar overlap */}
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>

                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="font-medium text-gray-900">{orderSummary.items[0].name}</p>
                                <p className="text-sm text-gray-600">{orderSummary.items[0].quantity} item</p>
                            </div>
                            <button className="text-red-600 text-sm font-medium flex items-center">
                                <Gift className="w-4 h-4 mr-1"/> Send as gift
                            </button>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900">LKR {orderSummary.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Promotion</span>
                                <span className="text-red-600">- LKR {orderSummary.promotion.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery fee</span>
                                <span className="text-gray-900">LKR {orderSummary.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Service fee</span>
                                <span className="text-gray-900">LKR {orderSummary.serviceFee.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Promotions */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="uber-one"
                                        checked={useUberOne}
                                        onChange={() => setUseUberOne(!useUberOne)}
                                        className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                    />
                                    <label htmlFor="uber-one" className="ml-2 text-sm text-gray-900">
                                        Save LKR {orderSummary.uberOneSavings.toFixed(2)} with Uber One
                                    </label>
                                </div>
                                <Info className="w-4 h-4 text-gray-400"/>
                            </div>
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
                                        Saving LKR {orderSummary.promotion.toFixed(2)} with promotions
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
                                    {usePromotion && (
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
                            onClick={() => navigate('/pending')}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors"
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