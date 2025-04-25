import React from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function DashboardNavBar() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/profile"); 
  }// Navigate to the home page when the logo is clicked
  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 px-4 py-3">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-3">
          <img src="https://cdn-icons-png.freepik.com/256/6130/6130226.png" alt="Logo" className="h-8" />
          <span className="text-3xl font-bold text-red-800 dark:text-white">
            The Lounge
          </span>
        </div>

        {/* Middle: Search bar */}
        <div className="flex-grow max-w-md mx-4 hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          {/* Search bar for mobile (optional) */}
          <div className="md:hidden">
            <button className="text-gray-500 dark:text-gray-300 hover:text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>
          </div>

          {/* Bell icon */}
          <button className="text-gray-500 dark:text-gray-300 hover:text-blue-600">
            <BellIcon className="w-6 h-6" />
          </button>

          {/* Profile icon */}
          <button 
          onClick={handleClick}
          className="text-gray-500 dark:text-gray-300 hover:text-blue-600">
            <UserCircleIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavBar;
