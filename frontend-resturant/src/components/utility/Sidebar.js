import React, { useState } from 'react';
import {
  Home,
  LayoutDashboard,
  Users,
  Mail,
  Settings,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 h-screen">
      <div className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Admin Panel</div>
      <ul className="space-y-4">

        {/* Dashboard */}
        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <Link to="/" className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5" />
            <span>Home</span>
          </Link>
        </li>

        {/* Orders */}
        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <Link to="/orders" className="flex items-center gap-3">
            <Home className="w-5 h-5" />
            <span>Orders</span>
          </Link>
        </li>

        {/* Menu with Subitems */}
        <li className="text-gray-700 dark:text-white">
          <div
            className="flex items-center justify-between hover:text-blue-500 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5" />
              <span>Menu</span>
            </div>
            {menuOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>

          {menuOpen && (
            <ul className="ml-8 mt-2 space-y-2 text-sm">
              <li>
                <Link to="/menu/catalog" className="hover:text-blue-400 block">
                  Menu Catalog
                </Link>
              </li>
              <li>
                <Link to="/menu/list" className="hover:text-blue-400 block">
                  Menu List
                </Link>
              </li>
              <li>
                <Link to="/menu/add" className="hover:text-blue-400 block">
                  Add Product
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Payment */}
        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <Link to="/payments" className="flex items-center gap-3">
            <Users className="w-5 h-5" />
            <span>Payment</span>
          </Link>
        </li>

        {/* Notifications */}
        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <Link to="/notifications" className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            <span>Notification</span>
          </Link>
        </li>

        {/* Settings */}
        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <Link to="/settings" className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </li>

         {/* Settings */}
         <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <Link to="/register" className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <span>Register Restaurant</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
