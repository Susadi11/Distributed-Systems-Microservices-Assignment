import React, { useState } from 'react';
import { Check, Gift, MapPin, Clock, ChevronDown, Info, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Checkout = () => {
    const [deliveryOption, setDeliveryOption] = useState('door');
    const [useUberOne, setUseUberOne] = useState(false);
    const [usePromotion, setUsePromotion] = useState(true);
    const [instructions, setInstructions] = useState('');

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

    // SLIIT Malabe Campus coordinates
    const position = [6.9147, 79.9730];
    const phoneNumber = '+94 71 415 1567';

    const total = orderSummary.subtotal - orderSummary.promotion +
        orderSummary.deliveryFee + orderSummary.serviceFee;

    return (
        <div className="min-h-screen bg-gray-50">
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
                                    <h3 className="font-semibold text-gray-900">SLIIT Main Building</h3>
                                    <p className="text-sm text-gray-600">
                                        Sri Lanka Institute of Information Technology, Malabe Campus
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">New Kandy Rd, Malabe</p>
                                    <button className="text-red-600 text-sm font-medium mt-2 flex items-center">
                                        Edit location <ChevronDown className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>

                            {/* Interactive Map */}
                            <div className="h-64 rounded-lg overflow-hidden border border-gray-200 mb-4">
                                <MapContainer
                                    center={position}
                                    zoom={16}
                                    style={{ height: '100%', width: '100%' }}
                                    zoomControl={false}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={position}>
                                        <Popup>
                                            SLIIT Main Building <br />
                                            Malabe Campus
                                        </Popup>
                                    </Marker>
                                </MapContainer>
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
                    <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>

                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="font-medium text-gray-900">{orderSummary.items[0].name}</p>
                                <p className="text-sm text-gray-600">{orderSummary.items[0].quantity} item</p>
                            </div>
                            <button className="text-red-600 text-sm font-medium flex items-center">
                                <Gift className="w-4 h-4 mr-1" /> Send as gift
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
                                <Info className="w-4 h-4 text-gray-400" />
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
                                <Info className="w-4 h-4 text-gray-400" />
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

                        {/* Place Order Button */}
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors">
                            Place order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;