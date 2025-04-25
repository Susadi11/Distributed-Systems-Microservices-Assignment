import React from "react";

function Analytics() {
  return (
    <div className="h-full flex flex-col space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reports Dashboard</h1>
        <p className="text-gray-500">Generate and view detailed reports about restaurants and users.</p>
      </div>

      {/* Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Reports */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Restaurant Reports</h2>
          <ul className="space-y-3 text-gray-600 list-disc list-inside">
            <li>Verified vs Unverified Restaurants</li>
            <li>Restaurants by Category/Cuisine</li>
            <li>Top Rated Restaurants</li>
            <li>Monthly Registrations</li>
            <li>Revenue Contribution per Restaurant</li>
          </ul>
        </div>

        {/* User Reports */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Reports</h2>
          <ul className="space-y-3 text-gray-600 list-disc list-inside">
            <li>Active vs Inactive Users</li>
            <li>User Signups Over Time</li>
            <li>User Roles Breakdown (Admin, Moderator, User)</li>
            <li>Top Spenders</li>
            <li>Order Frequency by User</li>
          </ul>
        </div>
      </div>

      {/* Placeholder for Future Data Table or Export */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Generate Reports</h2>
        <p className="text-gray-600 mb-4">Click the button below to export or view full reports.</p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
          Export Reports
        </button>
      </div>
    </div>
  );
}

export default Analytics;
