import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Heart,
    Search,
    X,
    ChevronLeft,
    MapPin,
    Clock,
    Star,
    Plus,
    Minus,
    Loader
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const Menu = () => {
    const { restaurantId } = useParams();
    const [activeTab, setActiveTab] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [restaurant, setRestaurant] = useState(null);
    const [menuCategories, setMenuCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchInputRef = useRef(null);

    const { addToCart, updateQuantity, removeFromCart, getItemQuantity, cart } = useCart();

    // Fetch restaurant details and menu
    useEffect(() => {
        const fetchRestaurantAndMenu = async () => {
            try {
                setLoading(true);

                // Get restaurant details
                const restaurantsResponse = await axios.get('http://localhost:5558/restaurants');
                let restaurantData = null;

                if (restaurantsResponse.data.success) {
                    Object.values(restaurantsResponse.data.data).forEach(categoryRestaurants => {
                        const found = categoryRestaurants.find(r => r._id === restaurantId);
                        if (found) restaurantData = found;
                    });
                }

                if (!restaurantData) {
                    throw new Error('Restaurant not found');
                }

                setRestaurant(restaurantData);

                // Get menu for this restaurant
                const menuResponse = await axios.get(`http://localhost:5558/restaurants/${restaurantId}/menu`);

                if (menuResponse.data.success) {
                    const menuData = menuResponse.data.menu.map(item => ({
                        ...item,
                        restaurant: restaurantId
                    }));

                    const categorizedMenu = menuData.reduce((acc, item) => {
                        const category = item.category || 'Other';
                        acc[category] = acc[category] || [];
                        acc[category].push(item);
                        return acc;
                    }, {});

                    setMenuCategories(categorizedMenu);

                    if (Object.keys(categorizedMenu).length > 0) {
                        setActiveTab(Object.keys(categorizedMenu)[0]);
                    }
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message || 'Failed to load restaurant menu');
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchRestaurantAndMenu();
        }
    }, [restaurantId]);

    useEffect(() => {
        if (searchVisible && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchVisible]);

    const handleIncrement = async (item) => {
        try {
            const currentQuantity = getItemQuantity(item._id);

            if (currentQuantity === 0) {
                // For adding a new item to cart
                const cartItem = {
                    productId: item._id,  // Changed from _id to productId
                    restaurantId: restaurantId,  // Changed from restaurant to restaurantId
                    quantity: 1,
                    // Additional fields for local cart management
                    productName: item.productName,
                    price: item.price,
                    images: item.images
                };

                await addToCart(cartItem);
                console.log("Added to cart:", cartItem);
            } else {
                // For updating existing item quantity
                const newQuantity = currentQuantity + 1;
                await updateQuantity(item._id, newQuantity);
                console.log(`Updated quantity for ${item._id} to ${newQuantity}`);
            }
        } catch (error) {
            console.error("Error handling increment:", error);
        }
    };

    const handleDecrement = async (itemId) => {
        try {
            const currentQuantity = getItemQuantity(itemId);

            if (currentQuantity === 1) {
                await removeFromCart(itemId);
                console.log(`Removed item ${itemId} from cart`);
            } else if (currentQuantity > 1) {
                const newQuantity = currentQuantity - 1;
                await updateQuantity(itemId, newQuantity);
                console.log(`Decreased quantity for ${itemId} to ${newQuantity}`);
            }
        } catch (error) {
            console.error("Error handling decrement:", error);
        }
    };

    useEffect(() => {
        // Debug cart changes
        console.log("Current cart state:", cart);
    }, [cart]);

    const renderMenuItem = (item) => {
        const displayRating = item.rating ? (item.rating / 20).toFixed(1) : null;
        const starColor = displayRating >= 4.5 ? 'text-green-500'
            : displayRating >= 3.5 ? 'text-yellow-500'
                : 'text-gray-400';

        const quantity = getItemQuantity(item._id);

        const imageUrl = item.images && item.images.length > 0
            ? `http://localhost:5556${item.images[0]}`
            : '/api/placeholder/400/320';

        return (
            <div key={item._id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="relative h-48">
                    <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/api/placeholder/400/320';
                        }}
                    />
                    {item.badge && (
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            {item.badge}
                        </div>
                    )}
                    {item.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            {item.discount}% OFF
                        </div>
                    )}
                    <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-900">{item.productName}</h3>
                        {displayRating !== null && (
                            <div className="flex items-center text-xs text-gray-600">
                                <Star className={`w-3 h-3 mr-0.5 ${starColor}`} />
                                <span className="font-medium">{displayRating}</span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">LKR {item.price.toLocaleString()}</span>
                        {quantity > 0 ? (
                            <div className="flex items-center space-x-2 bg-red-600 text-white rounded-full px-2 py-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDecrement(item._id);
                                    }}
                                    className="p-0.5 hover:bg-red-700 rounded-full"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium">{quantity}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleIncrement(item);
                                    }}
                                    className="p-0.5 hover:bg-red-700 rounded-full"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleIncrement(item);
                                }}
                                className="p-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin h-10 w-10 text-red-500 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading menu...</p>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading menu</h3>
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

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                        <X size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Restaurant not found</h3>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 text-red-600 hover:text-red-700 font-medium"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    // Filter menu items based on search term if entered
    const filteredMenuItems = menuCategories[activeTab]?.filter(item =>
        !searchTerm || item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    // Get restaurant image URL
    const restaurantImage = restaurant.profileImage && restaurant.profileImage.length > 0
        ? `http://localhost:5556${restaurant.profileImage[0]}`
        : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80';

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-72 md:h-80 lg:h-96 bg-cover bg-center" style={{ backgroundImage: `url(${restaurantImage})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-between py-6 text-white">
                    <div className="flex items-center justify-between">
                        <button onClick={() => window.history.back()} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="relative flex items-center">
                            {searchVisible && (
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search menu..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 rounded-full px-4 py-1.5 w-40 sm:w-56 mr-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                            )}
                            <button onClick={() => setSearchVisible(!searchVisible)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
                                {searchVisible ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{restaurant.storeName}</h1>
                        <div className="flex items-center text-sm mb-1.5 space-x-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{restaurant.address?.street}, {restaurant.address?.city}</span>
                        </div>
                        <div className="flex items-center text-sm mb-1.5 space-x-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{restaurant.openingHours?.open || '10:00 AM'} - {restaurant.openingHours?.close || '10:00 PM'}</span>
                        </div>
                        <div className="flex items-center text-sm space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <span className="font-semibold">{restaurant.rating || '4.5'}</span>
                            <span>({restaurant.reviewCount || '0'} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="container mx-auto px-4 py-6">
                {/* Categories Tabs */}
                {Object.keys(menuCategories).length > 0 ? (
                    <div className="sticky top-0 bg-gray-50 z-20 py-4 mb-6 -mx-4 px-4 border-b border-gray-200">
                        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                            {Object.keys(menuCategories).map(category => (
                                <button
                                    key={category}
                                    className={`py-1.5 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                        activeTab === category
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                    onClick={() => setActiveTab(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <p className="text-gray-500">No menu categories available.</p>
                    </div>
                )}

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredMenuItems.length > 0 ? (
                        filteredMenuItems.map(renderMenuItem)
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            {searchTerm
                                ? `No items matching "${searchTerm}" found in this category.`
                                : `No items available in the "${activeTab}" category yet.`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;