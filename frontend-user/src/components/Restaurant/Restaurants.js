import React, { useState } from 'react';
import {
    MapPin,
    Star,
    Clock,
    Filter,
    Search,
    ChevronDown
} from 'lucide-react';
import res1 from '../../images/res1.jpeg';
import res2 from '../../images/res2.jpeg';
import res3 from '../../images/res3.jpeg';

const Restaurants = () => {
    const [filters, setFilters] = useState({
        category: null,
        minRating: null,
        openNow: false
    });
    const [searchTerm, setSearchTerm] = useState('');

    const restaurantCategories = [
        'Chinese', 'Italian', 'Cafe', 'Fast Food', 'Bakery'
    ];

    const restaurants = [
        {
            id: 1,
            name: 'Dragon Wok Palace',
            category: 'Chinese',
            rating: 4.7,
            distance: '2.3 km',
            openTime: '11:00 AM - 10:00 PM',
            image: res1,
            specialties: ['Dim Sum', 'Fried Rice', 'Noodles'],
            isOpen: true,
            tags: ['Dine-in', 'Takeaway', 'Delivery']
        },
        {
            id: 2,
            name: 'Cafe Bella Vista',
            category: 'Cafe',
            rating: 4.5,
            distance: '1.5 km',
            openTime: '7:00 AM - 9:00 PM',
            image: res2,
            specialties: ['Espresso', 'Pastries', 'Sandwiches'],
            isOpen: true,
            tags: ['Coffee', 'Breakfast', 'Brunch']
        },
        {
            id: 3,
            name: 'Pizzeria Napoli',
            category: 'Italian',
            rating: 4.8,
            distance: '3.2 km',
            openTime: '12:00 PM - 11:00 PM',
            image: res3,
            specialties: ['Wood Fired Pizza', 'Pasta', 'Risotto'],
            isOpen: false,
            tags: ['Dine-in', 'Takeaway']
        },
        {
            id: 4,
            name: 'Green Leaf Salad Bar',
            category: 'Fast Food',
            rating: 4.6,
            distance: '1.8 km',
            openTime: '10:00 AM - 9:00 PM',
            image: res1,
            specialties: ['Healthy Bowls', 'Smoothies', 'Wraps'],
            isOpen: true,
            tags: ['Healthy', 'Vegan Options']
        }
    ];

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || restaurant.category === filters.category;
        const matchesRating = !filters.minRating || restaurant.rating >= filters.minRating;
        const matchesOpenStatus = !filters.openNow || restaurant.isOpen;

        return matchesSearch && matchesCategory && matchesRating && matchesOpenStatus;
    });

    const renderFilterDropdown = (label, options, currentValue, onSelect) => (
        <div className="relative group">
            <button className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
                {currentValue || label}
                <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
            </button>
            <div className="absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-lg mt-2 w-48 border">
                {options.map((option) => (
                    <button
                        key={option}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => onSelect(option)}
                    >
                        {option}
                    </button>
                ))}
                {currentValue && (
                    <button
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        onClick={() => onSelect(null)}
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );

    const renderRestaurantCard = (restaurant) => (
        <div
            key={restaurant.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
        >
            <div className="relative">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm ${
                    restaurant.isOpen ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                    <div className="flex items-center text-amber-500">
                        <Star className="w-5 h-5 mr-1" fill="currentColor" />
                        <span className="font-semibold">{restaurant.rating}</span>
                    </div>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{restaurant.distance} away</span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{restaurant.openTime}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Discover Restaurants</h1>

                {/* Advanced Filtering Section */}
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search restaurants..."
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-red-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    {/* Category Filter */}
                    {renderFilterDropdown(
                        'Category',
                        restaurantCategories,
                        filters.category,
                        (category) => setFilters(prev => ({ ...prev, category }))
                    )}

                    {/* Rating Filter */}
                    {renderFilterDropdown(
                        'Min Rating',
                        [4.0, 4.5, 4.7],
                        filters.minRating ? `${filters.minRating}+` : null,
                        (rating) => setFilters(prev => ({ ...prev, minRating: rating }))
                    )}

                    {/* Open Now Toggle */}
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.openNow}
                            onChange={() => setFilters(prev => ({ ...prev, openNow: !prev.openNow }))}
                            className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-gray-700">Open Now</span>
                    </label>
                </div>

                {/* Restaurants Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants.length > 0 ? (
                        filteredRestaurants.map(renderRestaurantCard)
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            No restaurants found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Restaurants;