import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom"; // Make sure to install react-router-dom

const offerData = [
    {
        id: 1,
        title: "50% Off Pizza",
        description: "Enjoy half-price pizzas all week!",
        restaurant: "Pizzeria Delight",
        discount: "50%",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
    },
    {
        id: 2,
        title: "Buy One Get One Free",
        description: "Buy one burger, get second free",
        restaurant: "Burger Haven",
        discount: "BOGO",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
    },
    {
        id: 3,
        title: "30% Off Sushi Platter",
        description: "Exclusive sushi platter deal",
        restaurant: "Sushi Master",
        discount: "30%",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
    },
    {
        id: 4,
        title: "25% Off Pasta",
        description: "Delicious pasta dishes at a discount",
        restaurant: "Pasta Paradise",
        discount: "25%",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
    },
];

export function MapSection() {
    const [userLocation, setUserLocation] = useState(null);
    const [mapImageUrl, setMapImageUrl] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });

                    const zoom = 14;
                    setMapImageUrl(
                        `https://static-maps.yandex.ru/1.x/?ll=${longitude},${latitude}&z=${zoom}&size=650,450&l=map`
                    );
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Offers and Search */}
                    <div className="space-y-6 pl-10 pr-10">
                        {/* Search Bar */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                            <h3
                                className="text-xl font-semibold mb-4 text-gray-800
                                bg-clip-text text-transparent
                                bg-red-600"
                            >
                                Find Restaurants Near You
                            </h3>
                            <div className="flex items-center border-2 border-gray-200 rounded-xl p-2 bg-gray-50 focus-within:border-red-500 transition-all duration-300">
                                <input
                                    type="text"
                                    placeholder="Enter restaurant name or cuisine"
                                    className="flex-grow border-none outline-none bg-transparent text-gray-700 placeholder-gray-400 text-base"
                                />
                                <button
                                    className="bg-red-600 text-white rounded-lg p-3 ml-2 hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                                >
                                    <FaSearch className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Offers Display */}
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {offerData.slice(0, 2).map((offer) => (
                                    <div
                                        key={offer.id}
                                        className={`p-6 rounded-3xl shadow-lg ${offer.bgColor}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div
                                                    className={`text-xl font-bold ${offer.textColor}`}
                                                >
                                                    {offer.title}
                                                </div>
                                                <p className="text-gray-600 mt-2">
                                                    {offer.description}
                                                </p>
                                                <div className="mt-4 text-sm font-semibold text-gray-700">
                                                    {offer.restaurant}
                                                </div>
                                            </div>
                                            <div
                                                className={`text-3xl font-bold ${offer.textColor}`}
                                            >
                                                {offer.discount}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-right">
                                <Link
                                    to="/offers"
                                    className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-300"
                                >
                                    View All Offers
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Map */}
                    <div className="flex justify-center items-center">
                        {mapImageUrl ? (
                            <div className="relative rounded-full aspect-square overflow-hidden shadow-xl w-full max-w-[400px] h-[400px]">
                                <img
                                    src={mapImageUrl}
                                    alt="Map of your location"
                                    className="w-full h-full object-cover rounded-full"
                                />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <FaMapMarkerAlt
                                        className="h-8 w-8 text-red-600
                                        animate-ping absolute"
                                    />
                                    <FaMapMarkerAlt className="h-8 w-8 text-red-600 relative" />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-[400px] h-[400px] flex items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-md hover:shadow-xl transition-all duration-300">
                                <p className="text-gray-600 font-medium text-center">
                                    Location not available.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
