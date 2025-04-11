import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { IoRestaurant } from 'react-icons/io5';
import { MdDeliveryDining, MdHome } from 'react-icons/md';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    return (
        <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white'} rounded-full border border-gray-100`}>
            <nav className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0 pl-2">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                YUM YUM
                                <span className="font-light text-sm ml-1">&trade;</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-1">
                            <NavLink to="/" icon={<MdHome className="mr-1" />} text="Home" />
                            <NavLink to="/restaurants" icon={<IoRestaurant className="mr-1" />} text="Restaurants" />
                            <NavLink to="/orders" icon={<MdDeliveryDining className="mr-1" />} text="Orders" />
                        </div>
                    </div>

                    {/* Right side buttons */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link
                            to="/cart"
                            className="relative p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            aria-label="Shopping Cart"
                        >
                            <FaShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                3
                            </span>
                        </Link>

                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200 rounded-full"
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/signup"
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow hover:shadow-md transition-all duration-200 hover:from-red-600 hover:to-red-700"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden pr-2">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                            onClick={toggleMobileMenu}
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <FiX className="block h-6 w-6" />
                            ) : (
                                <FiMenu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3 bg-white rounded-b-2xl shadow-lg">
                    <MobileNavLink to="/" icon={<MdHome className="mr-2" />} text="Home" />
                    <MobileNavLink to="/restaurants" icon={<IoRestaurant className="mr-2" />} text="Restaurants" />
                    <MobileNavLink to="/orders" icon={<MdDeliveryDining className="mr-2" />} text="Orders" />
                    <MobileNavLink to="/cart" icon={<FaShoppingCart className="mr-2" />} text="Cart" />

                    <div className="pt-4 border-t border-gray-100 mt-2">
                        <MobileNavLink to="/login" icon={<FaUser className="mr-2" />} text="Sign In" />
                        <Link
                            to="/signup"
                            className="w-full flex items-center justify-center mt-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow hover:from-red-600 hover:to-red-700 transition-all duration-200"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

// Reusable component for desktop nav links
const NavLink = ({ to, icon, text }) => (
    <Link
        to={to}
        className="flex items-center px-4 py-2 text-sm font-medium rounded-full group transition-colors duration-200 hover:bg-gray-100"
    >
        <span className="text-gray-500 group-hover:text-red-600 transition-colors duration-200">
            {icon}
        </span>
        <span className="ml-1 text-gray-700 group-hover:text-red-600 transition-colors duration-200">
            {text}
        </span>
    </Link>
);

// Reusable component for mobile nav links
const MobileNavLink = ({ to, icon, text }) => (
    <Link
        to={to}
        className="flex items-center px-4 py-3 text-base font-medium rounded-lg hover:bg-gray-50 hover:text-red-600 text-gray-700 transition-colors duration-200"
    >
        <span className="text-gray-500">
            {icon}
        </span>
        <span className="ml-3">
            {text}
        </span>
    </Link>
);