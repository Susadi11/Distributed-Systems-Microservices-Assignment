import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/Axios'; // Keep your existing API setup
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
          // Set token for all future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token with backend
          const { data } = await api.get('/auth/me');
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
      const { data } = await api.post('/auth/login', { email, password });
      
      // Check if user status is approved (if your API implements status checks)
      if (data.user.status && data.user.status !== 'approved') {
        throw new Error('Your account is pending approval. Please wait for admin approval.');
      }
      
      // Save token to localStorage
      localStorage.setItem('authToken', data.token);
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      // Set user state
      setUser(data.user);
      
      // Show success message
      toast.success('Logged in successfully');
      
      // Redirect based on role
      navigate(data.user.role === 'resturant_admin' ? '/dashboard' : '/');
      
      return data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Login failed";
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
      const { data } = await api.post('/auth/register', userData);
      
      // Check for successful response structure
      if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data.user);
        toast.success(data.message || 'Registered successfully');
        navigate('/');
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
    delete api.defaults.headers.common['Authorization'];
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