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
            if (restaurantResponse.data.restaurant.status.toLowerCase() !== 'approved') {
              throw new Error(restaurantResponse.data.message || 
                `Your account is ${restaurantResponse.data.restaurant.status}. Please wait for approval.`);
            }
            
            // If approved, set user with restaurant data
            setUser({ ...data.user, restaurant: restaurantResponse.data.restaurant });
            toast.success('Logged in successfully');
            navigate('/homepage');
            return { ...data.user, restaurant: restaurantResponse.data.restaurant };
          } else {
            throw new Error('Restaurant not found for this admin account');
          }
        } catch (restaurantError) {
          console.error('Restaurant verification error:', restaurantError);
          
          // Handle specific restaurant service errors
          if (restaurantError.response?.status === 404) {
            throw new Error('Restaurant not found for this admin account');
          } else if (restaurantError.response?.data?.message) {
            throw new Error(restaurantError.response.data.message);
          } else {
            throw restaurantError;
          }
        }
      }
  
      // For non-restaurant-admin users
      setUser(data.user);
      toast.success('Logged in successfully');
      navigate('/dashboard');
      return data.user;
    } catch (error) {
      // Clear auth on any error
      localStorage.removeItem('authToken');
      delete authApi.defaults.headers.common['Authorization'];
      delete restaurantApi.defaults.headers.common['Authorization'];
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Login failed. Please try again.";
      
      setAuthError(errorMessage);
      toast.error(errorMessage, { autoClose: 8000 });
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
      
      // Check for successful response structure
      if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        authApi.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        restaurantApi.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data.user);
        toast.success(data.message || 'Registered successfully');
        navigate('/register');
      } else {
        throw new Error('Unexpected response format');
      }
      
      return data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Registration failed";
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