import React from 'react';
import res1 from '../../images/res1.jpeg';
import res2 from '../../images/res2.jpeg';
import res3 from '../../images/res3.jpeg';
import { FaArrowRight } from 'react-icons/fa'; // Import the right arrow icon

export function FeaturedRestaurants() {
    return (
        <section className="py-16 px-4 md:px-8 lg:px-16">
            <div className="container mx-auto">
                {/* Flex container for Title and See More */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        Featured Restaurants
                    </h2>
                    <a href="/restaurants" className="flex items-center text-red-600 hover:text-red-800">
                        See More
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>

                {/* Grid of Restaurants */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Restaurant 1 - Asian Hotel */}
                    <div className="border rounded-3xl overflow-hidden shadow-md">
                        <img
                            src={res1}
                            alt="Asian Hotel"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex items-center justify-between"> {/* Flex container for content and arrow */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Asian Hotel</h3>
                                <p className="text-gray-600">Delivery Fee: 6244</p>
                                <p className="text-yellow-500 mt-2">★★★★☆ (4,000+) - 15 min</p>
                            </div>
                            <a href="/menu" className="text-red-600 hover:text-red-800"> {/* Link to menu page */}
                                <FaArrowRight className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Restaurant 2 - Herali */}
                    <div className="border rounded-3xl overflow-hidden shadow-md">
                        <img
                            src={res2}
                            alt="Herali"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex items-center justify-between"> {/* Flex container for content and arrow */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Herali</h3>
                                <p className="text-gray-600">Delivery Fee: 6244</p>
                                <p className="text-yellow-500 mt-2">★★★★☆ (4,000+) - 15 min</p>
                            </div>
                            <a href="/menu" className="text-red-600 hover:text-red-800"> {/* Link to menu page */}
                                <FaArrowRight className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Restaurant 3 - Anohana */}
                    <div className="border rounded-3xl overflow-hidden shadow-md">
                        <img
                            src={res3}
                            alt="Anohana"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex items-center justify-between"> {/* Flex container for content and arrow */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Anohana</h3>
                                <p className="text-gray-600">Delivery Fee: 6244</p>
                                <p className="text-yellow-500 mt-2">★★★★☆ (4,000+) - 15 min</p>
                            </div>
                            <a href="/menu" className="text-red-600 hover:text-red-800"> {/* Link to menu page */}
                                <FaArrowRight className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}