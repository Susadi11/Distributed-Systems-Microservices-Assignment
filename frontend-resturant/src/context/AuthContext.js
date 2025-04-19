import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

import api from '../api/Axios'; // Adjust the import path as necessary
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Import useNavigate from react-router-dom

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
  
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
  
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
  
      // Redirect based on role
      navigate(data.user.role === 'resturant_admin' ? '/dashboard' : '/');
    } catch (error) {
      console.log("Login error:", error); // 🧪 for debugging
      const errorMessage = error.response?.data?.error || "Login failed";
      toast.error(errorMessage, { autoClose: 8000 }); // 👈 this must be visible
      // DO NOT navigate here. Let the user stay on login page.
    }
  };
  
  
  
  
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/'; // ✅ safe redirect
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
     
window.location.href = '/';

    } else {
      throw new Error('Unexpected response format');
    }
  } catch (err) {
    const errorMessage = err.response?.data?.error || "Login failed";
    toast.error(errorMessage);
  }
  
};
  // Duplicate logout function removed

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);