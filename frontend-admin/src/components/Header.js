import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const handleClickOutside = () => {
      setIsDropdownOpen(false);
      setIsNotificationsOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-md px-6 py-3 rounded-b-xl">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="material-icons text-indigo-500 text-3xl">restaurant</span>
          <span className="text-xl font-bold text-gray-700">FoodAdmin</span>
        </Link>

        {/* Search + Icons */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              className="pl-10 pr-4 py-2 w-72 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              placeholder="Search here..."
              type="search"
            />
            <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-base">search</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="relative bg-gray-100 p-2 rounded-full hover:bg-indigo-100 transition"
            >
              <span className="material-icons text-indigo-600">notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-700">
                  Notifications
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">New restaurant verification request</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-800">Monthly analytics report ready</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <Link
                  to="/notifications"
                  className="block text-center text-sm font-medium text-indigo-600 py-3 hover:bg-gray-50"
                >
                  View all
                </Link>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="rounded-full border-2 border-white shadow-sm focus:outline-none hover:ring-2 hover:ring-indigo-300"
            >
              <img
                className="h-9 w-9 rounded-full object-cover"
                src="/api/placeholder/32/32"
                alt="User"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">John Smith</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span className="material-icons text-base mr-2">settings</span>
                    Account Settings
                  </Link>
                  <button className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <span className="material-icons text-base mr-2">logout</span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
