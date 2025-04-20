import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Profile() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
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

  // Check if profile already exists
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`);
        const data = await response.json();
        
        if (data.restaurant?.description) {
          setMessage({
            text: 'Profile already exists. You will be redirected to edit page.',
            type: 'info'
          });
          setTimeout(() => navigate(`/restaurant/${restaurantId}/edit`), 3000);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };
    
    checkProfile();
  }, [restaurantId, navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    const data = new FormData();
    data.append('description', formData.description);
    data.append('openTime', formData.openTime);
    data.append('closeTime', formData.closeTime);
    data.append('isOpenNow', formData.isOpenNow.toString());
    data.append('cuisineTypes', formData.cuisineTypes);
    if (file) data.append('profileImage', file);

    try {
      // Match endpoint to your backend route structure
      const response = await fetch(`/api/restaurants/${restaurantId}/profile`, {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create profile');
      }

      setMessage({ 
        text: 'Profile created successfully! Redirecting...', 
        type: 'success' 
      });
      
      setTimeout(() => {
        navigate(`/restaurant/${restaurantId}`);
      }, 2000);

    } catch (error) {
      setMessage({ 
        text: error.message || 'An error occurred', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

            {/* Rest of the form stays the same */}
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