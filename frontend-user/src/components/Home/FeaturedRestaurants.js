import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import res1 from '../../images/res1.jpeg';
import res2 from '../../images/res2.jpeg';
import res3 from '../../images/res3.jpeg';

const restaurants = [
    {
        id: 1,
        name: 'Asian Hotel',
        cuisine: 'Chinese • Sri Lankan',
        deliveryFee: 150,
        rating: 4.5,
        time: '15-25 min',
        image: res1
    },
    {
        id: 2,
        name: 'Herali',
        cuisine: 'Sri Lankan • Fast Food',
        deliveryFee: 200,
        rating: 4.7,
        time: '20-30 min',
        image: res2
    },
    {
        id: 3,
        name: 'Anohana',
        cuisine: 'Japanese • Sushi',
        deliveryFee: 250,
        rating: 4.8,
        time: '25-35 min',
        image: res3
    }
];

export function FeaturedRestaurants() {
    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0"
                    >
                        Featured Restaurants
                    </motion.h2>
                    <motion.a
                        whileHover={{ x: 5 }}
                        href="/restaurants"
                        className="flex items-center text-red-600 hover:text-red-800 font-medium"
                    >
                        View all <FaArrowRight className="ml-2" />
                    </motion.a>
                </div>

                {/* Restaurant Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant, index) => (
                        <motion.div
                            key={restaurant.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                        >
                            <div className="relative h-48">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <h3 className="text-xl font-bold text-white">{restaurant.name}</h3>
                                    <p className="text-white/90 text-sm">{restaurant.cuisine}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold mr-2">
                                            ★ {restaurant.rating}
                                        </div>
                                        <span className="text-gray-600 text-sm">{restaurant.time}</span>
                                    </div>
                                    <span className="text-gray-900 font-medium">LKR {restaurant.deliveryFee}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}