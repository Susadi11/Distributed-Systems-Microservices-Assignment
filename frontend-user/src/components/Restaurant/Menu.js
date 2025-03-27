import React, { useState, useRef, useEffect } from 'react';
import {
    Heart,
    Search,
    X,
    ShoppingCart,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import food1 from '../../images/food1.jpeg'
import food2 from '../../images/food2.jpeg'
import food3 from '../../images/food3.jpeg'
import food4 from '../../images/food4.jpeg'
import food5 from '../../images/food5.jpeg'
import food6 from '../../images/food6.jpeg'
import food7 from '../../images/food7.jpeg'

const Menu = () => {
    const [activeTab, setActiveTab] = useState('Special');
    const [searchVisible, setSearchVisible] = useState(false);
    const searchInputRef = useRef(null);

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
                rating: 94,
                ratingCount: 34
            },
            {
                id: 3,
                name: 'Seafood Rice (Regular)',
                description: 'Comes with prawns, fish, cuttlefish and eggs',
                price: 1450,
                image: food1,
                rating: 88,
                ratingCount: 17
            }
        ],
        'Basmathi': [
            {
                id: 1,
                name: 'Chicken Set Menu Basmathi (Authentic) New',
                description: 'Basmathi Egg Fried Rice, Devilled Chicken Piece, Vegetable Chop suey/Brinjal, Moju, Chili paste/gravy',
                price: 900,
                image: food2,
                rating: 85,
                ratingCount: 140,
                badge: 'New'
            },
            {
                id: 2,
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
                id: 1,
                name: 'Keeri Samba Seafood Mixed',
                description: 'Fish, Prawns, Cuttlefish',
                price: 1950,
                image: food3,
                offer: 'Buy 1, get 1 free'
            },
            {
                id: 2,
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
                id: 1,
                name: 'Chicken Cheese Kottu',
                description: 'Chopped roti with chicken, melted cheese, and special spices',
                price: 1100,
                image: food4,
                rating: 92,
                ratingCount: 55
            },
            {
                id: 2,
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
                id: 1,
                name: 'Chicken Chow Mein',
                description: 'Stir-fried noodles with chicken, vegetables, and special sauce',
                price: 1200,
                image: food5,
                rating: 90,
                ratingCount: 65
            },
            {
                id: 2,
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
                id: 1,
                name: 'Fresh Lime Juice',
                description: 'Freshly squeezed lime with sugar and mint',
                price: 250,
                image: food6,
                badge: 'Refreshing'
            },
            {
                id: 2,
                name: 'Coconut Smoothie',
                description: 'Creamy coconut smoothie with fresh coconut pieces',
                price: 350,
                image: food6,
                badge: 'Popular'
            }
        ],
        'Desserts': [
            {
                id: 1,
                name: 'Chocolate Brownie',
                description: 'Warm chocolate brownie served with vanilla ice cream',
                price: 500,
                image: food7,
                rating: 95,
                ratingCount: 72
            },
            {
                id: 2,
                name: 'Watalappam',
                description: 'Traditional Sri Lankan coconut custard pudding',
                price: 450,
                image: food7,
                rating: 90,
                ratingCount: 55
            }
        ]
    };

    const categories = Object.keys(menuCategories);

    const renderMenuItem = (item) => (
        <div key={item.id} className="bg-white rounded-3xl shadow-md overflow-hidden mb-6 transition-transform hover:scale-105 px-4 py-4">
            <div className="relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                />
                {item.badge && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                    </div>
                )}
                {item.offer && (
                    <div className="absolute top-2 left-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                        {item.offer}
                    </div>
                )}
                <button className="absolute top-2 right-2 bg-white/80 rounded-full p-2">
                    <Heart className="text-red-500 w-5 h-5" />
                </button>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    {(item.rating !== undefined) && (
                        <div className="flex items-center">
                            <span className={`font-semibold ${item.rating >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>{item.rating}%</span>
                            <span className="text-gray-500 ml-1">({item.ratingCount})</span>
                        </div>
                    )}
                </div>
                <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-dark-red">LKR {item.price.toLocaleString()}</span>
                    <button className="bg-dark-red text-white px-4 py-2 rounded-full flex items-center hover:bg-red-hover transition-colors">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        if (searchVisible && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchVisible]);

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                            <h1 className="text-2xl font-bold text-gray-800">Dragon Chinese Restaurant</h1>
                        </div>
                        <div className="relative flex items-center">
                            {searchVisible ? (
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search menu items..."
                                    className="border rounded-full px-4 py-2 w-64 shadow-md transition-all duration-300 mr-2" // Added mr-2 for spacing
                                />
                            ) : null}
                            <button onClick={() => setSearchVisible(!searchVisible)}>
                                {searchVisible ? (
                                    <X className="w-6 h-6 text-gray-600" />
                                ) : (
                                    <Search className="w-6 h-6 text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Categories Tabs */}
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`py-2 px-4 rounded-full text-sm whitespace-nowrap transition-colors ${
                                    activeTab === category
                                        ? 'bg-dark-red text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => setActiveTab(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="container mx-auto px-16 py-6">
                <div className="grid md:grid-cols-3 gap-6">
                    {menuCategories[activeTab].map(renderMenuItem)}
                </div>
            </div>
        </div>
    );
};

export default Menu;