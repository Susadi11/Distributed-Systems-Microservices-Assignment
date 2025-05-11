import React, { useState, useEffect } from 'react';
import DashboardNavBar from "../components/utility/DashboardNavBar";
import Sidebar from "../components/utility/Sidebar";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RestaurantPayments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalPayments: 0,
    pendingPayments: 0
  });
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const { restaurantId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Use the existing orders endpoint instead of the payments endpoint
        const response = await axios.get(`http://localhost:5559/orders/restaurant/${restaurantId}`);
        
        // Check if the response has the expected structure and filter orders with payment info
        if (response.data && response.data.orders) {
          const ordersWithPayments = response.data.orders.filter(order => order.paymentMethod);
          setOrders(ordersWithPayments);
        } else if (Array.isArray(response.data)) {
          // If response data is directly an array of orders
          const ordersWithPayments = response.data.filter(order => order.paymentMethod);
          setOrders(ordersWithPayments);
        } else {
          console.warn('Unexpected response format:', response.data);
          setOrders([]);
        }
        
        // Calculate payment statistics after setting orders
        calculateStats();
      } catch (err) {
        console.error('Error fetching orders with payment info:', err);
        setError(err.response?.data?.message || 'Failed to fetch payment information');
      } finally {
        setLoading(false);
      }
    };

    const calculateStats = () => {
      // Only calculate if we have orders
      if (orders.length > 0) {
        const totalAmount = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingAmount = orders
          .filter(order => order.paymentStatus === 'pending')
          .reduce((sum, order) => sum + (order.total || 0), 0);
        const completedAmount = orders
          .filter(order => order.paymentStatus === 'completed')
          .reduce((sum, order) => sum + (order.total || 0), 0);
          
        setStats({
          totalOrders: orders.length,
          totalPayments: totalAmount,
          pendingPayments: pendingAmount,
          completedPayments: completedAmount
        });
      }
    };

    if (restaurantId) {
      fetchOrders();
    } else {
      setError('Restaurant ID is missing');
      setLoading(false);
    }
  }, [restaurantId]);

  // Recalculate stats when orders or filter changes
  useEffect(() => {
    if (orders.length > 0) {
      const totalAmount = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingAmount = orders
        .filter(order => order.paymentStatus === 'pending')
        .reduce((sum, order) => sum + (order.total || 0), 0);
      const completedAmount = orders
        .filter(order => order.paymentStatus === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0);
        
      setStats({
        totalOrders: orders.length,
        totalPayments: totalAmount,
        pendingPayments: pendingAmount,
        completedPayments: completedAmount
      });
    }
  }, [orders]);

  const paymentStatusColors = {
    'completed': 'bg-green-100 text-green-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'failed': 'bg-red-100 text-red-700',
    'refunded': 'bg-blue-100 text-blue-700'
  };

  const paymentStatusDisplayNames = {
    'completed': 'Completed',
    'pending': 'Pending',
    'failed': 'Failed',
    'refunded': 'Refunded'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.paymentStatus === filter);

  // Handle loading and error states
  if (loading) return <div className="flex h-screen items-center justify-center">Loading payment information...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavBar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Restaurant Payments</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500 text-sm mb-1">Total Orders with Payments</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-gray-800">${stats.totalPayments.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500 text-sm mb-1">Pending Payments</p>
                <p className="text-3xl font-bold text-gray-800">${stats.pendingPayments.toFixed(2)}</p>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                All Payments
              </button>
              <button 
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Pending
              </button>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                            <a href={`/orders/${order._id}`}>
                              {order._id.substring(0, 8)}...
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.userName || (order.user && order.user.name) || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{order.phoneNumber || (order.user && order.user.phone) || ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.paymentId ? order.paymentId.substring(0, 12) + '...' : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                              {paymentStatusDisplayNames[order.paymentStatus] || order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {order.paymentMethod}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          No payment records found for this filter
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantPayments;