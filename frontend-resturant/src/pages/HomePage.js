import React from 'react';
import { FaUtensils, FaShoppingBag, FaChartLine, FaStar, FaRegClock, FaMoneyBillWave } from 'react-icons/fa';
import DashboardNavBar from "../components/utility/DashboardNavBar";
import Sidebar from "../components/utility/Sidebar";

const HomePage = () => {
    // Sample data
    const recentOrders = [
        { id: 1, customer: "John Doe", items: 3, total: "$45.20", status: "Delivered", time: "12:30 PM" },
        { id: 2, customer: "Jane Smith", items: 2, total: "$28.50", status: "Preparing", time: "12:45 PM" },
        { id: 3, customer: "Mike Johnson", items: 5, total: "$72.80", status: "Pending", time: "1:15 PM" },
        { id: 4, customer: "Sarah Williams", items: 1, total: "$15.00", status: "Delivered", time: "1:30 PM" }
    ];

    const popularFoods = [
        { id: 1, name: "Margherita Pizza", orders: 124, rating: 4.8 },
        { id: 2, name: "Spaghetti Carbonara", orders: 98, rating: 4.7 },
        { id: 3, name: "Chicken Burger", orders: 87, rating: 4.5 },
        { id: 4, name: "Caesar Salad", orders: 76, rating: 4.6 }
    ];

    const trendingOrders = [
        { id: 1, name: "Pepperoni Pizza", change: "+24%" },
        { id: 2, name: "Vegan Burger", change: "+18%" },
        { id: 3, name: "Truffle Pasta", change: "+15%" },
        { id: 4, name: "Iced Coffee", change: "+12%" }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Dashboard Navbar */}
                <DashboardNavBar />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome, Anny!</h2>
                      
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Orders */}
                        <div className="bg-white rounded-xl shadow p-6 flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <FaShoppingBag className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-500">Total Orders</p>
                                <h3 className="text-2xl font-bold">342</h3>
                                <p className="text-green-500 text-sm">+12% from yesterday</p>
                            </div>
                        </div>
                        
                        {/* Revenue */}
                        <div className="bg-white rounded-xl shadow p-6 flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                <FaMoneyBillWave className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-500">Today's Revenue</p>
                                <h3 className="text-2xl font-bold">$2,845</h3>
                                <p className="text-green-500 text-sm">+8% from yesterday</p>
                            </div>
                        </div>
                        
                        {/* Popular Items */}
                        <div className="bg-white rounded-xl shadow p-6 flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                                <FaStar className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-500">Popular Items</p>
                                <h3 className="text-2xl font-bold">24</h3>
                                <p className="text-green-500 text-sm">3 new trending</p>
                            </div>
                        </div>
                        
                        {/* Avg. Prep Time */}
                        <div className="bg-white rounded-xl shadow p-6 flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                                <FaRegClock className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-gray-500">Avg. Prep Time</p>
                                <h3 className="text-2xl font-bold">18 min</h3>
                                <p className="text-red-500 text-sm">+2 min from avg.</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Recent Orders and Popular Foods */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Recent Orders */}
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <FaShoppingBag className="mr-2 text-blue-600" />
                                    Recent Orders
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {recentOrders.map(order => (
                                    <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">{order.customer}</h3>
                                                <p className="text-sm text-gray-500">{order.items} items • {order.total}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                                    order.status === "Preparing" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-gray-100 text-gray-800"
                                                }`}>
                                                    {order.status}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-50 text-center">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View All Orders
                                </button>
                            </div>
                        </div>
                        
                        {/* Popular Foods */}
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <FaUtensils className="mr-2 text-red-600" />
                                    Popular Foods
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {popularFoods.map(food => (
                                    <div key={food.id} className="p-4 hover:bg-gray-50 transition">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">{food.name}</h3>
                                                <div className="flex items-center mt-1">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar 
                                                                key={i} 
                                                                className={`${i < Math.floor(food.rating) ? 'fill-current' : 'fill-gray-300'} w-3 h-3`} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-1">{food.rating}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{food.orders} orders</p>
                                                <p className="text-xs text-green-600 mt-1">+12% this week</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-50 text-center">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View Menu Analytics
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Monthly Revenue and Trending Orders */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Revenue */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <FaChartLine className="mr-2 text-green-600" />
                                    Monthly Revenue
                                </h2>
                                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                                    <option>This Month</option>
                                    <option>Last Month</option>
                                    <option>Last 3 Months</option>
                                </select>
                            </div>
                            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                                {/* Chart placeholder */}
                                <p className="text-gray-400">Revenue chart will appear here</p>
                            </div>
                            <div className="mt-4 flex justify-between text-sm text-gray-600">
                                <span>June 1</span>
                                <span>June 30</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-gray-500">Total Revenue</p>
                                        <p className="text-2xl font-bold">$12,845</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500">Change</p>
                                        <p className="text-2xl font-bold text-green-500">+18%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Trending Orders */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
                                <FaChartLine className="mr-2 text-purple-600" />
                                Trending Orders
                            </h2>
                            <div className="space-y-4">
                                {trendingOrders.map(item => (
                                    <div key={item.id} className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                                            <FaUtensils className="text-lg" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div 
                                                    className="bg-purple-600 h-2 rounded-full" 
                                                    style={{ width: item.change }}
                                                ></div>
                                            </div>
                                        </div>
                                        <span className="text-purple-600 font-medium ml-4">{item.change}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                    View Full Trend Report
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomePage;