import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantVerification from './pages/RestaurantVerification';
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';
import Home from './Home';
import AdminLogin from './pages/AdminLogin';
import Transactions from './pages/Transactions';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isAdmin') === 'true'
  );

  const location = useLocation();

  // Sync state with localStorage changes (e.g., on login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isAdmin') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Recheck on location change (for internal navigation)
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isAdmin') === 'true');
  }, [location]);

  return (
    <Routes>
      {/* Root route based on login */}
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? "/admin/dashboard" : "/admin/login"} replace />}
      />

      {/* Login route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected routes */}
      <Route
        path="/admin"
        element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/login" replace />}
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="verify-restaurants" element={<RestaurantVerification />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="transactions" element={<Transactions />}/>
        <Route path="analytics" element={<Analytics />} />
        <Route path="account" element={<div>Account Settings</div>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
