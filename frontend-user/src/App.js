import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import {LoginPage} from "./pages/LoginPage";
import {SignupPage} from "./pages/SignupPage";
import RestaurantMenu from "./pages/RestaurantMenu";
import RestaurantsList from "./pages/RestaurantsList";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/menu" element={<RestaurantMenu />} />
            <Route path="/restaurants" element={<RestaurantsList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
    );
}