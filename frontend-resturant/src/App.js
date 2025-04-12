import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      
        <Routes>
        
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['resturant_admin', 'admin']}>
              <Dashboard />
            </PrivateRoute>
          } /> */}
        </Routes>
    
    </AuthProvider>
  );
}