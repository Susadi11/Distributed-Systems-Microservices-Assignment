import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    description: '',
    openTime: '09:00',
    closeTime: '22:00',
    isOpenNow: false,
    cuisineTypes: ''
  });
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [restaurantData, setRestaurantData] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setMessage({
        text: 'Authentication required. Redirecting to login...',
        type: 'error'
      });
      // Redirect after showing message
      const timer = setTimeout(() => navigate('/login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  // Load restaurant data only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setMessage({
        text: 'Authentication token missing. Please login again.',
        type: 'error'
      });
      return;
    }
    

    const loadRestaurantData = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.status === 401) {
          setMessage({
            text: 'Session expired. Please login again.',
            type: 'error'
          });
          navigate('/login');
          return;
        }

        const data = await response.json();
        
        if (data.restaurant && data.restaurant.user !== user.id) {
          setMessage({
            text: 'You are not authorized to edit this restaurant.',
            type: 'error'
          });
          return;
        }
        
        setRestaurantData(data.restaurant);
        
        if (data.restaurant) {
          setFormData({
            description: data.restaurant.description || '',
            openTime: data.restaurant.openingHours?.openTime || '09:00',
            closeTime: data.restaurant.openingHours?.closeTime || '22:00',
            isOpenNow: data.restaurant.isOpenNow || false,
            cuisineTypes: data.restaurant.cuisineTypes?.join(', ') || ''
          });
          
          if (data.restaurant.profileImage?.length > 0) {
            setPreviewImage(data.restaurant.profileImage[0]);
          }
        }
      } catch (error) {
        console.error('Error loading restaurant data:', error);
        setMessage({
          text: 'Failed to load restaurant data. Please try again.',
          type: 'error'
        });
      }
    };
    
    if (restaurantId && user?.id) {
      loadRestaurantData();
    }
  }, [restaurantId, user, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
  
    const authToken = localStorage.getItem('authToken');
    if (!authToken || !user) {
      setMessage({ 
        text: 'Authentication required. Please login again.', 
        type: 'error' 
      });
      setIsSubmitting(false);
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('description', formData.description);
      formDataToSend.append('openTime', formData.openTime);
      formDataToSend.append('closeTime', formData.closeTime);
      formDataToSend.append('isOpenNow', formData.isOpenNow.toString());
      formDataToSend.append('cuisineTypes', formData.cuisineTypes);
      
      if (file) {
        formDataToSend.append('profileImage', file);
      }
  
      const response = await fetch(`http://localhost:5556/api/restaurants/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`
          // The content-type is correctly omitted for FormData
        },
        body: formDataToSend
      });
  
      // First check if response exists (network error handling)
      if (!response) {
        throw new Error('Network error - no response from server');
      }
  
      // Then check response status
      if (!response.ok) {
        // Try to get error message from response
        const errorText = await response.text();
        try {
          // If response is JSON
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `Server error: ${response.status}`);
        } catch {
          // If response is HTML or plain text
          throw new Error(errorText || `Server error: ${response.status}`);
        }
      }
  
      const data = await response.json();
  
      setMessage({
        text: 'Profile updated successfully!', 
        type: 'success'
      });
      
      setTimeout(() => navigate(`/restaurant/dashboard`), 2000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: error.message || 'Something went wrong. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(selectedFile.type)) {
        setMessage({
          text: 'Only JPEG, PNG, or GIF images are allowed',
          type: 'error'
        });
        return;
      }
      
      if (selectedFile.size > maxSize) {
        setMessage({
          text: 'Image size must be less than 5MB',
          type: 'error'
        });
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // If not authenticated, show only the message (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <div className={`p-4 rounded-md ${
            message.type === 'error' ? 'bg-red-100 text-red-800' : ''
          }`}>
            {message.text}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Restaurant Profile</h2>
            <p className="mt-2 text-sm text-gray-600">
              Update your restaurant information
            </p>
          </div>

          {message.text && (
            <div className={`mb-4 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : message.type === 'info'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPEG, PNG (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="Tell customers about your restaurant..."
              />
            </div>

            {/* Opening Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={formData.openTime}
                  onChange={(e) => setFormData({...formData, openTime: e.target.value})}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={formData.closeTime}
                  onChange={(e) => setFormData({...formData, closeTime: e.target.value})}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>

            {/* Currently Open */}
            <div className="flex items-center">
              <input
                id="isOpenNow"
                type="checkbox"
                checked={formData.isOpenNow}
                onChange={(e) => setFormData({...formData, isOpenNow: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isOpenNow" className="ml-2 block text-sm text-gray-700">
                Currently Open
              </label>
            </div>

            {/* Cuisine Types */}
            <div>
              <label htmlFor="cuisineTypes" className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine Types
              </label>
              <input
                type="text"
                id="cuisineTypes"
                value={formData.cuisineTypes}
                onChange={(e) => setFormData({...formData, cuisineTypes: e.target.value})}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="e.g., Italian, Chinese, Sri Lankan"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple types with commas
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;