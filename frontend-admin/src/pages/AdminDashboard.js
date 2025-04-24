import React, { useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { to: "dashboard", label: "Dashboard", icon: "dashboard", color: "from-purple-500 to-indigo-500" },
  { to: "verify-restaurants", label: "Verify Restaurants", icon: "verified", color: "from-emerald-500 to-teal-500" },
  { to: "users", label: "User Management", icon: "people", color: "from-amber-500 to-orange-500" },
  { to: "analytics", label: "Analytics", icon: "analytics", color: "from-fuchsia-500 to-pink-500" },
];

const AdminDashboard = () => {
  const location = useLocation();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sidebar */}
      <aside className="w-72 h-full bg-gradient-to-b from-indigo-50 to-white p-6 shadow-2xl flex flex-col border-r border-indigo-100 relative z-10">
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-60 backdrop-blur-md rounded-tr-3xl shadow-inner z-0 pointer-events-none" />

        {/* Logo Section */}
        <div className="flex items-center mb-10 relative z-10">
          <div className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
            <span className="material-icons text-white text-2xl">restaurant</span>
          </div>
           {/* Logo */}
           <div className="flex-shrink-0 pl-2">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                YUM YUM
                                <span className="font-light text-sm ml-1">&trade;</span>
                            </span>
                        </Link>
                    </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 relative z-10">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.to);

              return (
                <li key={item.to} className="group transition-all duration-300">
                  <NavLink
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

                    {isActive && (
                      <span className="material-icons text-white ml-2 text-sm animate-bounce">chevron_right</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-6 border-t border-indigo-100 relative z-10">
          <button
            onClick={() => {
              localStorage.removeItem("isAdmin");
              window.location.href = "/admin/login";
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-6 overflow-y-auto"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default AdminDashboard;
