import React, { useState, useRef, useEffect } from "react";
import DashboardNavBar from "../components/utility/DashboardNavBar";
import Sidebar from "../components/utility/Sidebar";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

function AddProduct() {
  const [productImages, setProductImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInput = useRef(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userId, setUserId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    currency: "USD",
    quantity: "",
    price: "",
    description: "",
    status: "available",
    discount: false
  });

  const categories = [
    "Appetizers",
    "Main Courses",
    "Pizzas",
    "Burgers",
    "Salads",
    "Desserts",
    "Beverages"
  ];

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

  // Get user and restaurant IDs from token when component mounts
  useEffect(() => {
    if (token) {
      try {
        const decoded = parseJwt(token);
        console.log('Decoded token:', decoded);

        // Extract IDs from token
        const extractedUserId = decoded.userId || decoded.id || decoded._id || decoded.sub;
        const extractedRestaurantId = decoded.restaurantId;

        if (extractedUserId) {
          setUserId(extractedUserId);
        } else {
          console.error('No user ID found in token');
        }

        if (extractedRestaurantId) {
          setRestaurantId(extractedRestaurantId);
        } else {
          console.error('No restaurant ID found in token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Process each file to create preview URLs and convert to base64
    files.forEach(file => {
      // Create preview URL for display
      const imageUrl = URL.createObjectURL(file);
      setProductImages(prev => [...prev, imageUrl]);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        // Store base64 data, content type, and filename
        setSelectedFiles(prev => [...prev, {
          name: file.name,
          contentType: file.type,
          data: base64String.split(',')[1] // Remove the data:image/jpeg;base64, part
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...productImages];
    const newFiles = [...selectedFiles];
    
    // Remove the image and file at the specified index
    newImages.splice(index, 1);
    newFiles.splice(index, 1);
    
    setProductImages(newImages);
    setSelectedFiles(newFiles);
    
    if (currentImageIndex >= newImages.length && newImages.length > 0) {
      setCurrentImageIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setCurrentImageIndex(0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate user and restaurant IDs
    if (!userId || !restaurantId) {
      alert('Authentication required. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    // Create request data object
    const requestData = {
      ...formData,
      userId: userId,
      restaurantId: restaurantId,
      images: selectedFiles
    };

    try {
      const response = await fetch('http://localhost:5556/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit product');
      }

      const result = await response.json();
      console.log('Success:', result);
      alert('Product added successfully!');
      
      // Reset form after successful submission
      setFormData({
        productName: "",
        category: "",
        currency: "USD",
        quantity: "",
        price: "",
        description: "",
        status: "available",
        discount: false
      });
      setProductImages([]);
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavBar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Product Details Form */}
            <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Details</h3>
              
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label htmlFor="productName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Margherita Pizza"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="50"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Rest of the form fields remain the same */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Currency */}
                  <div>
                    <label htmlFor="currency" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="12.99"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Describe the product..."
                  ></textarea>
                </div>

                {/* Status and Discount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Status
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="status"
                          value="available"
                          checked={formData.status === "available"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Available</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="status"
                          value="unavailable"
                          checked={formData.status === "unavailable"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Unavailable</span>
                      </label>
                    </div>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Discount
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="discount"
                        checked={formData.discount}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {formData.discount ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Images and Submit Button */}
            <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Product Images</h3>
              
              {productImages.length > 0 ? (
                <div className="relative flex-1">
                  <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={productImages[currentImageIndex]} 
                      alt={`Product ${currentImageIndex + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentImageIndex === 0}
                      className="p-2 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {currentImageIndex + 1} / {productImages.length}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => setCurrentImageIndex(prev => Math.min(productImages.length - 1, prev + 1))}
                      disabled={currentImageIndex === productImages.length - 1}
                      className="p-2 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {productImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={img} 
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 -mt-1 -mr-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, JPEG (MAX. 5MB each)
                      </p>
                    </div>
                    <input 
                      ref={fileInput}
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}

              {/* Debug information - remove in production */}
              {/* {(userId && restaurantId) && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                  <p className="text-gray-500 dark:text-gray-400">Token information loaded:</p>
                  <p className="text-gray-600 dark:text-gray-300">User ID: {userId}</p>
                  <p className="text-gray-600 dark:text-gray-300">Restaurant ID: {restaurantId}</p>
                </div>
              )} */}

              {/* Submit Button */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting || !userId || !restaurantId}
                  className={`w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${(isSubmitting || !userId || !restaurantId) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : (!userId || !restaurantId) ? 'Missing Authentication' : 'Add Product'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AddProduct;