import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUtensils, FaShoppingBag, FaChartLine, FaStar, FaRegClock, FaMoneyBillWave } from 'react-icons/fa';
import DashboardNavBar from "../components/utility/DashboardNavBar";
import Sidebar from "../components/utility/Sidebar";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
    const { user } = useAuth(); // Get the user from auth context
    const restaurantId = user?.restaurant?._id;
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalPayments: 0,
        pendingPayments: 0,
        completedPayments: 0,
        avgPrepTime: '0 min'
    });
    
    // Function to format currency
    const formatCurrency = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };
    
    // Function to get time difference in minutes
    const getTimeDifference = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime || Date.now());
        const diffInMs = end - start;
        return Math.floor(diffInMs / (1000 * 60)); // Convert to minutes
    };
    
    // Function to calculate statistics from orders
    const calculateStats = (orderData) => {
        if (!orderData || orderData.length === 0) return;
        
        const totalAmount = orderData.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingAmount = orderData
            .filter(order => order.paymentStatus === 'pending')
            .reduce((sum, order) => sum + (order.total || 0), 0);
        const completedAmount = orderData
            .filter(order => order.paymentStatus === 'completed')
            .reduce((sum, order) => sum + (order.total || 0), 0);
        
        // Calculate average preparation time for orders with orderAccepted and orderReady timestamps
        const ordersWithPrepTime = orderData.filter(order => 
            order.orderAccepted && order.orderReady
        );
        
        let avgPrepTime = '0 min';
        if (ordersWithPrepTime.length > 0) {
            const totalPrepTimeMinutes = ordersWithPrepTime.reduce((total, order) => {
                return total + getTimeDifference(order.orderAccepted, order.orderReady);
            }, 0);
            avgPrepTime = `${Math.round(totalPrepTimeMinutes / ordersWithPrepTime.length)} min`;
        }
        
        setStats({
            totalOrders: orderData.length,
            totalPayments: totalAmount,
            pendingPayments: pendingAmount,
            completedPayments: completedAmount,
            avgPrepTime
        });
    };
    
    // Count items by name and return sorted array
    const getPopularItems = (orderData) => {
        const itemCounts = {};
        const itemRatings = {};
        let totalRatings = {};
        
        orderData.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const itemName = item.name || 'Unknown Item';
                    // Count occurrences
                    itemCounts[itemName] = (itemCounts[itemName] || 0) + (item.quantity || 1);
                    
                    // Track ratings if available
                    if (item.rating) {
                        itemRatings[itemName] = (itemRatings[itemName] || 0) + item.rating;
                        totalRatings[itemName] = (totalRatings[itemName] || 0) + 1;
                    }
                });
            }
        });
        
        // Convert to array and sort by count
        const popularItems = Object.keys(itemCounts).map(name => ({
            id: name,
            name: name,
            orders: itemCounts[name],
            rating: itemRatings[name] && totalRatings[name] 
                ? (itemRatings[name] / totalRatings[name]).toFixed(1) 
                : 4.5 // Default rating if none available
        }));
        
        // Sort by order count (highest first)
        return popularItems.sort((a, b) => b.orders - a.orders).slice(0, 4);
    };
    
    useEffect(() => {
        const fetchOrders = async () => {
            if (!restaurantId) {
                setError('Restaurant ID is missing');
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5559/orders/restaurant/${restaurantId}`);
                
                let orderData = [];
                if (response.data && response.data.orders) {
                    orderData = response.data.orders;
                } else if (Array.isArray(response.data)) {
                    orderData = response.data;
                }
                
                setOrders(orderData);
                calculateStats(orderData);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.response?.data?.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, [restaurantId]);
    
    // Get the 4 most recent orders
    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
        .map(order => ({
            id: order._id,
            customer: order.customer?.name || 'Guest Customer',
            items: order.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0,
            total: formatCurrency(order.total),
            status: order.status || 'Pending',
            time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    
    // Get popular foods
    const popularFoods = getPopularItems(orders);
    
    // Sample data for trending orders (this would ideally come from an analysis of order history)
    const trendingOrders = popularFoods.slice(0, 4).map(food => ({
        id: food.id,
        name: food.name,
        change: `+${Math.floor(Math.random() * 20) + 5}%` // Random percentage for demo
    }));

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
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-lg">Loading dashboard data...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-800">Welcome,</h2>
                                <p className="text-gray-600">Here's what's happening with your restaurant today</p>
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
                                        <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                                        <p className="text-green-500 text-sm">Updated today</p>
                                    </div>
                                </div>
                                
                                {/* Revenue */}
                                <div className="bg-white rounded-xl shadow p-6 flex items-center">
                                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                        <FaMoneyBillWave className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Total Revenue</p>
                                        <h3 className="text-2xl font-bold">{formatCurrency(stats.totalPayments)}</h3>
                                        <p className="text-green-500 text-sm">
                                            {formatCurrency(stats.completedPayments)} completed
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Popular Items */}
                                <div className="bg-white rounded-xl shadow p-6 flex items-center">
                                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                                        <FaStar className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Popular Items</p>
                                        <h3 className="text-2xl font-bold">{popularFoods.length}</h3>
                                        <p className="text-green-500 text-sm">
                                            {trendingOrders.length} trending
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Avg. Prep Time */}
                                <div className="bg-white rounded-xl shadow p-6 flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                                        <FaRegClock className="text-2xl" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Avg. Prep Time</p>
                                        <h3 className="text-2xl font-bold">{stats.avgPrepTime}</h3>
                                        <p className="text-gray-500 text-sm">Based on completed orders</p>
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
                                        {recentOrders.length > 0 ? (
                                            recentOrders.map(order => (
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
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                No recent orders found
                                            </div>
                                        )}
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
                                        {popularFoods.length > 0 ? (
                                            popularFoods.map(food => (
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
                                                            <p className="text-xs text-green-600 mt-1">Popular item</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                No popular foods found
                                            </div>
                                        )}
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
                                        <span>{new Date().toLocaleString('default', { month: 'long' })} 1</span>
                                        <span>{new Date().toLocaleString('default', { month: 'long' })} {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-gray-500">Total Revenue</p>
                                                <p className="text-2xl font-bold">{formatCurrency(stats.totalPayments)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-500">Pending</p>
                                                <p className="text-2xl font-bold text-yellow-500">{formatCurrency(stats.pendingPayments)}</p>
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
                                        {trendingOrders.length > 0 ? (
                                            trendingOrders.map(item => (
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
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                No trending items found
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                            View Full Trend Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default HomePage;