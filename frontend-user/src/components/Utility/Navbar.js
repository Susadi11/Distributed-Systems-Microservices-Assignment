import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { FaShoppingCart, FaUser, FaUserCircle } from 'react-icons/fa';
import { IoRestaurant } from 'react-icons/io5';
import { MdDeliveryDining, MdHome } from 'react-icons/md';

// Reusable NavLink for desktop
function NavLink({ to, icon, text }) {
    return (
        <Link
            to={to}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
        >
            {icon}
            {text}
        </Link>
    );
}

// Reusable MobileNavLink for mobile menu
function MobileNavLink({ to, icon, text }) {
    return (
        <Link
            to={to}
            className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
        >
            {icon}
            {text}
        </Link>
    );
}

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Check authentication status
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);

        if (token) {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                setUserData(user);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setUserData(null);
            }
        } else {
            setUserData(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/');
        setMobileMenuOpen(false);
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
        <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 ${scrolled ? 'bg-white opacity-80 backdrop-blur-md shadow-lg' : 'bg-white'} rounded-full border border-gray-100`}>
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

                        {isLoggedIn ? (
                            <>
                                <div className="flex items-center">
                                    <Link
                                        to="/profile"
                                        className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                                        aria-label="User Profile"
                                    >
                                        <FaUserCircle className="h-5 w-5 mr-1" />
                                        <span className="text-sm font-medium">{userData?.name || 'Profile'}</span>
                                    </Link>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200 rounded-full flex items-center"
                                >
                                    <FiLogOut className="mr-1" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
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
                        {isLoggedIn ? (
                            <>
                                <MobileNavLink
                                    to="/profile"
                                    icon={<FaUserCircle className="mr-2" />}
                                    text={userData?.name || 'Profile'}
                                />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 transition-colors duration-200"
                                >
                                    <FiLogOut className="mr-2" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <MobileNavLink to="/login" icon={<FaUser className="mr-2" />} text="Sign In" />
                                <Link
                                    to="/signup"
                                    className="w-full flex items-center justify-center mt-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow hover:from-red-600 hover:to-red-700 transition-all duration-200"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}