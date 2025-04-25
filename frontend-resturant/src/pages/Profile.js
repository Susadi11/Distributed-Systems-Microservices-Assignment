import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {  Edit, Save, X} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem('authToken');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Function to parse JWT token (same as in Registration)
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      return null;
    }
  };

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const decoded = parseJwt(token);
        const userId = decoded.id || decoded.userId || decoded._id || decoded.sub;
        
        console.log('Decoded token:', decoded);
        console.log('Extracted user ID:', userId);
        console.log('Requesting restaurant for user:', userId);
        
        const response = await fetch(`http://localhost:5556/api/restaurants/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('No restaurant profile found');
            setIsLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        // Only try to parse JSON if response was successful
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log('Received restaurant data:', data);
          
          setRestaurant(data.data);
          setFormData({
            storeName: data.data.storeName,
            brandName: data.data.brandName,
            businessType: data.data.businessType,
            firstName: data.data.contact.firstName,
            lastName: data.data.contact.lastName,
            countryCode: data.data.contact.phone.countryCode,
            phoneNumber: data.data.contact.phone.number,
            streetAddress: data.data.address.street,
            floorSuite: data.data.address.floorSuite || '',
            city: data.data.address.city,
            state: data.data.address.state,
            postalCode: data.data.address.postalCode,
            openingHoursOpen: data.data.openingHours?.open || '09:00',
            openingHoursClose: data.data.openingHours?.close || '22:00',
            isOpenNow: data.data.isOpenNow || false,
            cuisineTypes: data.data.cuisineTypes ? [...data.data.cuisineTypes] : [],
            profileImage: data.data.profileImage ? [...data.data.profileImage] : [],
          });
        } else {
          throw new Error("Response is not JSON");
        }
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRestaurantData();
  }, [token, navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data when canceling edit
      setFormData({
        storeName: restaurant.storeName,
        brandName: restaurant.brandName,
        businessType: restaurant.businessType,
        firstName: restaurant.contact.firstName,
        lastName: restaurant.contact.lastName,
        countryCode: restaurant.contact.phone.countryCode,
        phoneNumber: restaurant.contact.phone.number,
        streetAddress: restaurant.address.street,
        floorSuite: restaurant.address.floorSuite || '',
        city: restaurant.address.city,
        state: restaurant.address.state,
        postalCode: restaurant.address.postalCode,
        openingHoursOpen: restaurant.openingHours?.open || '09:00',
        openingHoursClose: restaurant.openingHours?.close || '22:00',
        isOpenNow: restaurant.isOpenNow || false,
        cuisineTypes: restaurant.cuisineTypes ? [...restaurant.cuisineTypes] : [],
        profileImage: restaurant.profileImage ? [...restaurant.profileImage] : [],
      });
      // Clear image files and previews
      setImageFiles([]);
      setImagePreview([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCuisineChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(value)
        ? prev.cuisineTypes.filter(cuisine => cuisine !== value)
        : [...prev.cuisineTypes, value]
    }));
  };

 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create FormData object for file uploads
      const formDataForUpload = new FormData();

      // Add all form fields
      formDataForUpload.append('storeName', formData.storeName);
      formDataForUpload.append('brandName', formData.brandName);
      formDataForUpload.append('businessType', formData.businessType);
      
      // Add contact information
      formDataForUpload.append('contact[firstName]', formData.firstName);
      formDataForUpload.append('contact[lastName]', formData.lastName);
      formDataForUpload.append('contact[email]', restaurant.contact.email);
      formDataForUpload.append('contact[phone][countryCode]', formData.countryCode);
      formDataForUpload.append('contact[phone][number]', formData.phoneNumber);
      
      // Add address information
      formDataForUpload.append('address[street]', formData.streetAddress);
      formDataForUpload.append('address[floorSuite]', formData.floorSuite);
      formDataForUpload.append('address[city]', formData.city);
      formDataForUpload.append('address[state]', formData.state);
      formDataForUpload.append('address[postalCode]', formData.postalCode);
      
      // Add opening hours
      formDataForUpload.append('openingHours[open]', formData.openingHoursOpen);
      formDataForUpload.append('openingHours[close]', formData.openingHoursClose);
      formDataForUpload.append('isOpenNow', formData.isOpenNow);
      
      // Add cuisine types
      formData.cuisineTypes.forEach((cuisine, index) => {
        formDataForUpload.append(`cuisineTypes[${index}]`, cuisine);
      });
      
      // Add existing profile images that weren't removed
      formData.profileImage.forEach((imageUrl, index) => {
        formDataForUpload.append(`profileImage[${index}]`, imageUrl);
      });
      
      // Add new image files
      imageFiles.forEach(file => {
        formDataForUpload.append('profileImage', file);
      });

      console.log('Sending update payload with FormData');
      
      const response = await fetch(`http://localhost:5556/api/restaurants/${restaurant._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataForUpload
      });

      if (!response.ok) {
        throw new Error('Failed to update restaurant');
      }

      const updatedData = await response.json();
      setRestaurant(updatedData.data);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear image files and previews
      setImageFiles([]);
      setImagePreview([]);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-xl mb-4">No restaurant profile found</div>
        <button 
          onClick={() => navigate('/register-restaurant')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register a Restaurant
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Restaurant Profile</h1>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-6 mt-4">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-4">
              <p>{error}</p>
            </div>
          )}

          {/* Profile content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Business Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Store Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{restaurant.storeName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Brand Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="brandName"
                        value={formData.brandName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{restaurant.brandName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Business Type</label>
                    {isEditing ? (
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="Restaurant">Restaurant</option>
                        <option value="Cafe">Cafe</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Food Truck">Food Truck</option>
                        <option value="Grocery Store">Grocery Store</option>
                        <option value="Other Food Business">Other Food Business</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-gray-900">{restaurant.businessType}</p>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-4">Opening Hours</h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Open</label>
                    {isEditing ? (
                      <input
                        type="time"
                        name="openingHoursOpen"
                        value={formData.openingHoursOpen}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{restaurant.openingHours?.open || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Close</label>
                    {isEditing ? (
                      <input
                        type="time"
                        name="openingHoursClose"
                        value={formData.openingHoursClose}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{restaurant.openingHours?.close || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Is Open Now</label>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        name="isOpenNow"
                        checked={formData.isOpenNow}
                        onChange={handleChange}
                        className="ml-2 form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{restaurant.isOpenNow ? 'Yes' : 'No'}</p>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-4">Cuisine Types</h2>
                <div>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {/* Replace with your actual cuisine options */}
                      {['Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Other'].map(cuisine => (
                        <div key={cuisine} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`cuisine-${cuisine}`}
                            name="cuisineTypes"
                            value={cuisine}
                            checked={formData.cuisineTypes.includes(cuisine)}
                            onChange={handleCuisineChange}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor={`cuisine-${cuisine}`} className="ml-2 text-sm text-gray-600">{cuisine}</label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0
                        ? restaurant.cuisineTypes.join(', ')
                        : 'Not specified'}
                    </p>
                  )}
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-4">Profile Images</h2>
                <div>
                  {/* Existing Images */}
                  
                    <div className="flex flex-wrap gap-4">
                      {restaurant.profileImage.map((imgUrl, index) => (
                        <img key={index} src={imgUrl} alt={`Profile Image ${index + 1}`} className="w-32 h-32 object-cover rounded-md" />
                      ))}
                    </div>
                 
                </div>
              </div>

              {/* Right column */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{restaurant.contact.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{restaurant.contact.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-900">{restaurant.contact.email}</p>
                  </div>
  
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                      {isEditing ? (
                        <div className="flex mt-1">
                          <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-l-md p-2"
                          >
                            <option value="+94">🇱🇰 +94</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                          </select>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="flex-1 border-t border-b border-r border-gray-300 rounded-r-md p-2"
                          />
                        </div>
                      ) : (
                        <p className="mt-1 text-gray-900">
                          {restaurant.contact.phone.countryCode} {restaurant.contact.phone.number}
                        </p>
                      )}
                    </div>
                  </div>
  
                  <h2 className="text-xl font-semibold mt-8 mb-4">Address</h2>
  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Street Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="streetAddress"
                          value={formData.streetAddress}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{restaurant.address.street}</p>
                      )}
                    </div>
  
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Floor/Suite</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="floorSuite"
                          value={formData.floorSuite}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">
                          {restaurant.address.floorSuite || 'Not specified'}
                        </p>
                      )}
                    </div>
  
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">City</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{restaurant.address.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">State</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{restaurant.address.state}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Postal Code</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{restaurant.address.postalCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Status */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    restaurant.status === 'approved' ? 'bg-green-100 text-green-800' :
                    restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Registered on: {new Date(restaurant.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Profile;