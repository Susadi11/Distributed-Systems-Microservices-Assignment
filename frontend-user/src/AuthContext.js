import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is logged in on initial load
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Set default headers for all requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    // Try to get user profile
                    const response = await axios.get('http://localhost:5555/auth/me');
                    setUser(response.data.user);
                } catch (err) {
                    // Token is invalid or expired
                    localStorage.removeItem('authToken');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:5555/auth/login', {
                email,
                password
            });

            // Save token and user data
            const { token, user } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set default headers for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:5555/auth/register', userData);

            // Save token and user data
            const { token, user } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set default headers for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            return user;
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        // Remove token and user from storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // Remove Authorization header
        delete axios.defaults.headers.common['Authorization'];

        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);