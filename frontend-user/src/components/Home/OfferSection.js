import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const offerData = [
    {
        id: 1,
        title: "50% Off Pizza",
        description: "Enjoy half-price pizzas all week!",
        restaurant: "Pizzeria Delight",
        discount: "50%",
        bgColor: "bg-gradient-to-br from-red-50 to-red-100",
        textColor: "text-red-600",
        borderColor: "border-red-200",
    },
    {
        id: 2,
        title: "Buy One Get One Free",
        description: "Buy one burger, get second free",
        restaurant: "Burger Haven",
        discount: "BOGO",
        bgColor: "bg-gradient-to-br from-green-50 to-green-100",
        textColor: "text-green-600",
        borderColor: "border-green-200",
    },
    {
        id: 3,
        title: "30% Off Sushi Platter",
        description: "Exclusive sushi platter deal",
        restaurant: "Sushi Master",
        discount: "30%",
        bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
    },
    {
        id: 4,
        title: "25% Off Pasta",
        description: "Delicious pasta dishes at a discount",
        restaurant: "Pasta Paradise",
        discount: "25%",
        bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
        textColor: "text-yellow-600",
        borderColor: "border-yellow-200",
    },
];

export function OffersSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Search Bar */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-12 border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">
                            Find Amazing Deals Nearby
                        </h3>
                        <div className="flex items-center border-2 border-gray-200 rounded-xl p-3 bg-gray-50 focus-within:border-red-500 transition-all duration-300">
                            <input
                                type="text"
                                placeholder="Search for restaurants or cuisines..."
                                className="flex-grow border-none outline-none bg-transparent text-gray-700 placeholder-gray-400 text-lg"
                            />
                            <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-3 ml-2 hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg">
                                <FaSearch className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Offers Grid */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Today's Best Offers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {offerData.map((offer) => (
                                <div
                                    key={offer.id}
                                    className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ${offer.bgColor} border ${offer.borderColor}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div
                                                className={`text-xl font-bold ${offer.textColor} mb-2`}
                                            >
                                                {offer.title}
                                            </div>
                                            <p className="text-gray-600 mb-3">
                                                {offer.description}
                                            </p>
                                            <div className="text-sm font-semibold text-gray-700">
                                                @{offer.restaurant}
                                            </div>
                                        </div>
                                        <div
                                            className={`text-4xl font-bold ${offer.textColor}`}
                                        >
                                            {offer.discount}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* View All Button */}
                    <div className="text-center">
                        <Link
                            to="/offers"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full shadow-md hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                        >
                            View All Offers
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}