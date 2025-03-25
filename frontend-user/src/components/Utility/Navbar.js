import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="bg-white bg-opacity-70 backdrop-blur text-emerald-950 sticky top-0 w-screen z-50 shadow-md">
            <nav className="text-lg h-full mx-auto flex max-w-7xl items-center relative justify-between p-6 lg:px-8 py-2 gap-4">
                {/* Left side of the navbar */}
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="text-2xl font-bold flex flex-row">
                            YUM YUM
                            <span className="font-light text-base">&trade;</span>
                        </span>
                    </Link>
                </div>

                {/* Center part of the navbar - visible on desktop */}
                <div className="hidden lg:flex space-x-6">
                    <Link to="/" className="nav-item">
                        <div className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:bg-green-200">
                            Home
                        </div>
                    </Link>
                    <Link to="/dashboard" className="nav-item">
                        <div className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:bg-green-200">
                            Dashboard
                        </div>
                    </Link>
                    <Link to="/serviceView" className="nav-item">
                        <div className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:bg-green-200">
                            Services
                        </div>
                    </Link>
                </div>

                {/* Right side */}
                <div className="flex lg:flex-1 justify-end space-x-3">
                    <Link to="/login" className="hidden lg:block nav-item">
                        <div className="px-3 py-1 border border-green-500 text-sm leading-4 font-medium rounded-full text-black transition-all duration-200 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Login
                        </div>
                    </Link>

                    <Link to="/signup" className="hidden lg:block nav-item">
                        <div className="px-3 py-1 border border-dark-red bg-dark-red text-sm leading-4 font-medium rounded-full text-white transition-all duration-200 hover:bg-red-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
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
                        <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Dashboard</Link>
                        <Link to="/serviceView" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Services</Link>
                        <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Login</Link>
                        <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Sign Up</Link>
                    </div>
                </div>
            )}
        </header>
    );
}
