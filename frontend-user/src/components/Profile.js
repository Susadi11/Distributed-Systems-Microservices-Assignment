import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Bell,
    ChevronRight,
    Heart,
    ShoppingBag,
    Settings,
    HelpCircle,
    LogOut,
    Edit3,
    Save,
    X,
    Shield,
    Mail,
    Phone,
    MapPin,
    Clock
} from 'lucide-react';
import defaultAvatar from '../images/prof.png';
import OrdersPage from "../pages/OrdersPage";
import Privacy from "./Privacy";
import HelpCenter from "./HelpCenter"; // Make sure to add this image to your project

const Profile = () => {
    const [userData, setUserData] = useState({
        name: 'Susadi Sandanima',
        email: 'susadi@example.com',
        phone: '+94 71 234 5678',
        address: '42 Galle Road, Colombo'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({...userData});
    const [activeMenuItem, setActiveMenuItem] = useState('profile');
    const navigate = useNavigate();

    const notifications = [
        {
            id: 1,
            title: 'Your order has been delivered',
            message: 'Your order #4D891 from The Pizza Company has been delivered.',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            title: 'Special Offer!',
            message: 'Get 20% off on your next order with code FOOD20.',
            time: '1 day ago',
            read: true
        }
    ];

    const menuItems = [
        { id: 'profile', label: 'Profile', icon: <User size={20} /> },
        { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={20} /> },
        { id: 'favorites', label: 'My Favorites', icon: <Heart size={20} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
        { id: 'privacy', label: 'Privacy', icon: <Shield size={20} /> },
        { id: 'help', label: 'Help Center', icon: <HelpCircle size={20} /> }
    ];

    const handleEdit = () => {
        setIsEditing(true);
        setEditedData({...userData});
    };

    const handleSave = () => {
        setUserData({...editedData});
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData({
            ...editedData,
            [name]: value
        });
    };

    const renderContent = () => {
        switch(activeMenuItem) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        {isEditing ? (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold">Edit Profile</h2>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleCancel}
                                            className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="p-2 text-green-600 rounded-full hover:bg-green-50"
                                        >
                                            <Save size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedData.name}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editedData.email}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={editedData.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={editedData.address}
                                            onChange={handleChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                        <div className="relative">
                                            <img
                                                src={defaultAvatar}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                            />
                                            <button
                                                className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full"
                                                onClick={handleEdit}
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h1 className="text-2xl font-bold">{userData.name}</h1>
                                            <p className="text-gray-600 text-sm">{userData.email}</p>

                                            <button
                                                onClick={handleEdit}
                                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                            >
                                                Edit Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-medium mb-4">Personal Information</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="bg-red-50 p-2 rounded-full mr-3">
                                                <Mail size={20} className="text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{userData.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="bg-blue-50 p-2 rounded-full mr-3">
                                                <Phone size={20} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-medium">{userData.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="bg-green-50 p-2 rounded-full mr-3">
                                                <MapPin size={20} className="text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Address</p>
                                                <p className="font-medium">{userData.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            case 'notifications':
                return (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-medium mb-4">Notifications</h2>
                        {notifications.length > 0 ? (
                            <div className="space-y-4">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-l-4 ${
                                            notification.read ? 'border-gray-300 bg-gray-50' : 'border-red-500 bg-red-50'
                                        } rounded-r-lg`}
                                    >
                                        <div className="flex justify-between">
                                            <h3 className="font-medium">{notification.title}</h3>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Clock size={14} className="mr-1" />
                                                {notification.time}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500">No notifications</p>
                            </div>
                        )}
                    </div>
                );
            case 'privacy':
                return <Privacy />;
            case 'help':
                return <HelpCenter />;
            default:
                return (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-medium mb-4">{activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1)}</h2>
                        <p className="text-gray-600">This section is under development</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white pb-16 mt-20">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-6">Account</h1>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left sidebar */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b">
                                <h2 className="font-semibold">Settings</h2>
                            </div>
                            <nav className="p-2">
                                {menuItems.map(item => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
                                            activeMenuItem === item.id
                                                ? 'bg-red-50 text-red-600'
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => setActiveMenuItem(item.id)}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                                <div
                                    className="flex items-center px-4 py-3 text-red-600 rounded-lg cursor-pointer hover:bg-gray-50 mt-2"
                                >
                                    <LogOut size={20} className="mr-3" />
                                    <span>Log Out</span>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Right content area */}
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        {renderContent()}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation - Mobile only */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2">
                <div className="flex flex-col items-center">
                    <div className="p-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <span className="text-xs">Home</span>
                </div>
                <div className="flex flex-col items-center">
                    <div className="p-1">
                        <ShoppingBag size={20} />
                    </div>
                    <span className="text-xs">Orders</span>
                </div>
                <div className="flex flex-col items-center text-red-600">
                    <div className="p-1">
                        <User size={20} />
                    </div>
                    <span className="text-xs font-medium">Account</span>
                </div>
            </div>
        </div>
    );
};

export default Profile;