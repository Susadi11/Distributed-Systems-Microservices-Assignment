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
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";
// import Header from './components/Header';

const COLORS = ["#6366F1", "#06B6D4", "#10B981"];

function Home() {
  const [userDistribution, setUserDistribution] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [pendingRestaurantCount, setPendingRestaurantCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5555/auth/user-role-distribution"
        );
        setUserDistribution(res.data);
      } catch (error) {
        console.error("Failed to fetch user role distribution:", error);
      }
    };

    // Fetch monthly revenue data
    const fetchRevenueData = async () => {
      try {
        const res = await axios.get("http://localhost:5552/monthly-revenue");
        // Assuming the response contains an array like [{ month: 'Jan', revenue: 4000 }, ...]
        setRevenueData(res.data);
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      }
    };

    //Fetch restaurant count
    const fetchRestaurantCount = async () => {
      try {
        const res = await axios.get("http://localhost:5556/api/restaurants");
        const verifiedCount = res.data.data.verified.length;
        setRestaurantCount(verifiedCount);
        console.log("Verified restaurant count:", verifiedCount);
      } catch (error) {
        console.error("Failed to fetch restaurant count:", error);
      }
    };

    
    //Fetch restaurant count
    const fetchPendingRestaurantCount = async () => {
      try {
        const res = await axios.get("http://localhost:5556/api/restaurants");
        const pendingCount = res.data.data.pending.length;
        setPendingRestaurantCount(pendingCount);
        console.log("Pending restaurant count:", pendingCount);
      } catch (error) {
        console.error("Failed to fetch restaurant count:", error);
      }
    };

    //Fetch user count
    const fetchUserCount = async () => {
      try {
        const res = await axios.get("http://localhost:5555/auth/users");
        console.log("Full user response:", res.data);
    
        const totalUsers = res.data.length; // OR adjust this depending on what you see
        setUserCount(totalUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    //Fetch total transaction amount
    const fetchTotalTransaction = async () => {
      try {
        const res = await axios.get("http://localhost:5552/all-payments"); 
        setTotalTransaction(res.data.total);
        console.log("Total transaction amount:", res.data.total);
      } catch (error) {
        console.error("Failed to fetch total transaction amount:", error);
      }
    };
    
    
   

    fetchUserRoles();
    fetchRevenueData();
    fetchRestaurantCount();
    fetchPendingRestaurantCount();
    fetchUserCount();
    fetchTotalTransaction();
  }, []);

  return (
    <div className="space-y-6">
      {/* <Header/> */}
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Restaurants"
          value={restaurantCount}
          icon={<span className="material-icons">restaurant</span>}
          color="blue"
        />
        <StatsCard
          title="Pending Verifications"
          value={pendingRestaurantCount}
          icon={<span className="material-icons">assignment</span>}
          color="yellow"
        />
        <StatsCard
          title="Total Users"
          value={userCount}
          icon={<span className="material-icons">people</span>}
          color="green"
        />
        <StatsCard
          title="Revenue"
          value={totalTransaction}
          icon={<span className="material-icons">attach_money</span>}
          color="purple"
        />
      </div>


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Revenue Growth */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            User Role Distribution
          </h3>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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

export default Home;
