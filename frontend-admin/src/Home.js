import React from "react";
import StatsCard from "./components/StatsCard";
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
  BarChart,
  Bar
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";
import { 
  Hotel,
  Clock, 
  Users, 
  DollarSign,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const COLORS = ["#6366F1", "#06B6D4", "#10B981", "#F59E0B", "#EC4899"];

function Home() {
  const [userDistribution, setUserDistribution] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [pendingRestaurantCount, setPendingRestaurantCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [
          userRolesRes,
          revenueRes,
          restaurantsRes,
          usersRes,
          paymentsRes
        ] = await Promise.all([
          axios.get("http://localhost:5555/auth/user-role-distribution"),
          axios.get("http://localhost:5552/monthly-revenue"),
          axios.get("http://localhost:5556/api/restaurants"),
          axios.get("http://localhost:5555/auth/users"),
          axios.get("http://localhost:5552/all-payments")
        ]);

        setUserDistribution(userRolesRes.data);
        setRevenueData(revenueRes.data);
        setRestaurantCount(restaurantsRes.data.data.verified.length);
        setPendingRestaurantCount(restaurantsRes.data.data.pending.length);
        setUserCount(usersRes.data.length);
        setTotalTransaction(paymentsRes.data.total);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate revenue growth percentage
  const revenueGrowth = revenueData.length > 1 
    ? ((revenueData[revenueData.length - 1].revenue - revenueData[revenueData.length - 2].revenue) / 
       revenueData[revenueData.length - 2].revenue) * 100
    : 0;

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Key metrics and performance indicators</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards Row - Larger Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Verified Restaurants"
          value={restaurantCount}
          icon={<Hotel className="h-8 w-8" />}
          color="blue"
          trend={restaurantCount > 0 ? "up" : "neutral"}
          trendValue="12%"
          className="h-full"
        />
        <StatsCard
          title="Pending Verifications"
          value={pendingRestaurantCount}
          icon={<Clock className="h-8 w-8" />}
          color="yellow"
          trend={pendingRestaurantCount > 0 ? "up" : "neutral"}
          trendValue={`${pendingRestaurantCount > 0 ? "+" : ""}${pendingRestaurantCount}`}
          className="h-full"
        />
        <StatsCard
          title="Total Users"
          value={userCount}
          icon={<Users className="h-8 w-8" />}
          color="green"
          trend="up"
          trendValue="8%"
          className="h-full"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${(totalTransaction / 100).toLocaleString()}`}
          icon={<DollarSign className="h-8 w-8" />}
          color="purple"
          trend={revenueGrowth >= 0 ? "up" : "down"}
          trendValue={`${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth.toFixed(1)}%`}
          className="h-full"
        />
      </div>

      {/* Charts Section - Taller Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Revenue Growth */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Revenue Growth
            </h3>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${
                revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {revenueGrowth >= 0 ? (
                  <ArrowUp className="inline h-4 w-4" />
                ) : (
                  <ArrowDown className="inline h-4 w-4" />
                )}
                {Math.abs(revenueGrowth).toFixed(1)}% vs last month
              </span>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280' }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            User Role Distribution
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  innerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                 
                >
                  {userDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={(value, entry, index) => (
                    <span className="text-gray-600">
                      {value} ({userDistribution[index]?.value})
                    </span>
                  )}
                />
                <Tooltip 
                  formatter={(value, name, props) => [
                    value,
                    `${name} (${((props.payload.percent) * 100).toFixed(1)}%)`
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Bar Chart Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Monthly Revenue Breakdown
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280' }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Bar
                dataKey="revenue"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Home;