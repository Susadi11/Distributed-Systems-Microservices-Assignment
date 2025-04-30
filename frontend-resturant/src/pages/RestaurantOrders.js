import React, { useState, useEffect } from 'react';
import DashboardNavBar from "../components/utility/DashboardNavBar";
import Sidebar from "../components/utility/Sidebar";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const statusColors = {
  'confirmed': 'bg-blue-100 text-blue-700',
  'preparing': 'bg-yellow-100 text-yellow-700',
  'ready_for_delivery': 'bg-purple-100 text-purple-700',
  'out_for_delivery': 'bg-orange-100 text-orange-700',
  'delivered': 'bg-green-100 text-green-700',
  'canceled': 'bg-red-100 text-red-700',
  'payment_pending': 'bg-gray-100 text-gray-700'
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

const RestaurantOrders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5559/orders/restaurant/${restaurantId}`);
        setOrders(response.data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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

  const statusGroups = [
    ['confirmed', 'payment_pending'],
    ['preparing', 'ready_for_delivery', 'out_for_delivery'],
    ['delivered', 'canceled']
  ];

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavBar setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Restaurant Orders</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statusGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex flex-col h-full">
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {groupIndex === 0 ? 'New Orders' :
                            groupIndex === 1 ? 'Completed' : 'Canceled'}
                      </h2>
                      <div className="flex flex-col gap-4 flex-grow">
                        {orders
                            .filter(order => group.includes(order.status))
                            .map(order => (
                                <div key={order._id} className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between h-[450px] hover:shadow-2xl transition duration-300">
                                  {/* Header */}
                                  <div>
                                    <div className="flex justify-between items-center mb-4">
                                      <div>
                                        <h3 className="text-md font-bold text-gray-800">Order #{order._id}</h3>
                                        <p className="text-sm text-gray-500">
                                          {order.user?.name || order.userName}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                                {statusDisplayNames[order.status]}
                              </span>
                                    </div>

                                    {/* Items */}
                                    <div className="bg-gray-100 rounded-lg p-3 mb-4">
                                      <h4 className="text-sm font-semibold text-gray-600 mb-2">Items</h4>
                                      <ul className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <li key={index} className="flex justify-between text-sm text-gray-700">
                                              <span>{item.quantity}x {item.name}</span>
                                              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                      <div>
                                        <p className="text-gray-500">Subtotal:</p>
                                        <p className="text-gray-500">Service Fee:</p>
                                        <p className="font-bold text-gray-800 mt-1">Total:</p>
                                      </div>
                                      <div className="text-right">
                                        <p>${order.subtotal?.toFixed(2) || '0.00'}</p>
                                        <p>${order.serviceFee?.toFixed(2) || '0.00'}</p>
                                        <p className="font-bold text-gray-800 mt-1">${order.total?.toFixed(2) || '0.00'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  {!['delivered', 'canceled'].includes(order.status) && (
                                      <div className="flex flex-col gap-2">
                                        {order.status === 'confirmed' && (
                                            <>
                                              <button
                                                  onClick={() => handleStatusChange(order._id, 'preparing')}
                                                  className="w-full px-3 py-2 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                              >
                                                Completed
                                              </button>
                                              <button
                                                  onClick={() => handleStatusChange(order._id, 'canceled')}
                                                  className="w-full px-3 py-2 text-xs rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                                              >
                                                Cancel Order
                                              </button>
                                            </>
                                        )}
                                        {order.status === 'preparing' && (
                                            <button
                                                onClick={() => handleStatusChange(order._id, 'ready_for_delivery')}
                                                className="w-full px-3 py-2 text-xs rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                                            >
                                              Mark as Ready
                                            </button>
                                        )}
                                      </div>
                                  )}
                                </div>
                            ))}

                        {orders.filter(order => group.includes(order.status)).length === 0 && (
                            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
                              No orders in this category
                            </div>
                        )}
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
  );
};

export default RestaurantOrders;