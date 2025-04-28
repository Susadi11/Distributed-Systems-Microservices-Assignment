import React, { useEffect, useState } from "react";
import axios from "axios";

// Small reusable Detail component
const Detail = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-medium text-gray-800">{value ?? "—"}</p>
  </div>
);

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // Role filter state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewedUser, setViewedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/auth/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => (roleFilter ? user.role === roleFilter : true)); // Filter by role

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/auth/auth/users/${selectedUser._id}`
      );
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete user:", error.message);
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditedUser({ name: user.name, email: user.email, role: user.role });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5555/auth/users/${selectedUser._id}`,
        editedUser
      );
      setUsers(
        users.map((u) => (u._id === selectedUser._id ? res.data.user : u))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Update failed:", error.message);
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500">
          Manage all registered users and their roles.
        </p>
      </div>

      {/* Search and Role Filter */}
      <div className="flex justify-between items-center space-x-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Roles</option>
          <option value="customer">customer</option>
          <option value="delivery_personnel">delivery_personnel</option>
          <option value="resturant_admin">resturant_admin</option>
        </select>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-indigo-50 text-gray-600 text-left text-sm font-medium">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={user._id}
                className="border-b border-gray-100 hover:bg-indigo-50 transition cursor-pointer"
                onClick={() => setViewedUser(user)}
              >
                <td className="px-6 py-4 text-gray-500 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img
                    src={`https://i.pravatar.cc/150?u=${user._id}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-semibold text-gray-800">
                    {user.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 transition"
                    onClick={() => handleEdit(user)}
                  >
                    <span className="material-icons text-base">edit</span>
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => confirmDelete(user)}
                  >
                    <span className="material-icons text-base">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewedUser && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            User Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Detail label="Name" value={viewedUser.name} />
            <Detail label="Email" value={viewedUser.email} />
            <Detail label="Phone" value={viewedUser.phone} />
            <Detail label="Address" value={viewedUser.address} />
            
            <Detail
              label="Role"
              value={viewedUser.role}
              customClass="capitalize bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md inline-block"
            />
            <Detail
              label="Created At"
              value={new Date(viewedUser.createdAt).toLocaleString()}
            />
            <Detail
              label="Last Updated"
              value={new Date(viewedUser.updatedAt).toLocaleString()}
            />

            {viewedUser.role === "delivery_personnel" &&
              viewedUser.deliveryPersonnelDetails && (
                <>
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Delivery Personnel Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Detail
                        label="Vehicle Type"
                        value={viewedUser.deliveryPersonnelDetails.vehicleType}
                      />
                      <Detail
                        label="Vehicle Number"
                        value={
                          viewedUser.deliveryPersonnelDetails.vehicleNumber
                        }
                      />
                      <Detail
                        label="Make"
                        value={viewedUser.deliveryPersonnelDetails.Make}
                      />
                      <Detail
                        label="Model"
                        value={viewedUser.deliveryPersonnelDetails.Model}
                      />
                      <Detail
                        label="Year"
                        value={viewedUser.deliveryPersonnelDetails.year}
                      />
                      <Detail
                        label="Driver License"
                        value={
                          viewedUser.deliveryPersonnelDetails.DriverLicense
                        }
                      />
                      <Detail
                        label="Latitude"
                        value={viewedUser.deliveryPersonnelDetails.latitude}
                      />
                      <Detail
                        label="Longitude"
                        value={viewedUser.deliveryPersonnelDetails.longitude}
                      />
                    </div>
                  </div>
                </>
              )}
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={() => setViewedUser(null)}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editedUser.name}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={editedUser.email}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={editedUser.role}
                disabled={editedUser.role}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, role: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Delete User
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedUser.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
