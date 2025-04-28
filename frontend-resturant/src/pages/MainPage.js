import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaMotorcycle, FaChartLine, FaUsers, FaCog} from 'react-icons/fa';

function MainPage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        // Add your logout logic here (e.g., clearing tokens)
        alert('Logged out!');
        navigate('/');
    };

    const handleGetStartedClick = () => {
        navigate('/signup');
    };

    // Service cards data
    const services = [
        {
            id: 1,
            icon: <FaUtensils className="text-3xl text-red-600" />,
            title: "Restaurant Management",
            description: "Full control over your menu, pricing, and availability"
        },
        {
            id: 2,
            icon: <FaMotorcycle className="text-3xl text-red-600" />,
            title: "Delivery Network",
            description: "Access to our extensive delivery fleet"
        },
        {
            id: 3,
            icon: <FaChartLine className="text-3xl text-red-600" />,
            title: "Real-time Analytics",
            description: "Track sales, customer trends, and performance"
        },
        {
            id: 4,
            icon: <FaUsers className="text-3xl text-red-600" />,
            title: "Customer Management",
            description: "View customer feedback and order history"
        }
    ];

    // Benefits data
    const benefits = [
        "Increase your revenue by up to 30%",
        "Reach thousands of new customers",
        "No upfront costs - pay per order",
        "24/7 customer support",
        "Marketing and promotional tools",
        "Real-time order tracking"
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navigation Bar - Displayed First */}
            <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold text-red-600 cursor-pointer flex items-center">
                        <FaUtensils className="mr-2" />
                        <span onClick={() => navigate('/')}>FoodFleet Pro</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-700 hover:text-red-600 transition font-medium flex items-center"
                        >
                            <FaCog className="mr-1" /> Dashboard
                        </button>
                        <button
                            onClick={handleLoginClick}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleLogoutClick}
                            className="text-gray-700 hover:text-red-600 transition font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content - Image on Left with Button and Text */}
            <div className="flex-1 container mx-auto px-4 py-6 mb-20">
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-8 py-12">
    {/* Left Side - Image */}
    <div className="lg:w-1/2 w-full h-full min-h-[400px]">
        <img 
            src="https://www.heraldtribune.com/gcdn/authoring/2019/06/26/NSHT/ghows-LK-8c18d1ea-2228-1fe7-e053-0100007f4e92-7ed4c5c4.jpeg" 
            alt="Restaurant Management" 
            className="rounded-lg shadow-xl w-full h-full object-cover"
        />
    </div>

    {/* Right Side - Text and Button */}
    <div className="lg:w-1/2 w-full space-y-8 flex flex-col justify-center h-full">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Grow Your Restaurant Business With Us
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Join the leading restaurant platform that helps you increase sales, 
            streamline operations, and delight customers - just like Uber Eats 
            and DoorDash, but with better rates and more control.
        </p>
        <div className="flex flex-wrap gap-6 mt-4">
            <button
                onClick={handleGetStartedClick}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
                Get Started Now
            </button>
            <button
                onClick={() => navigate('/demo')}
                className="border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-4 rounded-lg font-bold text-lg transition hover:shadow-md"
            >
                Request Demo
            </button>
        </div>
    </div>
</div>

                {/* Services Label */}
                <div className="text-center mb-20 bg-yellow-100 p-4 rounded-lg ">
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">Our All-in-One Restaurant Platform</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need to manage and grow your restaurant business
                    </p>
                </div>

                {/* Services Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {services.map(service => (
                        <div key={service.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
                            <div className="flex justify-center mb-4">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="flex flex-col lg:flex-row gap-12 px-10 ">
                    {/* Left Side - Benefits */}
                    <div className="lg:w-1/2 w-full p-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose FoodFleet Pro?</h2>
                        <ul className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="bg-red-100 text-red-600 rounded-full p-1 mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <span className="text-lg text-gray-700">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Side - Stats or Additional Content */}
                    <div className="lg:w-1/2 w-full bg-red-50 rounded-xl p-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Impact</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow text-center">
                                <div className="text-4xl font-bold text-red-600 mb-2">10,000+</div>
                                <div className="text-gray-600">Restaurants Partnered</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow text-center">
                                <div className="text-4xl font-bold text-red-600 mb-2">5M+</div>
                                <div className="text-gray-600">Monthly Orders</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow text-center">
                                <div className="text-4xl font-bold text-red-600 mb-2">30%</div>
                                <div className="text-gray-600">Average Revenue Growth</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow text-center">
                                <div className="text-4xl font-bold text-red-600 mb-2">4.8★</div>
                                <div className="text-gray-600">Average Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <FaUtensils className="mr-2" /> FoodFleet Pro
                            </h3>
                            <p className="text-gray-400">The ultimate platform for restaurant growth and management.</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Features</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Order Management</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Menu Builder</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Analytics Dashboard</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Marketing Tools</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">API Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Community</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Webinars</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                            <address className="text-gray-400 not-italic">
                                123 Restaurant Row<br />
                                Food City, FC 10001<br />
                                <a href="mailto:support@foodfleet.pro" className="hover:text-white transition">support@foodfleet.pro</a><br />
                                (800) 555-FOOD
                            </address>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>© 2025 FoodFleet Pro. All rights reserved. | <a href="#" className="hover:text-white transition">Privacy Policy</a> | <a href="#" className="hover:text-white transition">Terms of Service</a></p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default MainPage;