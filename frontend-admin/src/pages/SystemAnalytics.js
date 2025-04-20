// src/pages/SystemAnalytics.js
import React from 'react';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CreditCardIcon, 
  TruckIcon 
} from '@heroicons/react/outline';
import StatsCard from '../components/StatsCard';

const SystemAnalytics = () => {
  // Sample data - in a real app, this would come from the backend
  const analyticsData = {
    totalUsers: 5432,
    totalRestaurants: 142,
    totalOrders: 12567,
    totalRevenue: "₹1,254,890",
    recentOrders: [
      { id: 1, customer: "John Doe", restaurant: "Pizza Palace", amount: "₹450", status: "Delivered" },
      { id: 2, customer: "Jane Smith", restaurant: "Burger King", amount: "₹320", status: "In Transit" },
      { id: 3, customer: "Mike Johnson", restaurant: "Taco Bell", amount: "₹280", status: "Processing" },
      { id: 4, customer: "Sara Williams", restaurant: "KFC", amount: "₹550", status: "Delivered" },
      { id: 5, customer: "Robert Brown", restaurant: "McDonald's", amount: "₹410", status: "Delivered" }
    ],
    userGrowth: [58, 65, 80, 95, 115, 138, 152, 180, 210, 242, 265, 280],
    monthlyRevenue: [
      { month: "Jan", amount: 85000 },
      { month: "Feb", amount: 92000 },
      { month: "Mar", amount: 98000 },
      { month: "Apr", amount: 105000 },
      { month: "May", amount: 112000 },
      { month: "Jun", amount: 118000 },
      { month: "Jul", amount: 125000 },
      { month: "Aug", amount: 130000 },
      { month: "Sep", amount: 136000 },
      { month: "Oct", amount: 142000 },
      { month: "Nov", amount: 148000 },
      { month: "Dec", amount: 155000 }
    ]
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">System Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Users" 
            value={analyticsData.totalUsers} 
            icon={<UsersIcon className="w-6 h-6" />} 
            color="blue"
          />
          <StatsCard 
            title="Total Restaurants" 
            value={analyticsData.totalRestaurants} 
            icon={<ShoppingBagIcon className="w-6 h-6" />} 
            color="green"
          />
          <StatsCard 
            title="Total Orders" 
            value={analyticsData.totalOrders} 
            icon={<TruckIcon className="w-6 h-6" />} 
            color="yellow"
          />
          <StatsCard 
            title="Total Revenue" 
            value={analyticsData.totalRevenue} 
            icon={<CreditCardIcon className="w-6 h-6" />} 
            color="purple"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.monthlyRevenue.map((item) => {
              const height = (item.amount / 155000) * 100;
              return (
                <div key={item.month} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs mt-2">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">User Growth</h3>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.userGrowth.map((count, index) => {
              const height = (count / 280) * 100;
              const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs mt-2">{months[index]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.restaurant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'In Transit' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'}`
                    }>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;