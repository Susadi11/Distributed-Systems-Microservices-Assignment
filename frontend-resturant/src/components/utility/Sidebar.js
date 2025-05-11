import React, { useState } from 'react';
import {
  Home,
  LayoutDashboard,
  ShoppingCart,
  PlusCircle,
  List,
  Bell,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const restaurantId = user?.restaurant?._id;

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 h-screen">
      <div className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Admin Panel</div>
      <ul className="space-y-2">
        {/* Dashboard */}
        <li className="group">
          <Link 
            to="/homepage" 
            className="flex items-center justify-between p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
          </Link>
        </li>

        {/* Orders */}
        {restaurantId && (
          <li className="group">
            <Link 
              to={`/restaurant/${restaurantId}/orders`} 
              className="flex items-center justify-between p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <span>Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </Link>
          </li>
        )}

{restaurantId && (
          <li className="group">
            <Link 
              to={`/restaurant/${restaurantId}/payments`} 
              className="flex items-center justify-between p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <span>Payments</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </Link>
          </li>
        )}

        {/* Add Product */}
        <li className="group">
          <Link 
            to="/menu/add" 
            className="flex items-center justify-between p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-5 h-5" />
              <span>Add Product</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
          </Link>
        </li>

        {/* Menu List */}
        <li className="group">
          <Link 
            to="/menu/list" 
            className="flex items-center justify-between p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <List className="w-5 h-5" />
              <span>Menu List</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
          </Link>
        </li>

       
        
        {/* Settings */}
        <li className="group">
          <Link 
            to="/settings" 
            className="flex items-center justify-between p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;