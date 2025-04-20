// src/Home.js
import React from 'react';
import StatsCard from './components/StatsCard';

function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
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
          title="Active Users" 
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to FoodAdmin</h2>
        <p className="text-gray-600">
          Manage your restaurant platform efficiently with our admin dashboard. 
          You can verify new restaurants, manage users, view analytics, and more.
        </p>
      </div>
    </div>
  );
}

export default Home;