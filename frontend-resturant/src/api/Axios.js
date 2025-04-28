// api/Axios.js - Updated with orders endpoint
import axios from 'axios';

// Authentication service API instance
const authApi = axios.create({
  baseURL: process.env.REACT_APP_AUTH_API_URL || 'http://localhost:5555',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Restaurant service API instance
const restaurantApi = axios.create({
  baseURL: process.env.REACT_APP_RESTAURANT_API_URL || 'http://localhost:5556/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Order service API instance
const orderApi = axios.create({
  baseURL: process.env.REACT_APP_ORDER_API_URL || 'http://localhost:5559/orders',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptors for all services
const requestInterceptor = (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

[authApi, restaurantApi, orderApi].forEach(api => {
  api.interceptors.request.use(requestInterceptor);
});

// Response interceptor - same for all services
const responseInterceptor = (response) => response;
const errorInterceptor = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

[authApi, restaurantApi, orderApi].forEach(api => {
  api.interceptors.response.use(responseInterceptor, errorInterceptor);
});

// Restaurant Orders API methods
export const getRestaurantOrders = async (status = '') => {
  try {
    const url = status ? `/restaurant?status=${status}` : '/restaurant';
    const response = await orderApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await orderApi.patch(`/${orderId}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export { authApi, restaurantApi, orderApi };
export default authApi;