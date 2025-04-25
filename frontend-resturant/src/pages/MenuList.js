import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Clock, Edit, Trash } from 'lucide-react';
import Sidebar from '../components/utility/Sidebar';
import DashboardNavBar from '../components/utility/DashboardNavBar';

const MenuList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    currency: 'USD',
    quantity: 0,
    price: 0,
    description: '',
    status: 'available',
    discount: false
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    unavailableProducts: 0
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5556/api/products');
      const data = await response.json();
      setProducts(data);
      
      // Calculate statistics
      setStats({
        totalProducts: data.length,
        availableProducts: data.filter(p => p.status === 'available').length,
        unavailableProducts: data.filter(p => p.status === 'unavailable').length
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle edit button click
  const handleEditClick = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5556/api/products/${productId}`);
      const product = await response.json();
      
      // Set the product data to the form
      setFormData({
        productName: product.productName,
        category: product.category,
        currency: product.currency,
        quantity: product.quantity,
        price: product.price,
        description: product.description || '',
        status: product.status,
        discount: product.discount
      });
      
      // Set the editing product id
      setEditingProduct(productId);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5556/api/products/${productId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove from list and update stats
          const updatedProducts = products.filter(p => p._id !== productId);
          setProducts(updatedProducts);
          
          // Recalculate stats
          setStats({
            totalProducts: updatedProducts.length,
            availableProducts: updatedProducts.filter(p => p.status === 'available').length,
            unavailableProducts: updatedProducts.filter(p => p.status === 'unavailable').length
          });
          
          alert('Product deleted successfully');
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission for editing
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5556/api/products/${editingProduct}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedProduct = await response.json();
        
        // Update the product in the list
        const updatedProducts = products.map(p => 
          p._id === editingProduct ? updatedProduct : p
        );
        
        setProducts(updatedProducts);
        
        // Recalculate stats
        setStats({
          totalProducts: updatedProducts.length,
          availableProducts: updatedProducts.filter(p => p.status === 'available').length,
          unavailableProducts: updatedProducts.filter(p => p.status === 'unavailable').length
        });
        
        // Reset editing state
        setEditingProduct(null);
        setFormData({
          productName: '',
          category: '',
          currency: 'USD',
          quantity: 0,
          price: 0,
          description: '',
          status: 'available',
          discount: false
        });
        
        alert('Product updated successfully');
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      productName: '',
      category: '',
      currency: 'USD',
      quantity: 0,
      price: 0,
      description: '',
      status: 'available',
      discount: false
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <DashboardNavBar />
          <div className="p-6">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardNavBar />
        
        <main className="p-6 bg-white dark:bg-gray-900 flex-1 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Total Products Card */}
            <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-200 dark:bg-blue-900 dark:border-blue-700 dark:hover:bg-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-full text-white">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-blue-900 dark:text-white">Total Products</h5>
                  <p className="text-xs text-blue-800 dark:text-blue-200">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            {/* Available Products Card */}
            <div className="p-4 bg-green-100 border border-green-200 rounded-lg shadow-sm hover:bg-green-200 dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-full text-white">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-green-900 dark:text-white">Available Products</h5>
                  <p className="text-xs text-green-800 dark:text-green-200">{stats.availableProducts}</p>
                </div>
              </div>
            </div>

            {/* Unavailable Products Card */}
            <div className="p-4 bg-yellow-100 border border-yellow-200 rounded-lg shadow-sm hover:bg-yellow-200 dark:bg-yellow-900 dark:border-yellow-700 dark:hover:bg-yellow-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-full text-white">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-yellow-900 dark:text-white">Unavailable Products</h5>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">{stats.unavailableProducts}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {editingProduct && (
            <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Edit Product</h2>
              
              <form onSubmit={handleSubmitEdit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="discount"
                      checked={formData.discount}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Apply Discount
                    </span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Product ID</th>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Quantity</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      #{product._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">{product.productName}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">{product.currency} {product.price}</td>
                    <td className="px-6 py-4">{product.quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                        product.status === 'available'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditClick(product._id)}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product._id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline flex items-center"
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MenuList;