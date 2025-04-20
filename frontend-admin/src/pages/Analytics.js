import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 4600 },
  { name: "Mar", revenue: 5200 },
  { name: "Apr", revenue: 6100 },
  { name: "May", revenue: 6900 },
];

const userDistribution = [
  { name: "Admins", value: 8 },
  { name: "Moderators", value: 12 },
  { name: "Users", value: 280 },
];

const COLORS = ["#6366F1", "#06B6D4", "#10B981"];

function Analytics() {
  return (
    <div className="p-6 md:p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Analytics Overview</h1>
        <p className="text-gray-500">Insights into revenue and user activity.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-gray-500 text-sm">Monthly Revenue</h2>
          <p className="text-2xl font-bold text-gray-800 mt-1">$6,900</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-gray-500 text-sm">Total Orders</h2>
          <p className="text-2xl font-bold text-gray-800 mt-1">1,242</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-gray-500 text-sm">Active Users</h2>
          <p className="text-2xl font-bold text-gray-800 mt-1">2,843</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-gray-500 text-sm">New Signups</h2>
          <p className="text-2xl font-bold text-gray-800 mt-1">137</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366F1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
