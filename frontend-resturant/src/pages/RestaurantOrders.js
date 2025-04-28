import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRestaurantOrders, updateOrderStatus } from '../api/Axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardNavBar from "../components/utility/DashboardNavBar";
import Sidebar from "../components/utility/Sidebar";

const statusOptions = {
  'confirmed': ['preparing', 'canceled'],
  'preparing': ['picked-up', 'canceled'],
  'picked-up': ['delivered'],
  'delivered': [],
  'canceled': []
};

const statusColors = {
  'confirmed': 'bg-blue-100 text-blue-800',
  'preparing': 'bg-yellow-100 text-yellow-800',
  'picked-up': 'bg-purple-100 text-purple-800',
  'delivered': 'bg-green-100 text-green-800',
  'canceled': 'bg-red-100 text-red-800'
};

const RestaurantOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getRestaurantOrders(statusFilter);
      
      if (response && response.orders) {
        setOrders(response.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'resturant_admin') {
      fetchOrders();
    }
  }, [user, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavBar setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavBar setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <div className="text-center py-8 text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavBar setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Restaurant Orders</h1>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter:</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Orders</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="picked-up">Picked Up</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">There are currently no orders matching your criteria.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.userName} • {order.user?.phone || 'No phone'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          {order.status.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="border-t border-b border-gray-100 py-4 my-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span className="text-gray-800">{item.quantity}x {item.name}</span>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>

                      {order.status !== 'delivered' && order.status !== 'canceled' && (
                        <div className="mt-4">
                          <select
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          >
                            <option value="">Update Status</option>
                            {statusOptions[order.status]?.map(option => (
                              <option key={option} value={option}>
                                Mark as {option.replace('-', ' ')}
                              </option>
                            ))}
                          </select>
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