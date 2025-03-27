import React from 'react';

export function HowItWorks() {
    return (
        <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8"> {/* Added left and right padding */}
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"> {/* Added hover effect */}
                        <div className="bg-red-100 rounded-full p-4 inline-block mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18S10.832 18.477 12 19.253v-13z"></path></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose a Restaurant</h3>
                        <p className="text-gray-600">Browse restaurants and select your favorite meals.</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-red-100 rounded-full p-4 inline-block mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Place Your Order</h3>
                        <p className="text-gray-600">Add items to your cart and checkout securely.</p>
                    </div>
                    <div className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="bg-red-100 rounded-full p-4 inline-block mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
                        <p className="text-gray-600">Enjoy your delicious food delivered right to your door.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}