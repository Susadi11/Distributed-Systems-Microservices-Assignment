import React, { useState } from 'react';
import { MapPin, Star, Clock, Search, ChevronDown, X } from 'lucide-react';
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
    const [activeFilter, setActiveFilter] = useState(null);

    const restaurantCategories = ['Chinese', 'Italian', 'Cafe', 'Fast Food', 'Bakery'];

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
            tags: ['Dine-in', 'Takeaway', 'Delivery'],
            deliveryTime: '25-35 min'
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
            tags: ['Coffee', 'Breakfast', 'Brunch'],
            deliveryTime: '15-25 min'
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
            tags: ['Dine-in', 'Takeaway'],
            deliveryTime: '30-45 min'
        },
        {
            id: 4,
            name: 'Green Leaf Salad Bar',
            category: 'Fast Food',
            rating: 4.6,
            distance: '1.8 km',
            openTime: '10:00 AM - 9:00 PM',
            image: res1, // Reusing res1 as placeholder
            specialties: ['Healthy Bowls', 'Smoothies', 'Wraps'],
            isOpen: true,
            tags: ['Healthy', 'Vegan Options'],
            deliveryTime: '20-30 min'
        }
    ];

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || restaurant.category === filters.category;
        const matchesRating = !filters.minRating || restaurant.rating >= filters.minRating;
        const matchesOpenStatus = !filters.openNow || restaurant.isOpen;

        return matchesSearch && matchesCategory && matchesRating && matchesOpenStatus;
    });

    const renderFilterChip = (label, value, onRemove) => (
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
            <span className="mr-2">{label}: {value}</span>
            <button onClick={onRemove} className="text-gray-500 hover:text-gray-700">
                <X size={14} />
            </button>
        </div>
    );

    const renderRestaurantCard = (restaurant) => (
        <div key={restaurant.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative h-48">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{restaurant.distance} • {restaurant.category}</span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{restaurant.openTime}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="text-sm text-gray-500">
                    Delivery: {restaurant.deliveryTime}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Restaurants</h1>
                    <p className="text-gray-600">Find the best dining options near you</p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Search for restaurants, cuisines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="relative">
                            <button
                                onClick={() => setActiveFilter(activeFilter === 'category' ? null : 'category')}
                                className={`flex items-center px-4 py-2 rounded-full border ${filters.category ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-300 text-gray-700'} hover:bg-gray-50 transition-colors`}
                            >
                                {filters.category || 'Category'}
                                <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${activeFilter === 'category' ? 'transform rotate-180' : ''}`} />
                            </button>
                            {activeFilter === 'category' && (
                                <div className="absolute z-10 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                                    {restaurantCategories.map(category => (
                                        <button
                                            key={category}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filters.category === category ? 'bg-red-50 text-red-700' : ''}`}
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, category }));
                                                setActiveFilter(null);
                                            }}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setActiveFilter(activeFilter === 'rating' ? null : 'rating')}
                                className={`flex items-center px-4 py-2 rounded-full border ${filters.minRating ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-300 text-gray-700'} hover:bg-gray-50 transition-colors`}
                            >
                                {filters.minRating ? `${filters.minRating}+ Stars` : 'Rating'}
                                <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${activeFilter === 'rating' ? 'transform rotate-180' : ''}`} />
                            </button>
                            {activeFilter === 'rating' && (
                                <div className="absolute z-10 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                                    {[4.0, 4.5, 4.7].map(rating => (
                                        <button
                                            key={rating}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filters.minRating === rating ? 'bg-red-50 text-red-700' : ''}`}
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, minRating: rating }));
                                                setActiveFilter(null);
                                            }}
                                        >
                                            {rating}+ Stars
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setFilters(prev => ({ ...prev, openNow: !prev.openNow }))}
                            className={`flex items-center px-4 py-2 rounded-full border ${filters.openNow ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-300 text-gray-700'} hover:bg-gray-50 transition-colors`}
                        >
                            <span className="mr-2">Open Now</span>
                            <div className={`w-4 h-4 rounded-sm border ${filters.openNow ? 'bg-red-500 border-red-500' : 'border-gray-400'}`}>
                                {filters.openNow && (
                                    <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Active filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {filters.category && renderFilterChip('Category', filters.category, () => setFilters(prev => ({ ...prev, category: null })))}
                        {filters.minRating && renderFilterChip('Min Rating', `${filters.minRating}+`, () => setFilters(prev => ({ ...prev, minRating: null })))}
                        {filters.openNow && renderFilterChip('Status', 'Open Now', () => setFilters(prev => ({ ...prev, openNow: false })))}
                    </div>
                </div>

                {/* Restaurant Grid */}
                {filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRestaurants.map(renderRestaurantCard)}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                            <Search size={96} className="opacity-30" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No restaurants found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilters({ category: null, minRating: null, openNow: false });
                            }}
                            className="mt-4 text-red-600 hover:text-red-700 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Restaurants;