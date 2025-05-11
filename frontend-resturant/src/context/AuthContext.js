import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, restaurantApi } from '../api/Axios'; // Updated import
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create context with default values
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  isAuthenticated: false,
  isLoading: true,
  authError: null
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  
  // Check if user is already logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Set token for all future requests on both APIs
          authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          restaurantApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token with backend
          const { data } = await authApi.get('/auth/me');
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        logout(); // Clear invalid auth state
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  const login = async (email, password) => {
    setAuthError(null);
    setIsLoading(true);
  
    try {
      // 1. First authenticate the user with auth service
      const { data } = await authApi.post('/auth/login', { email, password });
  
      // Save token
      localStorage.setItem('authToken', data.token);
      authApi.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      restaurantApi.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  
      // 2. If restaurant admin, check restaurant status using restaurant service
      if (data.user.role === 'resturant_admin') {
        try {
          // Use restaurant API to get restaurant details
          const restaurantResponse = await restaurantApi.get(`/restaurants/email/${email}`);
          
          // Check if restaurant exists and is approved
          if (restaurantResponse.data.restaurant) {
            const status = restaurantResponse.data.restaurant.status.toLowerCase();
            
            if (status !== 'verified') {
              let errorMessage = "Your restaurant account is pending approval.";
              
              if (status === 'pending') {
                errorMessage = "Your restaurant registration is under review. We'll notify you once approved.";
              } else if (status === 'rejected') {
                errorMessage = "Your restaurant registration was declined. Please contact support for more information.";
              } else if (status === 'suspended') {
                errorMessage = "Your restaurant account has been suspended. Please contact our support team.";
              }
              
              throw new Error(errorMessage);
            }
            
            // If approved, set user with restaurant data
            setUser({ ...data.user, restaurant: restaurantResponse.data.restaurant });
            toast.success('Welcome back! You are now logged in.');
            navigate('/homepage');
            return { ...data.user, restaurant: restaurantResponse.data.restaurant };
          } else {
            throw new Error('Please complete your restaurant registration to get started.');
          }
        } catch (restaurantError) {
          console.error('Restaurant verification error:', restaurantError);
          
          // Handle specific restaurant service errors
          if (restaurantError.response?.status === 404) {
            throw new Error('Please register your restaurant to get started.');
          } else if (restaurantError.message) {
            throw restaurantError; // Already has a user-friendly message
          } else {
            throw new Error('We encountered an issue verifying your restaurant. Please try again.');
          }
        }
      }
  
      // For non-restaurant-admin users
      setUser(data.user);
      toast.success('Logged in successfully');
    
      return data.user;
    } catch (error) {
      // Clear auth on any error
      localStorage.removeItem('authToken');
      delete authApi.defaults.headers.common['Authorization'];
      delete restaurantApi.defaults.headers.common['Authorization'];
      
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         "Login failed. Please check your credentials and try again.";
      
      setAuthError(errorMessage);
      toast.error(errorMessage, { autoClose: 10000 });
      throw error;
    } finally {
      setIsLoading(false);
    }
};

const register = async (userData) => {
  setAuthError(null);
  setIsLoading(true);
  
  try {
    const { data } = await authApi.post('/auth/register', userData);
    
    // Handle successful registration without immediate login
    if (data.user) {
      toast.success(data.message || 'Registered successfully');
      navigate('/register'); // Redirect to login page instead
      return data.user;
    }
    
    throw new Error('Unexpected response format');
  } catch (error) {
    const errorMessage = error.response?.data?.error || 
                       error.message || 
                       "Registration failed";
    setAuthError(errorMessage);
    toast.error(errorMessage);
    throw error;
  } finally {
    setIsLoading(false);
  }
};
  const logout = () => {
    localStorage.removeItem('authToken');
    delete authApi.defaults.headers.common['Authorization'];
    delete restaurantApi.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const value = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isLoading,
    authError
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);