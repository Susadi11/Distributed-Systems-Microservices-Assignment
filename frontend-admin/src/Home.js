import React from 'react';
import StatsCard from './components/StatsCard';
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

// Sample chart data
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 4600 },
  { name: "Mar", revenue: 5200 },
  { name: "Apr", revenue: 6100 },
  { name: "May", revenue: 6900 },
];



const COLORS = ["#6366F1", "#06B6D4", "#10B981"];

function Home() {
  const [userDistribution, setUserDistribution] = useState([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const res = await axios.get("http://localhost:5555/auth/user-role-distribution");
        setUserDistribution(res.data);
      } catch (error) {
        console.error("Failed to fetch user role distribution:", error);
      }
    };

    fetchUserRoles();
  }, []);

  return (
   
    <div className="space-y-6">
       {/* <Header/> */}
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Restaurants" 
          value="142" 
          icon={<span className="material-icons">restaurant</span>}
          color="blue"
        />
        <StatsCard 
          title="Pending Verifications" 
          value="12" 
          icon={<span className="material-icons">assignment</span>}
          color="yellow"
        />
        <StatsCard 
          title="Total Users" 
          value="2,843" 
          icon={<span className="material-icons">people</span>}
          color="green"
        />
        <StatsCard 
          title="Revenue" 
          value="$14,287" 
          icon={<span className="material-icons">attach_money</span>}
          color="purple"
        />
      </div>
      
      {/* Welcome Section */}
     

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

export default Home;
