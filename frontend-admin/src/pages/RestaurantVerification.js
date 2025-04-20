import React, { useState } from 'react';

const RestaurantVerification = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState([
    {
      id: 1,
      name: "Pizza Palace",
      owner: "John Smith",
      email: "john@pizzapalace.com",
      phone: "+94 77 123 4567",
      address: "123 Pizza Street, Colombo",
      submittedDate: "2025-04-15T14:30:00",
      status: "pending",
      documents: ["business_license.pdf", "food_safety_cert.pdf", "owner_id.pdf"]
    },
    {
      id: 2,
      name: "Burger Bliss",
      owner: "Mary Johnson",
      email: "mary@burgerbliss.com",
      phone: "+94 76 234 5678",
      address: "456 Burger Road, Kandy",
      submittedDate: "2025-04-16T09:15:00",
      status: "pending",
      documents: ["business_license.pdf", "food_safety_cert.pdf", "owner_id.pdf"]
    },
    {
      id: 3,
      name: "Curry Corner",
      owner: "Raj Patel",
      email: "raj@currycorner.com",
      phone: "+94 71 345 6789",
      address: "789 Spice Lane, Galle",
      submittedDate: "2025-04-17T11:45:00",
      status: "pending",
      documents: ["business_license.pdf", "food_safety_cert.pdf", "owner_id.pdf"]
    }
  ]);

  const [verifiedRestaurants, setVerifiedRestaurants] = useState([
    {
      id: 4,
      name: "Noodle House",
      owner: "Lee Wong",
      email: "lee@noodlehouse.com",
      phone: "+94 70 456 7890",
      address: "101 Noodle Street, Negombo",
      submittedDate: "2025-04-10T10:30:00",
      verifiedDate: "2025-04-12T14:20:00",
      status: "approved"
    },
    {
      id: 5,
      name: "Seafood Shack",
      owner: "David Wilson",
      email: "david@seafoodshack.com",
      phone: "+94 75 567 8901",
      address: "202 Beach Road, Mirissa",
      submittedDate: "2025-04-11T09:45:00",
      verifiedDate: "2025-04-13T16:10:00",
      status: "approved"
    }
  ]);

  const [rejectedRestaurants, setRejectedRestaurants] = useState([
    {
      id: 6,
      name: "Fast Fry",
      owner: "Thomas Brown",
      email: "thomas@fastfry.com",
      phone: "+94 78 678 9012",
      address: "303 Fry Lane, Jaffna",
      submittedDate: "2025-04-12T13:20:00",
      rejectedDate: "2025-04-14T11:30:00",
      status: "rejected",
      rejectionReason: "Incomplete documentation - missing food safety certificate"
    }
  ]);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [viewMode, setViewMode] = useState('pending'); // 'pending', 'verified', or 'rejected'
  const [rejectionReason, setRejectionReason] = useState('');

  const approveRestaurant = (id) => {
    const restaurant = pendingRestaurants.find(r => r.id === id);
    if (restaurant) {
      const updatedRestaurant = {
        ...restaurant,
        status: 'approved',
        verifiedDate: new Date().toISOString()
      };
      
      setVerifiedRestaurants([...verifiedRestaurants, updatedRestaurant]);
      setPendingRestaurants(pendingRestaurants.filter(r => r.id !== id));
      setSelectedRestaurant(null);
    }
  };

  const rejectRestaurant = (id) => {
    const restaurant = pendingRestaurants.find(r => r.id === id);
    if (restaurant && rejectionReason.trim()) {
      const updatedRestaurant = {
        ...restaurant,
        status: 'rejected',
        rejectedDate: new Date().toISOString(),
        rejectionReason: rejectionReason
      };
      
      setRejectedRestaurants([...rejectedRestaurants, updatedRestaurant]);
      setPendingRestaurants(pendingRestaurants.filter(r => r.id !== id));
      setSelectedRestaurant(null);
      setRejectionReason('');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                viewMode === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setViewMode('pending')}
            >
              Pending Applications ({pendingRestaurants.length})
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                viewMode === 'verified'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setViewMode('verified')}
            >
              Verified Restaurants ({verifiedRestaurants.length})
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                viewMode === 'rejected'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setViewMode('rejected')}
            >
              Rejected Applications ({rejectedRestaurants.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium">
              {viewMode === 'pending' ? 'Pending Applications' : 
               viewMode === 'verified' ? 'Verified Restaurants' : 'Rejected Applications'}
            </h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            <ul className="divide-y divide-gray-200">
              {(viewMode === 'pending' ? pendingRestaurants : 
                viewMode === 'verified' ? verifiedRestaurants : rejectedRestaurants).map((restaurant) => (
                <li 
                  key={restaurant.id} 
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedRestaurant && selectedRestaurant.id === restaurant.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{restaurant.name}</h4>
                      <p className="text-sm text-gray-500">{restaurant.owner}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        restaurant.status === 'approved' ? 'bg-green-100 text-green-800' :
                        restaurant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {restaurant.status === 'approved' ? 'Approved' :
                         restaurant.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted: {formatDate(restaurant.submittedDate)}
                  </p>
                </li>
              ))}
              {(viewMode === 'pending' && pendingRestaurants.length === 0) || 
               (viewMode === 'verified' && verifiedRestaurants.length === 0) || 
               (viewMode === 'rejected' && rejectedRestaurants.length === 0) ? (
                <li className="p-4 text-center text-gray-500">No restaurants found</li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedRestaurant ? (
            <div className="bg-white rounded-lg shadow-md h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{selectedRestaurant.name}</h3>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    selectedRestaurant.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedRestaurant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedRestaurant.status === 'approved' ? 'Approved' :
                     selectedRestaurant.status === 'rejected' ? 'Rejected' : 'Pending'}
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
                    <h4 className="font-medium text-gray-500 mb-2">Application Timeline</h4>
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
                  <div className="mt-8">
                    <h4 className="font-medium text-gray-500 mb-2">Documents</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedRestaurant.documents.map((doc, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <p className="text-sm font-medium">{doc}</p>
                          <div className="mt-2 flex space-x-2">
                            <button className="text-xs text-blue-600 hover:text-blue-800">
                              View Document
                            </button>
                            <button className="text-xs text-blue-600 hover:text-blue-800">
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 border-t pt-6">
                      <h4 className="font-medium text-gray-500 mb-4">Verification Decision</h4>
                      <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="flex-1 mb-4 md:mb-0">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason (if rejecting)
                          </label>
                          <textarea
                            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                            placeholder="Provide a reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="flex-1 flex flex-col justify-end">
                          <div className="flex space-x-4">
                            <button
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                              onClick={() => approveRestaurant(selectedRestaurant.id)}
                            >
                              Approve Restaurant
                            </button>
                            <button
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                              onClick={() => rejectRestaurant(selectedRestaurant.id)}
                              disabled={!rejectionReason.trim()}
                            >
                              Reject Restaurant
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md h-full flex items-center justify-center p-8">
              <div className="text-center">
                <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
                  <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Restaurant Selected</h3>
                <p className="text-gray-500">Select a restaurant from the list to view details and perform verification</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantVerification;