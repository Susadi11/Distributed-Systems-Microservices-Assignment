import React, { useState, useRef, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useAuth } from '../../AuthContext';

const libraries = ['places'];

export function HeroSection() {
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { user, updateAddress, loading } = useAuth();
    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');
        setShowSuggestions(false);

        if (!deliveryAddress.trim()) {
            setLocalError('Please enter a valid delivery address');
            return;
        }

        try {
            await updateAddress(deliveryAddress);
            setSuccessMessage('Delivery address updated successfully!');
            setDeliveryAddress('');
        } catch (error) {
            setLocalError(error.message || 'Failed to update address');
        }
    };

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.formatted_address) {
                setDeliveryAddress(place.formatted_address);
                setShowSuggestions(false);
            }
        }
    };

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setDeliveryAddress(value);

        if (value.length > 2 && isLoaded) {
            try {
                const service = new window.google.maps.places.AutocompleteService();
                service.getPlacePredictions(
                    {
                        input: value,
                        componentRestrictions: { country: 'lk' },
                        types: ['address']
                    },
                    (predictions, status) => {
                        if (status === 'OK' && predictions) {
                            setPredictions(predictions);
                            setShowSuggestions(true);
                        } else {
                            setPredictions([]);
                            setShowSuggestions(false);
                        }
                    }
                );
            } catch (error) {
                console.error('Error fetching predictions:', error);
            }
        } else {
            setPredictions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (prediction) => {
        setDeliveryAddress(prediction.description);
        setShowSuggestions(false);
    };

    return (
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 z-0"></div>
            <img
                src={require('../../images/Hero.jpeg')}
                alt="Delicious food"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        <span className="text-red-400">Craving</span> something delicious?
                    </h1>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Order from your favorite restaurants and get lightning-fast delivery
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white rounded-full p-1 shadow-xl max-w-2xl mx-auto flex relative"
                >
                    <form onSubmit={handleAddressSubmit} className="flex w-full">
                        <div className="flex items-center flex-grow px-4 py-2 relative">
                            <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                            {isLoaded ? (
                                <>
                                    <Autocomplete
                                        onLoad={onLoad}
                                        onPlaceChanged={onPlaceChanged}
                                        options={{
                                            types: ['address'],
                                            componentRestrictions: { country: 'lk' },
                                            fields: ['formatted_address', 'geometry']
                                        }}
                                    >
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={deliveryAddress}
                                            onChange={handleInputChange}
                                            onFocus={() => deliveryAddress.length > 2 && setShowSuggestions(true)}
                                            placeholder={user?.address || "Enter your delivery address"}
                                            className="border-none outline-none flex-grow text-gray-800 placeholder-gray-400"
                                            aria-label="Delivery address"
                                        />
                                    </Autocomplete>
                                    {showSuggestions && predictions.length > 0 && (
                                        <div
                                            ref={suggestionsRef}
                                            className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                                        >
                                            {predictions.map((prediction, index) => (
                                                <div
                                                    key={prediction.place_id}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
                                                    onClick={() => handleSuggestionClick(prediction)}
                                                >
                                                    <p className="font-medium">{prediction.structured_formatting.main_text}</p>
                                                    <p className="text-sm text-gray-600">{prediction.structured_formatting.secondary_text}</p>
                                                    {index < predictions.length - 1 && (
                                                        <div className="border-t border-gray-200 my-1"></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <input
                                    type="text"
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    placeholder={user?.address || "Enter your delivery address"}
                                    className="border-none outline-none flex-grow text-gray-800 placeholder-gray-400"
                                    aria-label="Delivery address"
                                />
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors disabled:bg-red-400"
                            aria-label="Submit address"
                        >
                            {loading ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <ArrowRightIcon className="h-6 w-6" />
                            )}
                        </button>
                    </form>
                </motion.div>

                {localError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto"
                    >
                        {localError}
                    </motion.div>
                )}
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded max-w-2xl mx-auto"
                    >
                        {successMessage}
                    </motion.div>
                )}
            </div>
        </section>
    );
}