import React from 'react';
import DashboardNavBar from '../components/utility/DashboardNavBar';
import { ShoppingCart, CheckCircle, Clock } from 'lucide-react';
import Sidebar from '../components/utility/Sidebar';

function HomePage() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <DashboardNavBar />
                <main className="p-6 bg-white dark:bg-gray-900 flex-1">
                    {/* Compact Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Orders Card */}
                        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-200 dark:bg-blue-900 dark:border-blue-700 dark:hover:bg-blue-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-full text-white">
                                    <ShoppingCart className="h-4 w-4" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-blue-900 dark:text-white">Total Orders</h5>
                                    <p className="text-xs text-blue-800 dark:text-blue-200">1,240</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Received Card */}
                        <div className="p-4 bg-green-100 border border-green-200 rounded-lg shadow-sm hover:bg-green-200 dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500 rounded-full text-white">
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-green-900 dark:text-white">Orders Received</h5>
                                    <p className="text-xs text-green-800 dark:text-green-200">980</p>
                                </div>
                            </div>
                        </div>

                        {/* Pending Orders Card */}
                        <div className="p-4 bg-yellow-100 border border-yellow-200 rounded-lg shadow-sm hover:bg-yellow-200 dark:bg-yellow-900 dark:border-yellow-700 dark:hover:bg-yellow-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500 rounded-full text-white">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-yellow-900 dark:text-white">Pending Orders</h5>
                                    <p className="text-xs text-yellow-800 dark:text-yellow-200">260</p>
                                </div>
                            </div>
                        </div>

                        {/* Cancelled Orders Card */}
                        <div className="p-4 bg-pink-100 border border-pink-200 rounded-lg shadow-sm hover:bg-pink-200 dark:bg-pink-900 dark:border-pink-700 dark:hover:bg-pink-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-500 rounded-full text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-pink-900 dark:text-white">Cancelled Orders</h5>
                                    <p className="text-xs text-pink-800 dark:text-pink-200">260</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Table - unchanged */}
                    <div className='mt-6'>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Order ID</th>
                                        <th scope="col" className="px-6 py-3">Customer Name</th>
                                        <th scope="col" className="px-6 py-3">Item category</th>
                                        <th scope="col" className="px-6 py-3">Order Items</th>
                                        <th scope="col" className="px-6 py-3">Order Status</th>
                                        <th scope="col" className="px-6 py-3">Total</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">#ORD1023</td>
                                        <td className="px-6 py-4">John Doe</td>
                                        <td className="px-6 py-4">5</td>
                                        <td className="px-6 py-4">Burger, Coke</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Pending</span>
                                        </td>
                                        <td className="px-6 py-4">$12.50</td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">#ORD1024</td>
                                        <td className="px-6 py-4">Jane Smith</td>
                                        <td className="px-6 py-4">2</td>
                                        <td className="px-6 py-4">Pizza, Lemonade</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Completed</span>
                                        </td>
                                        <td className="px-6 py-4">$18.00</td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                                        </td>
                                    </tr>
                                    <tr className="bg-white dark:bg-gray-800">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">#ORD1025</td>
                                        <td className="px-6 py-4">Alex Ray</td>
                                        <td className="px-6 py-4">7</td>
                                        <td className="px-6 py-4">Pasta, Water</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Cancelled</span>
                                        </td>
                                        <td className="px-6 py-4">$10.00</td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default HomePage;