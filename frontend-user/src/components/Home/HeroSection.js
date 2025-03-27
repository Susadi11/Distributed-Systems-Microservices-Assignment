import React from 'react';
import heroImage from '../../images/Hero.jpeg';
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export function HeroSection() {
    return (
        <section className="py-20" style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <div className="container mx-auto text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">
                    Discover the Best Food Near You
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                    Order from your favorite restaurants and get fast delivery to your door.
                </p>
                <div className="flex justify-center">
                    <div className="flex items-center bg-white rounded-full p-2 border border-gray-200 w-full max-w-md">
                        <div className="flex items-center flex-grow">
                            <MapPinIcon className="h-6 w-6 mr-2 text-gray-600" />
                            <input
                                type="text"
                                placeholder="Enter delivery address"
                                className="border-none outline-none flex-grow text-gray-800"
                            />
                        </div>
                        <button className="bg-red-600 text-white rounded-full p-2 ml-2">
                            <ArrowRightIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}