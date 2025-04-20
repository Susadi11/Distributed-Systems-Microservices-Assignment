import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantVerification from './pages/RestaurantVerification';
import UserManagement from './pages/UserManagement';
import Home from './Home';

function App() {
  return (
    <Routes>
      {/* Redirect root path to /admin/dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Admin dashboard routes with layout wrapper */}
      <Route path="/admin" element={<AdminDashboard />}>
        {/* Default admin route */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="verify-restaurants" element={<RestaurantVerification />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="transactions" element={<div>Transactions</div>} />
        <Route path="analytics" element={<div>Analytics</div>} />
        <Route path="account" element={<div>Account Settings</div>} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default App;
