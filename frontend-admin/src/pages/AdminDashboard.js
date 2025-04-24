import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-6 text-2xl font-extrabold text-center text-blue-600 tracking-wide">
            Admin Panel
          </div>
          <nav className="flex flex-col p-4 space-y-2 text-sm font-medium">
            {[
              { to: "dashboard", label: "Dashboard" },
              { to: "verify-restaurants", label: "Verify Restaurants" },
              { to: "users", label: "User Management" },
              { to: "analytics", label: "Analytics" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-colors duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              localStorage.removeItem("isAdmin");
              window.location.href = "/admin/login";
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200"
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
