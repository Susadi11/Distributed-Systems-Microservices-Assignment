import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MenuCatalog from "./pages/MenuCatalog";
import MenuList from "./pages/MenuList";
import AddProduct from "./pages/AddProduct";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";


export default function App() {
  return (
    <AuthProvider>
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration/>} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
         {/*Menu-related pages with role protection */}
         <Route
          path="/menu/catalog"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <MenuCatalog />
            </PrivateRoute>
          }
        />
        <Route
          path="/menu/list"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <MenuList />
            </PrivateRoute>
          }
        />
        <Route
          path="/menu/add"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <AddProduct />
            </PrivateRoute>
          }
        />
         <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </AuthProvider>
  );
}
