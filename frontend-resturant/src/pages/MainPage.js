import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/signup');
    };
    const handleLoginClick = () => {
        navigate('/login');
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-black text-white px-6 py-4 mb-10 flex justify-between items-center">
                <div className="text-2xl font-bold">FoodFleet</div>
                <div className="space-x-6 text-lg">
                    <a href="#" className="hover:text-gray-300">Food</a>
                    <a href="#" className="hover:text-gray-300">Deliver</a>
                    <a href="#" className="hover:text-gray-300">Business</a>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-1 mb-10">
                {/* Left Side - Image */}
                <div
                    className="w-1/2 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://img.freepik.com/free-photo/top-view-meals-tasty-yummy-different-pastries-dishes-brown-surface_140725-14554.jpg?semt=ais_hybrid&w=740')",
                    }}
                ></div>

                {/* Right Side - Text and Button */}
                <div className="w-1/2 bg-white flex flex-col justify-center items-start px-12 py-16 space-y-6">
                    <h1 className="text-4xl font-bold text-gray-800">Partner with FoodFleet</h1>
                    <p className="text-lg text-gray-600">
                        Join our growing network of restaurants and deliver great food to hungry customers.
                        Just like Uber or PickMe, your restaurant can now reach more people with ease.
                    </p>
                    <button
                        onClick={handleRegisterClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold text-lg"
                    >
                        Restaurant Registration
                    </button>
                    <button
                        onClick={handleLoginClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold text-lg"
                    >
                        Restaurant Registration
                    </button>
                </div>
            </div>

            {/* Label */}
            <div className="bg-blue-50 py-6 text-center text-xl text-blue-900 font-semibold tracking-wide shadow-inner">
                Empowering Local Restaurants to Deliver Nationwide 🍽️
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-4">
                © 2025 FoodFleet. All rights reserved.
            </footer>
        </div>
    );
}

export default MainPage;
