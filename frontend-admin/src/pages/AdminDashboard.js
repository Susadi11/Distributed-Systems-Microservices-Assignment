import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-2xl font-bold text-center text-gray-800">
          Admin Panel
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg hover:bg-blue-100 ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="verify-restaurants"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg hover:bg-blue-100 ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700"
              }`
            }
          >
            Verify Restaurants
          </NavLink>
          <NavLink
            to="users"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg hover:bg-blue-100 ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700"
              }`
            }
          >
            User Management
          </NavLink>
          <NavLink
            to="analytics"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg hover:bg-blue-100 ${
                isActive ? "bg-blue-500 text-white" : "text-gray-700"
              }`
            }
          >
            Analytics
          </NavLink>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            window.location.href = "/admin/login"; // force logout
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
