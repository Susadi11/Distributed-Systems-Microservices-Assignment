import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import RestaurantMenu from "./pages/RestaurantMenu";
import RestaurantsList from "./pages/RestaurantsList";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import PendingPage from "./pages/PendingPage";
import SelectPayment from "./pages/SelectPayment";
import StripePayment from "./pages/StripePayment";
import {Elements} from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/menu/:restaurantId" element={<RestaurantMenu/>} />
                        <Route path="/restaurants" element={<RestaurantsList />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/pending" element={<PendingPage />} />
                        <Route path="/select-payment" element={<SelectPayment />} />
                        <Route path="/stripe" element={<Elements stripe={stripePromise}><StripePayment /></Elements>}/>
                    </Route>
                </Routes>
            </CartProvider>
        </AuthProvider>
    );
}