import React from 'react';
import Navbar from '../components/Utility/Navbar';
import Footer from "../components/Utility/Footer";
import Checkout from "../components/Checkout";

export default function CartPage() {
    return (
        <div>
            <Navbar />
            <Checkout/>
            <Footer/>
        </div>
    );
}
