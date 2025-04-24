import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Search, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Restaurants = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        category: null,
        minRating: null,
        openNow: false
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const restaurantCategories = ['Restaurant', 'Cafe', 'Bakery', 'Food Truck', 'Grocery Store', 'Other Food Business'];

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // Update this URL to match your actual backend service
                // (using the RESTAURANT_ADMIN_SERVICE_URL from your backend code)
                const response = await axios.get('http://localhost:5556/api/restaurants/verified');

                if (response.data.success) {
                    // Transform the categorized data into a flat array
                    let allRestaurants = [];

                    // Check if response is already categorized
                    if (response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
                        allRestaurants = Object.values(response.data.data).flat();
                    } else if (Array.isArray(response.data.data)) {
                        allRestaurants = response.data.data;
                    }

                    setRestaurants(allRestaurants);
                } else {
                    setError('Failed to fetch restaurants');
                }
            } catch (err) {
                console.error('Error fetching restaurants:', err);
                setError(err.message || 'Failed to fetch restaurants');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.storeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || restaurant.businessType === filters.category;
        // Assuming restaurants might not have ratings
        const rating = restaurant.rating || 0;
        const matchesRating = !filters.minRating || rating >= filters.minRating;
        // Use isOpenNow from the schema instead of isOpen
        const matchesOpenStatus = !filters.openNow || restaurant.isOpenNow;

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

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/menu/${restaurantId}`);
    };

    const renderRestaurantCard = (restaurant) => (
        <div
            key={restaurant._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
            onClick={() => handleRestaurantClick(restaurant._id)}
        >
            <div className="relative h-48">
                {restaurant.profileImage && restaurant.profileImage.length > 0 ? (
                    <img
                        src={`http://localhost:5556${restaurant.profileImage[0]}`}
                        alt={restaurant.storeName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                    </div>
                )}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    restaurant.isOpenNow ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {restaurant.isOpenNow ? 'Open' : 'Closed'}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{restaurant.storeName}</h3>
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{restaurant.rating || 'N/A'}</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{restaurant.address?.city} • {restaurant.businessType}</span>
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    <span>{restaurant.openingHours?.open || '11:00 AM'} - {restaurant.openingHours?.close || '10:00 PM'}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.cuisineTypes?.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="text-sm text-gray-500">
                    Delivery: 25-35 min
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading restaurants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                        <X size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading restaurants</h3>
                    <p className="text-gray-500">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-red-600 hover:text-red-700 font-medium"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
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