import React from "react";

const users = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    role: "User",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 3,
    name: "Emily Johnson",
    email: "emily@example.com",
    role: "Moderator",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
];

function UserManagement() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500">Manage all registered users and their roles.</p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Add User
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-indigo-50 text-gray-600 text-left text-sm font-medium">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-semibold text-gray-800">{user.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-800 transition">
                    <span className="material-icons text-base">edit</span>
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition">
                    <span className="material-icons text-base">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
