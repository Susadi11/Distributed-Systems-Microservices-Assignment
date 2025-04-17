// src/components/Orders.js
import React from 'react';
import { CheckCircle, XCircle, ChevronRight, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import food6 from '../images/food6.jpeg';

const Orders = () => {
    const navigate = useNavigate();

    // Sample past orders data
    const pastOrders = [
        {
            id: '7G203',
            restaurant: 'Green Cabin OGF',
            date: '2025-04-03T10:15:00',
            status: 'Cancelled',
            items: [
                { name: 'Chocolate Mousse Cake Slice', price: 650.00, image: food6, quantity: 2 }
            ],
            total: 0.00,
            cancellationReason: 'Out of stock',
            paymentMethod: 'Cash on Delivery'
        },
        {
            id: '4D891',
            restaurant: 'The Pizza Company - Mount Lavinia',
            date: '2025-03-28T19:30:00',
            status: 'Completed',
            items: [
                { name: 'Large Pepperoni Pizza (Thin Crust)', price: 1200.00, image: food6, quantity: 1 },
                { name: 'Garlic Bread with Cheese', price: 350.00, image: food6, quantity: 1 }
            ],
            total: 1550.00,
            deliveryPerson: 'A. Perera',
            paymentMethod: 'Debit Card'
        }
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:px-6 lg:px-12 xl:px-20 py-6 md:py-12">
            {/* "My Orders" header */}


            {/* Order cards (modern, clean layout) */}
            <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">

                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 mt-20 ml-2">My Orders</h1>

                {pastOrders.length > 0 ? (
                    pastOrders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="bg-white rounded-xl md:rounded-3xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex justify-between items-start px-2 md:px-4">
                                <div>
                                    <h3 className="font-medium text-gray-900 text-sm md:text-base">{order.restaurant}</h3>
                                    <div className="flex items-center mt-1 text-xs md:text-sm text-gray-500">
                                        {order.status === 'Completed' ? (
                                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1"/>
                                        ) : (
                                            <XCircle className="w-3 h-3 md:w-4 md:h-4 text-red-500 mr-1"/>
                                        )}
                                        {formatDate(order.date)}
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400"/>
                            </div>

                            {/* Order items preview */}
                            <div className="mt-2 md:mt-3 flex items-center px-2 md:px-4">
                                <div
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-gray-100 overflow-hidden mr-2 md:mr-3 flex-shrink-0">
                                    <img
                                        src={order.items[0].image}
                                        alt={order.items[0].name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs md:text-sm font-medium truncate">
                                        {order.items[0].quantity} × {order.items[0].name}
                                    </p>
                                    {order.items.length > 1 && (
                                        <p className="text-xs text-gray-500">
                                            +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Order footer (payment & total) */}
                            <div
                                className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100 flex justify-between px-2 md:px-4">
                                <div className="flex items-center text-xs md:text-sm text-gray-600">
                                    <CreditCard className="w-3 h-3 md:w-4 md:h-4 mr-1"/>
                                    {order.paymentMethod}
                                </div>
                                <p className="font-medium text-xs md:text-sm">LKR {order.total.toFixed(2)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 md:py-12">
                        <Clock className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4"/>
                        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No past orders</h3>
                        <p className="text-sm text-gray-500 mb-4">Your completed orders will appear here.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                        >
                            Start Ordering
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;