import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import MenuList from "./pages/MenuList";
import AddProduct from "./pages/AddProduct";
import Registration from "./pages/Registration";
import HomePage from "./pages/HomePage";

import MainPage from "./pages/MainPage";
import RestaurantOrders from "./pages/RestaurantOrders";
import RestaurantPayments from "./pages/RestaurantPayments";



export default function App() {
  return (
    <AuthProvider>
      <Routes>
      <Route path="/" element={<MainPage/>} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        
        

     
        {/* <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <Dashboard />
            </PrivateRoute>
          }
        /> */}
        
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
          path="/restaurant/:restaurantId/payments"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <RestaurantPayments />
            </PrivateRoute>
          }
        />
         
         {/* <Route
          path="/register"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <Registration />
            </PrivateRoute>
          }
        /> */}
        <Route
          path="/homepage"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/restaurant/:restaurantId/orders"
          element={
            <PrivateRoute allowedRoles={['resturant_admin']}>
              <RestaurantOrders />
            </PrivateRoute>
          }
        />
       
      </Routes>
      <ToastContainer />
    </AuthProvider>
  );
}
