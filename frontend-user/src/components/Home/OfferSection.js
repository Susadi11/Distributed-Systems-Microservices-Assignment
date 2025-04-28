import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

// Hero image URL
const heroImage = "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"; // You can replace this with your own

const offerData = [
    {
        id: 1,
        title: "50% Off Pizza",
        description: "Enjoy half-price pizzas all week!",
        restaurant: "Pizzeria Delight",
        discount: "50%",
    },
    {
        id: 2,
        title: "Buy One Get One Free",
        description: "Buy one burger, get second free",
        restaurant: "Burger Haven",
        discount: "BOGO",
    },
    {
        id: 3,
        title: "30% Off Sushi Platter",
        description: "Exclusive sushi platter deal",
        restaurant: "Sushi Master",
        discount: "30%",
    },
    {
        id: 4,
        title: "25% Off Pasta",
        description: "Delicious pasta dishes at a discount",
        restaurant: "Pasta Paradise",
        discount: "25%",
    },
];

export function OffersSection() {
    return (
        <section
            className="relative py-32"
            style={{
                backgroundImage: `url(${heroImage})`,
                backgroundAttachment: "fixed",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-white text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
                        Find Amazing Deals Nearby
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <input
                            type="text"
                            placeholder="Search restaurants, cuisines, deals..."
                            className="flex-grow max-w-lg px-5 py-4 rounded-xl text-gray-700 text-lg bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300 w-full"
                        />
                        <button className="flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl px-6 py-4 hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-2xl">
                            <FaSearch className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {offerData.map((offer) => (
                        <div
                            key={offer.id}
                            className="bg-white bg-opacity-80 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {offer.description}
                                </p>
                                <div className="text-sm font-semibold text-gray-700">
                                    @{offer.restaurant}
                                </div>
                            </div>
                            <div className="text-5xl font-extrabold text-right text-gray-700 mt-6">
                                {offer.discount}
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-16">
                    <Link
                        to="/offers"
                        className="inline-block px-10 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-2xl hover:from-red-600 hover:to-orange-600 transform hover:-translate-y-1 transition-all duration-300"
                    >
                        View All Offers
                    </Link>
                </div>
            </div>
        </section>
    );
}
