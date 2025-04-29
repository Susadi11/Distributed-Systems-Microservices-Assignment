import React, { useState, useEffect } from 'react';
import { Check, Upload, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: '',
    brandName: '',
    businessType: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    storeAddress: '',
    floorSuite: '',
    city: '',
    state: '',
    postalCode: '',
    email: '',
    termsAccepted: false,
    // Add new location fields
    latitude: '',
    longitude: ''
  });

  // Replace profileImage with profileImageBase64
  const [profileImageBase64, setProfileImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [countryCode, setCountryCode] = useState('+94');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  

  const businessTypes = [
    'Restaurant',
    'Cafe',
    'Bakery',
    'Food Truck'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Convert image file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Handle image file selection with Base64 conversion
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Convert image file to Base64 string
        const base64String = await convertToBase64(file);
        setProfileImageBase64(base64String);
        setImagePreview(base64String);
      } catch (error) {
        console.error('Error converting image to Base64:', error);
        setError('Failed to process the image. Please try another one.');
      }
    }
  };

  // New function to get current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get your location. Please enter coordinates manually or try again.');
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    // Validate required fields
    const requiredFields = [
      'storeName', 'brandName', 'businessType', 
      'firstName', 'lastName', 'phoneNumber',
      'storeAddress', 'city', 'state', 'postalCode', 'email'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Create request data object including all form fields and Base64 image
      const requestData = {
        ...formData,
        countryCode,
        profileImageBase64: profileImageBase64 // Include Base64 string directly
      };
  
      const response = await fetch('http://localhost:5556/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const responseData = await response.json();
      
      if (responseData.data?.token) {
        localStorage.setItem('token', responseData.data.token);
      }
  
      setSubmitSuccess(true);
      navigate('/login');
      
      // Reset form
      setFormData({
        storeName: '',
        brandName: '',
        businessType: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        storeAddress: '',
        floorSuite: '',
        city: '',
        state: '',
        postalCode: '',
        email: '',
        termsAccepted: false,
        latitude: '',
        longitude: ''
      });
      
      setProfileImageBase64(null);
      setImagePreview(null);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Full Image with Overlay Text */}
      <div className="w-1/2 relative">
      <img 
          src="https://thumbs.dreamstime.com/b/woman-paying-bill-smartphone-using-nfc-technology-cafe-78670386.jpg" 
          alt="Restaurant sales increase" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white p-12 max-w-lg">
            <h2 className="text-4xl font-bold mb-8">Why Register With Us?</h2>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <Check className="h-6 w-6 mt-0.5 mr-3 flex-shrink-0 text-green-400" />
                <span>Reach thousands of hungry customers</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 mt-0.5 mr-3 flex-shrink-0 text-green-400" />
                <span>Increase your sales and visibility</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 mt-0.5 mr-3 flex-shrink-0 text-green-400" />
                <span>Easy-to-use platform for managing orders</span>
              </li>
              <li className="flex items-start">
                <Check className="h-6 w-6 mt-0.5 mr-3 flex-shrink-0 text-green-400" />
                <span>24/7 customer support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 p-12 flex items-center justify-center bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Restaurant</h1>
          <p className="text-gray-600 mb-8">
            Join our platform and start reaching more customers today
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Restaurant Profile Image */}
            <div>
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Profile Image
              </label>
              <div className="mt-1 flex items-center">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Restaurant preview" 
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setProfileImageBase64(null);
                        setImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer"
                       onClick={() => document.getElementById('profileImage').click()}>
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs">Upload</span>
                  </div>
                )}
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="ml-4 flex-1">
                  <div className="text-sm text-gray-500">
                    {!imagePreview ? (
                      <>
                        <p>Upload a restaurant logo or storefront image</p>
                        <p className="mt-1">JPG, PNG or GIF up to 5MB</p>
                      </>
                    ) : (
                      <p>Image selected and converted to Base64</p>
                    )}
                  </div>
                  {!imagePreview && (
                    <button
                      type="button"
                      onClick={() => document.getElementById('profileImage').click()}
                      className="mt-2 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                    >
                      Select File
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Restaurant Address Section */}
            <div>
              <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Store address
              </label>
              <input
                type="text"
                id="storeAddress"
                name="storeAddress"
                value={formData.storeAddress}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Main Street"
                required
              />
            </div>

            <div>
              <label htmlFor="floorSuite" className="block text-sm font-medium text-gray-700 mb-1">
                Floor / Suite (Optional)
              </label>
              <input
                type="text"
                id="floorSuite"
                name="floorSuite"
                value={formData.floorSuite}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Suite 101"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Location Coordinates Section */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Location Coordinates
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  disabled={locationLoading}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {locationLoading ? 'Getting location...' : 'Get Current Location'}
                </button>
              </div>
              
              {locationError && (
                <div className="mb-2 text-sm text-red-600">
                  {locationError}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="latitude" className="block text-sm text-gray-500 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., 6.927079"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm text-gray-500 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., 79.861244"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">These coordinates help customers find your location accurately.</p>
            </div>

            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                Store name
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Example: Sam's Pizza – 123 Main street"
                required
              />
              <p className="mt-1 text-sm text-gray-500">This is how your store will appear in the app.</p>
            </div>

            <div>
              <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                Brand name
              </label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Example: Sam's Pizza"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                We'll use this to help organize information that is shared across stores.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {businessTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setSelectedBusinessType(type);
                      setFormData(prev => ({ ...prev, businessType: type }));
                    }}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedBusinessType === type 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile phone number
              </label>
              <div className="flex">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="+94">🇱🇰 +94</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="flex-1 p-3 border-t border-b border-r border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-blue-300"
                  required
                />
              </div>
              <label htmlFor="termsAccepted" className="ms-2 text-sm font-medium text-gray-700">
                By clicking "Submit", you agree to our <a href="#" className="text-blue-600 hover:underline">Merchant Terms</a> and acknowledge our <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;