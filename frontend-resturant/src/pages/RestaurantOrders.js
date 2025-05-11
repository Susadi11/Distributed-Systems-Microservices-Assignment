import React, { useState, useEffect } from 'react';
import DashboardNavBar from "../components/utility/DashboardNavBar";
import Sidebar from "../components/utility/Sidebar";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const statusColors = {
  'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
  'preparing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'ready_for_delivery': 'bg-purple-100 text-purple-800 border-purple-200',
  'out_for_delivery': 'bg-orange-100 text-orange-800 border-orange-200',
  'delivered': 'bg-green-100 text-green-800 border-green-200',
  'canceled': 'bg-red-100 text-red-800 border-red-200',
  'payment_pending': 'bg-gray-100 text-gray-800 border-gray-200'
};

const statusDisplayNames = {
  'confirmed': 'Confirmed',
  'preparing': 'Preparing',
  'ready_for_delivery': 'Ready for Delivery',
  'out_for_delivery': 'Out for Delivery',
  'delivered': 'Delivered',
  'canceled': 'Canceled',
  'payment_pending': 'Payment Pending'
};

const statusIcons = {
  'confirmed': '📝',
  'preparing': '👨‍🍳',
  'ready_for_delivery': '📦',
  'out_for_delivery': '🛵',
  'delivered': '✅',
  'canceled': '❌',
  'payment_pending': '💳'
};

const statusGroups = [
  {
    title: 'New Orders',
    statuses: ['confirmed', 'payment_pending'],
    emptyMessage: 'No new orders right now'
  },
  {
    title: 'Status',
    statuses: ['preparing', 'ready_for_delivery', 'out_for_delivery'],
    emptyMessage: 'No orders in progress'
  },
  {
    title: 'Completed',
    statuses: ['delivered', 'canceled'],
    emptyMessage: 'No completed orders yet'
  }
];

const RestaurantOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5559/orders/restaurant/${restaurantId}`);
        setOrders(response.data.orders || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        // Don't set error state for empty orders
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to fetch orders');
        } else {
          setOrders([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Set up polling every 30 seconds for real-time updates
    const intervalId = setInterval(fetchOrders, 30000);
    return () => clearInterval(intervalId);
  }, [restaurantId]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5559/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      (order.user?.name?.toLowerCase().includes(searchLower) || 
      order.userName?.toLowerCase().includes(searchLower)) ||
      order.items.some(item => item.name.toLowerCase().includes(searchLower))
    );
  });

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavBar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Restaurant Orders</h1>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            {error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                Error: {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="mx-auto w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Orders Yet</h3>
                <p className="text-gray-500">Your restaurant hasn't received any orders yet. They'll appear here when customers place orders.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {statusGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="flex flex-col">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sticky top-0 z-10">
                      <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                        <span className="mr-2">{groupIndex === 0 ? '🆕' : groupIndex === 1 ? '⏳' : '✅'}</span>
                        {group.title}
                        <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {filteredOrders.filter(order => group.statuses.includes(order.status)).length}
                        </span>
                      </h2>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      {filteredOrders
                        .filter(order => group.statuses.includes(order.status))
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map(order => (
                          <div key={order._id} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${statusColors[order.status].split(' ')[2]}`}>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center">
                                    <span className="mr-2">{statusIcons[order.status]}</span>
                                    <h3 className="text-sm font-semibold text-gray-800">
                                      Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                                    </h3>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(order.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                  {statusDisplayNames[order.status]}
                                </span>
                              </div>

                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700">
                                  {order.user?.name || order.userName || 'Guest'}
                                </p>
                                {order.deliveryAddress && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    <p className="flex items-start">
                                      <span className="mr-1">🏠</span>
                                      {order.deliveryAddress.street && (
                                        <span>{order.deliveryAddress.street}</span>
                                      )}
                                    </p>
                                    {order.deliveryAddress.description && (
                                      <p className="text-gray-400 mt-0.5">
                                        {order.deliveryAddress.description}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="border-t border-gray-100 pt-3">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                  Items ({order.items.length})
                                </h4>
                                <ul className="space-y-2">
                                  {order.items.map((item, index) => (
                                    <li key={index} className="flex justify-between text-sm">
                                      <span className="text-gray-700">
                                        {item.quantity} × {item.name}
                                        {item.specialInstructions && (
                                          <p className="text-xs text-gray-400 mt-0.5">
                                            Note: {item.specialInstructions}
                                          </p>
                                        )}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="border-t border-gray-100 pt-3 mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Subtotal:</span>
                                  <span className="text-gray-800">${order.subtotal?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Service Fee:</span>
                                  <span className="text-gray-800">${order.serviceFee?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold mt-2">
                                  <span className="text-gray-800">Total:</span>
                                  <span className="text-gray-900">${order.total?.toFixed(2) || '0.00'}</span>
                                </div>
                              </div>
                            </div>

                            {!['delivered', 'canceled'].includes(order.status) && (
                              <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row justify-end gap-2">
                                {order.status === 'confirmed' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(order._id, 'preparing')}
                                      className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                    >
                                      Start Preparing
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(order._id, 'canceled')}
                                      className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                                    >
                                      Cancel Order
                                    </button>
                                  </>
                                )}
                                {order.status === 'preparing' && (
                                  <button
                                    onClick={() => handleStatusChange(order._id, 'ready_for_delivery')}
                                    className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                                  >
                                    Mark as Ready
                                  </button>
                                )}
                                {order.status === 'ready_for_delivery' && (
                                  <button
                                    onClick={() => handleStatusChange(order._id, 'out_for_delivery')}
                                    className="px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition"
                                  >
                                    Out for Delivery
                                  </button>
                                )}
                                {order.status === 'out_for_delivery' && (
                                  <button
                                    onClick={() => handleStatusChange(order._id, 'delivered')}
                                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                                  >
                                    Mark as Delivered
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                      {filteredOrders.filter(order => group.statuses.includes(order.status)).length === 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                          <p className="text-gray-400">{group.emptyMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantOrders;