// api/Axios.js - Updated to support multiple services

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

// Request interceptor for auth service
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for restaurant service
restaurantApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - same for both services
const responseInterceptor = (response) => response;
const errorInterceptor = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use(responseInterceptor, errorInterceptor);
restaurantApi.interceptors.response.use(responseInterceptor, errorInterceptor);

export { authApi, restaurantApi };
export default authApi; // For backward compatibility