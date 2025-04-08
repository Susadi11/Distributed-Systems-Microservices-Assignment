import React from 'react';
import heroImage from '../../images/Hero.jpeg';
import { MapPinIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export function HeroSection() {
    return (
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center">
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-black/30 z-0"></div>
            <img
                src={heroImage}
                alt="Delicious food"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Content */}
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

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white rounded-full p-1 shadow-xl max-w-2xl mx-auto flex"
                >
                    <div className="flex items-center flex-grow px-4 py-2">
                        <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Enter your delivery address"
                            className="border-none outline-none flex-grow text-gray-800 placeholder-gray-400"
                        />
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition-colors">
                        <ArrowRightIcon className="h-6 w-6" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}