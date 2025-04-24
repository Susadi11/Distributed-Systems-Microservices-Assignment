import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/", icon: "dashboard", color: "from-purple-500 to-indigo-500" },
  { label: "Verify Restaurants", to: "/verify-restaurants", icon: "verified", color: "from-emerald-500 to-teal-500" },
  { label: "User Management", to: "/users", icon: "people", color: "from-amber-500 to-orange-500" },
  { label: "Transactions", to: "/transactions", icon: "receipt_long", color: "from-blue-500 to-cyan-500" },
  { label: "Analytics", to: "/analytics", icon: "analytics", color: "from-fuchsia-500 to-pink-500" },
  { label: "Account Settings", to: "/account", icon: "settings", color: "from-sky-500 to-blue-500" },
  { label: "Notifications", to: "/notifications", icon: "notifications", color: "from-red-500 to-rose-500" },
];

function Sidebar() {
  const location = useLocation();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-indigo-50 to-white p-6 shadow-2xl flex flex-col border-r border-indigo-100 transition-all duration-300 ease-in-out relative z-10">
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-md rounded-tr-3xl shadow-inner z-0 pointer-events-none" />

      {/* Logo Section */}
      <div className="flex items-center mb-10 relative z-10">
        <div className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
          <span className="material-icons text-white text-2xl">restaurant</span>
        </div>
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-800 text-transparent bg-clip-text tracking-tight">
          FoodAdmin
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 relative z-10">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <li key={item.to} className="group transition-all duration-300">
                <Link
                  to={item.to}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-md scale-[1.03]`
                      : "text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-md"
                  }`}
                >
                  <span
                    className={`material-icons mr-3 text-lg transition-colors ${
                      isActive ? "text-white" : "text-indigo-500 group-hover:text-indigo-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>

                  {item.label === "Notifications" && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                      3
                    </span>
                  )}

                  {isActive && (
                    <span className="material-icons text-white ml-2 text-sm animate-bounce">chevron_right</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto pt-6 border-t border-indigo-100 relative z-10">
        <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 cursor-pointer hover:shadow-lg transition-all duration-300 group">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/40?img=3"
              alt="User avatar"
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-green-400 border-2 border-white rounded-full w-3 h-3 animate-ping-slow" />
            <span className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full w-3 h-3" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">John Smith</p>
            <p className="text-xs text-gray-500 group-hover:text-indigo-400">Admin</p>
          </div>
          <button className="ml-auto p-1 rounded-full hover:bg-indigo-200 text-gray-400 hover:text-indigo-600 transition-all duration-200 ease-in-out transform hover:scale-110">
            <span className="material-icons">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
