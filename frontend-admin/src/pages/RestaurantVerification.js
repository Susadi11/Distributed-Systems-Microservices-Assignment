import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantVerification = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [verifiedRestaurants, setVerifiedRestaurants] = useState([]);
  const [rejectedRestaurants, setRejectedRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [viewMode, setViewMode] = useState('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5551/api/admin/proxy/restaurants'); 
  
      console.log('Full API response:', res.data); // Debugging
      const transformRestaurant = (restaurant) => ({
        _id: restaurant._id,
        name: restaurant.storeName,
        brandName: restaurant.brandName,
        owner: `${restaurant.contact.firstName} ${restaurant.contact.lastName}`,
        email: restaurant.contact.email,
        phone: `${restaurant.contact.phone.countryCode} ${restaurant.contact.phone.number}`,
        address: `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.country}`,
        status: restaurant.status,
        submittedDate: restaurant.registrationDate || restaurant.createdAt,
        verifiedDate: restaurant.verifiedDate,
        rejectedDate: restaurant.rejectedDate,
        rejectionReason: restaurant.rejectionReason,
        documents: restaurant.documents || [],
      });
  
      setPendingRestaurants(res.data.data.pending.map(transformRestaurant) || []);
      setVerifiedRestaurants(res.data.data.verified.map(transformRestaurant) || []);
      setRejectedRestaurants(res.data.data.rejected.map(transformRestaurant) || []);
    } catch (err) {
      console.error('Error fetching restaurant data:', err);
      setError('Failed to load restaurant data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log('Pending Restaurants:', pendingRestaurants); // 👈 Add this

  const approveRestaurant = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5551/api/admin/proxy/restaurants/${id}/approve`);
      setVerifiedRestaurants((prev) => [
        ...prev,
        { ...res.data, status: 'approved' },
      ]);
      setPendingRestaurants((prev) =>
        prev.filter((restaurant) => restaurant._id !== id)
      );
      setSelectedRestaurant(null);
    } catch (err) {
      console.error('Failed to approve restaurant', err);
    }
  };
  
  const rejectRestaurant = async (id) => {
    if (!rejectionReason.trim()) return;
    try {
      const res = await axios.put(`http://localhost:5551/api/admin/proxy/restaurants/${id}/reject`, {
        rejectionReason,
      });
      setRejectedRestaurants((prev) => [
        ...prev,
        { ...res.data, status: 'rejected' },
      ]);
      setPendingRestaurants((prev) =>
        prev.filter((restaurant) => restaurant._id !== id)
      );
      setSelectedRestaurant(null);
      setRejectionReason('');
    } catch (err) {
      console.error('Failed to reject restaurant', err);
    }
  };
  
  
  const getListByViewMode = () => {
    if (viewMode === 'pending') return pendingRestaurants;
    if (viewMode === 'verified') return verifiedRestaurants;
    if (viewMode === 'rejected') return rejectedRestaurants;
    return [];
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Restaurant Verification</h2>
        <p className="text-gray-600">Verify restaurant applications before they can join the platform</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['pending', 'verified', 'rejected'].map(status => (
              <button
                key={status}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  viewMode === status
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => {
                  setViewMode(status);
                  setSelectedRestaurant(null);
                }}
              >
                {status === 'pending'
                  ? `Pending Applications (${pendingRestaurants.length})`
                  : status === 'verified'
                  ? `Verified Restaurants (${verifiedRestaurants.length})`
                  : `Rejected Applications (${rejectedRestaurants.length})`}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-20">{error}</div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium capitalize">{viewMode} Restaurants</h3>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              <ul className="divide-y divide-gray-200">
                {getListByViewMode().map((restaurant) => (
                  <li
                    key={restaurant._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedRestaurant && selectedRestaurant._id === restaurant._id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{restaurant.name}</h4>
                        <p className="text-sm text-gray-500">{restaurant.owner}</p>
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            restaurant.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : restaurant.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Submitted: {formatDate(restaurant.submittedDate)}</p>
                  </li>
                ))}
                {getListByViewMode().length === 0 && (
                  <li className="p-4 text-center text-gray-500">No restaurants found</li>
                )}
              </ul>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selectedRestaurant ? (
              <div className="bg-white rounded-lg shadow-md h-full">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{selectedRestaurant.name}</h3>
                    <span
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedRestaurant.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : selectedRestaurant.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {selectedRestaurant.status.charAt(0).toUpperCase() + selectedRestaurant.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-500 mb-2">Restaurant Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Owner</p>
                          <p className="font-medium">{selectedRestaurant.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedRestaurant.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{selectedRestaurant.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{selectedRestaurant.address}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-500 mb-2">Timeline</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Submitted On</p>
                          <p className="font-medium">{formatDate(selectedRestaurant.submittedDate)}</p>
                        </div>
                        {selectedRestaurant.verifiedDate && (
                          <div>
                            <p className="text-sm text-gray-500">Verified On</p>
                            <p className="font-medium">{formatDate(selectedRestaurant.verifiedDate)}</p>
                          </div>
                        )}
                        {selectedRestaurant.rejectedDate && (
                          <div>
                            <p className="text-sm text-gray-500">Rejected On</p>
                            <p className="font-medium">{formatDate(selectedRestaurant.rejectedDate)}</p>
                          </div>
                        )}
                        {selectedRestaurant.rejectionReason && (
                          <div>
                            <p className="text-sm text-gray-500">Rejection Reason</p>
                            <p className="font-medium text-red-600">{selectedRestaurant.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedRestaurant.status === 'pending' && (
                    <>
                      {selectedRestaurant.documents && (
                        <div className="mt-8">
                          <h4 className="font-medium text-gray-500 mb-2">Documents</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedRestaurant.documents.map((doc, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                <p className="text-sm font-medium">{doc}</p>
                                <div className="mt-2 flex space-x-2">
                                  <button className="text-xs text-blue-600 hover:text-blue-800">View</button>
                                  <button className="text-xs text-blue-600 hover:text-blue-800">Download</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-8 border-t pt-6">
                        <h4 className="font-medium text-gray-500 mb-4">Verification Decision</h4>
                        <div className="flex flex-col md:flex-row md:space-x-4">
                          <div className="flex-1 mb-4 md:mb-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Rejection Reason (if rejecting)
                            </label>
                            <textarea
                              className="w-full border border-gray-300 rounded-md shadow-sm p-3"
                              rows="3"
                              placeholder="Provide a reason for rejection..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            ></textarea>
                          </div>
                          <div className="flex-1 flex flex-col justify-end">
                            <div className="flex space-x-4">
                              <button
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
                                onClick={() => approveRestaurant(selectedRestaurant._id)}
                              >
                                Approve
                              </button>
                              <button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                                onClick={() => rejectRestaurant(selectedRestaurant._id)}
                                disabled={!rejectionReason.trim()}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md h-full flex items-center justify-center p-8 text-gray-400">
                Select a restaurant to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantVerification;
