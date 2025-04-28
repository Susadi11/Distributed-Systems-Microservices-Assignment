import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaShoppingCart } from 'react-icons/fa'; // Import shopping cart icon

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="bg-white sticky top-0 w-screen z-50 shadow-md">
            <nav className="text-lg h-full mx-auto flex max-w-7xl items-center relative justify-between p-6 lg:px-8 py-2 gap-4">
                {/* Left side of the navbar */}
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="text-2xl font-bold flex flex-row text-red-600">
                            YUM YUM
                            <span className="font-light text-base">&trade;</span>
                        </span>
                    </Link>
                </div>

                {/* Center part of the navbar - visible on desktop */}
                <div className="hidden lg:flex space-x-6">
                    <Link to="/" className="nav-item">
                        <div className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:bg-gray-100">
                            Home
                        </div>
                    </Link>
                    <Link to="/restaurants" className="nav-item">
                        <div className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:bg-gray-100">
                            Restaurants
                        </div>
                    </Link>
                    <Link to="/orders" className="nav-item">
                        <div className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:bg-gray-100">
                            Orders
                        </div>
                    </Link>
                </div>

                {/* Right side */}
                <div className="flex lg:flex-1 justify-end space-x-3 items-center">
                    <Link to="/cart" className="hidden lg:block nav-item">
                        <div className="px-3 py-1 text-sm leading-4 font-medium rounded-full text-gray-700 transition-all duration-200 hover:bg-gray-100 flex items-center">
                            <FaShoppingCart className="mr-2" /> Cart
                        </div>
                    </Link>

                    <Link to="/Login" className="hidden lg:block nav-item">
                        <div className="px-3 py-1 border border-red-500 text-sm leading-4 font-medium rounded-full text-red-600 transition-all duration-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Login
                        </div>
                    </Link>

                    <Link to="/Signup" className="hidden lg:block nav-item">
                        <div className="px-3 py-1 bg-red-600 text-sm leading-4 font-medium rounded-full text-white transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Sign Up
                        </div>
                    </Link>

                    {/* Mobile menu toggle button */}
                    <button
                        type="button"
                        className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={toggleMobileMenu}
                    >
                        <span className="sr-only">Open main menu</span>
                        {mobileMenuOpen ? (
                            <FiX className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <FiMenu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Home</Link>
                        <Link to="/restaurants" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Restaurants</Link>
                        <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Orders</Link>
                        <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Cart</Link>
                        <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Login</Link>
                        <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Sign Up</Link>
                    </div>
                </div>
            )}
        </header>
    );
}