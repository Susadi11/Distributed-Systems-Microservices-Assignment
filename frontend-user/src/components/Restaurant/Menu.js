import React, { useState, useRef, useEffect } from 'react';
import {
    Heart,
    Search,
    X,
    ChevronLeft,
    MapPin,
    Clock,
    Star,
    Plus,
    Minus
} from 'lucide-react';

// Import your local food images
import food1 from '../../images/food1.jpeg';
import food2 from '../../images/food2.jpeg';
import food3 from '../../images/food3.jpeg';
import food4 from '../../images/food4.jpeg';
import food5 from '../../images/food5.jpeg';
import food6 from '../../images/food6.jpeg';
import food7 from '../../images/food7.jpeg';

const Menu = () => {
    const [activeTab, setActiveTab] = useState('Special');
    const [searchVisible, setSearchVisible] = useState(false);
    const [quantities, setQuantities] = useState({});
    const searchInputRef = useRef(null);

    const restaurantDetails = {
        name: 'Dragon Chinese Restaurant',
        address: '123 Main Street, Millewa, Western Province, Sri Lanka',
        openingHours: '10:00 AM - 10:00 PM',
        rating: 4.8,
        reviewCount: 350,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    };

    const menuCategories = {
        'Special': [
            {
                id: 1,
                name: 'Special Chinese Fried Rice (Mixed Rice)',
                description: 'Comes with fried chicken, pork, prawns, chicken sausages, cuttlefish and eggs',
                price: 1650,
                image: food1,
                rating: 94,
                ratingCount: 38
            },
            {
                id: 2,
                name: 'Chicken Rice (Regular)',
                description: 'Comes with fried chicken, chicken sausages and eggs',
                price: 1200,
                image: food1,
                rating: 88,
                ratingCount: 34
            },
            {
                id: 3,
                name: 'Seafood Rice (Regular)',
                description: 'Comes with prawns, fish, cuttlefish and eggs',
                price: 1450,
                image: food1,
                rating: 82,
                ratingCount: 17
            }
        ],
        'Basmathi': [
            {
                id: 4,
                name: 'Chicken Set Menu Basmathi (Authentic) New',
                description: 'Basmathi Egg Fried Rice, Devilled Chicken Piece, Vegetable Chop suey/Brinjal, Moju, Chili paste/gravy',
                price: 900,
                image: food2,
                rating: 85,
                ratingCount: 140,
                badge: 'New'
            },
            {
                id: 5,
                name: 'Pork Set Menu Basmathi (Regular)',
                description: 'Basmathi Egg Fried Rice, Devilled Pork Pieces (150g), Vegetable Chop suey/Brinjal, Moju, Chili paste/gravy',
                price: 1100,
                image: food2,
                rating: 80,
                ratingCount: 47
            }
        ],
        'Offers': [
            {
                id: 6,
                name: 'Keeri Samba Seafood Mixed',
                description: 'Fish, Prawns, Cuttlefish',
                price: 1950,
                image: food3,
                offer: 'Buy 1, get 1 free'
            },
            {
                id: 7,
                name: 'Keeri Samba Chicken Mixed',
                description: 'Chicken and Sausage Mixed',
                price: 1590,
                image: food3,
                offer: 'Buy 1, get 1 free',
                rating: 87,
                ratingCount: 8
            }
        ],
        'Kottu': [
            {
                id: 8,
                name: 'Chicken Cheese Kottu',
                description: 'Chopped roti with chicken, melted cheese, and special spices',
                price: 1100,
                image: food4,
                rating: 92,
                ratingCount: 55
            },
            {
                id: 9,
                name: 'Seafood Kottu',
                description: 'Mixed seafood kottu with prawns, fish, and cuttlefish',
                price: 1250,
                image: food4,
                rating: 88,
                ratingCount: 42
            }
        ],
        'Noodles': [
            {
                id: 10,
                name: 'Chicken Chow Mein',
                description: 'Stir-fried noodles with chicken, vegetables, and special sauce',
                price: 1200,
                image: food5,
                rating: 90,
                ratingCount: 65
            },
            {
                id: 11,
                name: 'Seafood Noodles',
                description: 'Spicy noodles with mixed seafood and vegetables',
                price: 1350,
                image: food5,
                rating: 86,
                ratingCount: 38
            }
        ],
        'Beverages': [
            {
                id: 12,
                name: 'Fresh Lime Juice',
                description: 'Freshly squeezed lime with sugar and mint',
                price: 250,
                image: food6,
                badge: 'Refreshing'
            },
            {
                id: 13,
                name: 'Coconut Smoothie',
                description: 'Creamy coconut smoothie with fresh coconut pieces',
                price: 350,
                image: food6,
                badge: 'Popular'
            }
        ],
        'Desserts': [
            {
                id: 14,
                name: 'Chocolate Brownie',
                description: 'Warm chocolate brownie served with vanilla ice cream',
                price: 500,
                image: food7,
                rating: 95,
                ratingCount: 72
            },
            {
                id: 15,
                name: 'Watalappam',
                description: 'Traditional Sri Lankan coconut custard pudding',
                price: 450,
                image: food7,
                rating: 90,
                ratingCount: 55
            }
        ]
    };

    const handleIncrement = (itemId) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    };

    const handleDecrement = (itemId) => {
        setQuantities(prev => {
            const newQuantity = (prev[itemId] || 0) - 1;
            if (newQuantity <= 0) {
                const newQuantities = {...prev};
                delete newQuantities[itemId];
                return newQuantities;
            }
            return {
                ...prev,
                [itemId]: newQuantity
            };
        });
    };

    const renderMenuItem = (item) => {
        const displayRating = item.rating !== undefined ? (item.rating / 20).toFixed(1) : null;
        const starColor = displayRating >= 4.5 ? 'text-green-500'
            : displayRating >= 3.5 ? 'text-yellow-500'
                : 'text-gray-400';

        const quantity = quantities[item.id] || 0;

        return (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="relative h-48">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    {item.badge && (
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            {item.badge}
                        </div>
                    )}
                    {item.offer && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            {item.offer}
                        </div>
                    )}
                    <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
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
                                        handleDecrement(item.id);
                                    }}
                                    className="p-0.5 hover:bg-red-700 rounded-full"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium">{quantity}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleIncrement(item.id);
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
                                    handleIncrement(item.id);
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

    // ... rest of your component code (useEffect, return statement, etc.)
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Taller Hero Section */}
            <div className="relative h-72 md:h-80 lg:h-96 bg-cover bg-center" style={{ backgroundImage: `url(${restaurantDetails.image})` }}>
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
                                    className="border border-gray-300 rounded-full px-4 py-1.5 w-40 sm:w-56 mr-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-500"
                                />
                            )}
                            <button onClick={() => setSearchVisible(!searchVisible)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
                                {searchVisible ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{restaurantDetails.name}</h1>
                        <div className="flex items-center text-sm mb-1.5 space-x-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{restaurantDetails.address}</span>
                        </div>
                        <div className="flex items-center text-sm mb-1.5 space-x-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{restaurantDetails.openingHours}</span>
                        </div>
                        <div className="flex items-center text-sm space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <span className="font-semibold">{restaurantDetails.rating}</span>
                            <span>({restaurantDetails.reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="container mx-auto px-4 py-6">
                {/* Categories Tabs */}
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

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    {menuCategories[activeTab]?.map(renderMenuItem)}
                    {menuCategories[activeTab]?.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No items available in the "{activeTab}" category yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;