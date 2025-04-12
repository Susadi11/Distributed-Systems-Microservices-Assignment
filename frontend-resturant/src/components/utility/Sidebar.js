import React from 'react';
import {
  Home,
  LayoutDashboard,
  Users,
  Mail,
  Settings,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 h-screen">
      <div className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Admin Panel</div>
      <ul className="space-y-4">
        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5" />
            <span>Home</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </li>

        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5" />
            <span>Orders</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </li>

        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5" />
            <span>Menu</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </li>

        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5" />
            <span>Payment</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </li>

        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            <span>Notification</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </li>

        <li className="flex items-center justify-between text-gray-700 dark:text-white hover:text-blue-500 cursor-pointer">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
