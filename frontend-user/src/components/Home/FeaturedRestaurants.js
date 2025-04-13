import React from 'react';
import { FaStar, FaArrowCircleRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import res1 from '../../images/res1.jpeg';
import res2 from '../../images/res2.jpeg';
import res3 from '../../images/res3.jpeg';
import { MapPin, Clock } from 'lucide-react';

const restaurants = [
    {
        id: 1,
        name: 'Asian Hotel',
        cuisine: 'Chinese • Sri Lankan',
        deliveryFee: 150,
        rating: 4.5,
        time: '15-25 min',
        image: res1,
        distance: '2.1 km',
        isOpen: true,
        openTime: '10:00 AM - 10:00 PM',
    },
    {
        id: 2,
        name: 'Herali',
        cuisine: 'Sri Lankan • Fast Food',
        deliveryFee: 200,
        rating: 4.7,
        time: '20-30 min',
        image: res2,
        distance: '1.8 km',
        isOpen: true,
        openTime: '8:00 AM - 9:00 PM',
    },
    {
        id: 3,
        name: 'Anohana',
        cuisine: 'Japanese • Sushi',
        deliveryFee: 250,
        rating: 4.8,
        time: '25-35 min',
        image: res3,
        distance: '3.5 km',
        isOpen: false,
        openTime: '12:00 PM - 11:00 PM',
    },
    {
        id: 4,
        name: 'Pizza Palace',
        cuisine: 'Italian • Pizza',
        deliveryFee: 180,
        rating: 4.6,
        time: '20-30 min',
        image: res1,
        distance: '1.2 km',
        isOpen: true,
        openTime: '11:00 AM - 10:30 PM',
    },
    {
        id: 5,
        name: 'Burger Hub',
        cuisine: 'American • Fast Food',
        deliveryFee: 120,
        rating: 4.3,
        time: '15-25 min',
        image: res2,
        distance: '0.9 km',
        isOpen: true,
        openTime: '9:00 AM - 9:30 PM',
    },
    {
        id: 6,
        name: 'Curry Leaf',
        cuisine: 'Indian • Sri Lankan',
        deliveryFee: 160,
        rating: 4.4,
        time: '20-30 min',
        image: res3,
        distance: '2.7 km',
        isOpen: true,
        openTime: '11:30 AM - 10:00 PM',
    },
    {
        id: 7,
        name: 'Sushi Express',
        cuisine: 'Japanese • Asian',
        deliveryFee: 220,
        rating: 4.7,
        time: '25-35 min',
        image: res1,
        distance: '3.1 km',
        isOpen: false,
        openTime: '6:00 PM - 11:00 PM',
    },
    {
        id: 8,
        name: 'Tandoori Nights',
        cuisine: 'Indian • BBQ',
        deliveryFee: 190,
        rating: 4.5,
        time: '20-30 min',
        image: res2,
        distance: '1.5 km',
        isOpen: true,
        openTime: '12:00 PM - 10:00 PM',
    },
    {
        id: 9,
        name: 'Another Place',
        cuisine: 'International',
        deliveryFee: 170,
        rating: 4.2,
        time: '20-35 min',
        image: res3,
        distance: '2.0 km',
        isOpen: true,
        openTime: '10:00 AM - 11:00 PM',
    },
    {
        id: 10,
        name: 'The Grill House',
        cuisine: 'BBQ • American',
        deliveryFee: 190,
        rating: 4.6,
        time: '25-40 min',
        image: res1,
        distance: '3.8 km',
        isOpen: true,
        openTime: '11:00 AM - 9:00 PM',
    },
];

const RestaurantCard = ({ restaurant }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="w-72 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
        <div className="relative h-48">
            <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center shadow-sm">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-xs font-bold">{restaurant.rating}</span>
            </div>
            <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                {restaurant.isOpen ? 'Open' : 'Closed'}
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-1">{restaurant.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{restaurant.cuisine}</p>
            <div className="flex items-center text-gray-600 text-sm mb-1">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                <span>{restaurant.distance}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mb-2">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                <span>{restaurant.time} ({restaurant.openTime})</span>
            </div>
            <span className="text-xs font-medium text-gray-900">Delivery LKR {restaurant.deliveryFee}</span>
        </div>
    </motion.div>
);

export const FeaturedRestaurants = () => {
    return (
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-red-700 overflow-hidden">
            {/* Banner Background */}
            <div className="absolute inset-0  opacity-50 -rotate-1 scale-105"></div>

            <div className="relative container mx-auto">
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
                    {/* Removed the "View all" link */}
                </div>

                {/* Restaurant Cards - Horizontal Scroll with Hidden Scrollbar */}
                <div className="relative">
                    <div className="overflow-x-auto scroll-smooth">
                        <div className="flex space-x-6 w-max" style={{
                            scrollbarWidth: 'none', /* Firefox */
                            WebkitOverflowScrolling: 'touch', /* iOS */
                        }}>
                            {restaurants.map((restaurant, index) => (
                                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                            ))}

                            {/* View More Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                viewport={{ once: true }}
                                className="w-72 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center justify-center"
                            >
                                <a
                                    href="/restaurants"
                                    className="flex flex-col items-center p-6 text-center"
                                >
                                    <FaArrowCircleRight className="text-red-500 text-3xl mb-2" />
                                    <h3 className="font-bold text-gray-900">View All</h3>
                                    <p className="text-gray-500 text-sm mt-1">All restaurants</p>
                                </a>
                            </motion.div>
                        </div>
                    </div>
                    {/* Tailwind class to hide scrollbar for Webkit browsers (Chrome, Safari) */}
                    <style jsx>{`
                        .overflow-x-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                </div>
            </div>
        </section>
    );
};