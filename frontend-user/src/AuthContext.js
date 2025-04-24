import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const clearAuth = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.get('http://localhost:5555/auth/me');
                    setUser(response.data.user);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                } catch (err) {
                    clearAuth(); // Replaced handleLogout with clearAuth
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const handleLoginSuccess = (token, user) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        setError(null);
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('http://localhost:5555/auth/login', { email, password });
            handleLoginSuccess(response.data.token, response.data.user);
            return response.data.user;
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('http://localhost:5555/auth/register', userData);
            handleLoginSuccess(response.data.token, response.data.user);
            return response.data.user;
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        clearAuth();
        navigate('/login');
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const updateAddress = async (address) => {
        try {
            setLoading(true);
            const response = await axios.put('http://localhost:5555/auth/update-address', { address });
            updateUser(response.data.user);
            return response.data.user;
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update address');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            register,
            logout,
            updateUser,
            updateAddress
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};