import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/Axios'; // Adjust the import path as necessary


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await axios.get('/auth/me');
          setUser(data.user);
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

// In AuthContext.js
const login = async (email, password) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    
    
    navigate(data.user.role === 'resturant_admin' ? '/dashboard': '/');
    
  } catch (error) {
    // Error handling
  }
};

// In your AuthContext.js
const register = async (userData) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    
    // Check for successful response structure
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      toast.success(data.message || 'Registered successfully');
      // navigate(data.user.role === 'resturant_admin' ? '/login': '/');
      navigate('/login');
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    toast.error(error.response?.data?.error || error.message || 'Registration failed');
    throw error;
  }
};
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);