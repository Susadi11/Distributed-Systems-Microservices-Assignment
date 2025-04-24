import React, { useState } from 'react';
import heroImage from '../../images/Hero.jpeg';
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useAuth } from '../../AuthContext';

export function HeroSection() {
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [localError, setLocalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { user, updateAddress, loading } = useAuth();

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');

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

    return (
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 z-0"></div>
            <img
                src={heroImage}
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
                    className="bg-white rounded-full p-1 shadow-xl max-w-2xl mx-auto flex"
                >
                    <form onSubmit={handleAddressSubmit} className="flex w-full">
                        <div className="flex items-center flex-grow px-4 py-2">
                            <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <input
                                type="text"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder={user?.address || "Enter your delivery address"}
                                className="border-none outline-none flex-grow text-gray-800 placeholder-gray-400"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors disabled:bg-red-400"
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